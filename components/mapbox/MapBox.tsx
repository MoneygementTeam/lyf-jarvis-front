'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/store/useMapStore'
import { coordinate } from '@/components/mapbox/coordinate/coordinate'
import { useDijkstraStore } from '@/store/useDijkstraStore'
import { useDirectionStore } from '@/store/useDirectionStore'
import { fetchRoute } from '@/utils/api/routeApi'
import { fetchRecommendations } from '@/utils/api/recommendApi'
import { RouteMarker } from '@/components/mapbox/MapRouteMarkers'
import { addMarkers } from '@/components/mapbox/MapRouteMarkers'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapComponentProps {
  setIsFinalModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsShow: (isShow:boolean) => void
}

const MapComponent: React.FC<MapComponentProps> = ({ setIsFinalModal, setIsShow }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const gid = Number(searchParams.get('gid'));
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { longitude, latitude, init, setLatitude, setLongitude, setInit } =
    useMapStore()
  const coordinates = coordinate
  const { isSimulation } = useDijkstraStore()
  const { setFinished } = useDirectionStore()
  const { setDirection } = useDirectionStore()

  const prevCoordinate = useRef<[number, number] | null>(null)

  // 두 좌표 간의 각도를 계산하는 함수
  const calculateAngle = (prevCoord: [number, number], newCoord: [number, number]) => {
    const [prevLongitude, prevLatitude] = prevCoord
    const [newLongitude, newLatitude] = newCoord
    // Math.atan2는 두 점 사이의 방향을 라디안 단위의 각도로 반환
    const angle = Math.atan2(newLatitude - prevLatitude, newLongitude - prevLongitude)
    // atan2는 우측 기준이므로 반환된 각도를 북쪽을 0도로 기준으로 설정하기 위해 + Math.PI / 2라디안(90도)
    // + 2 * Math.PI는 각도가 음수일 때 양수로 변환하기 위해 추가
    // % (2 * Math.PI)는 0에서 360도(2 * Math.PI 라디안) 범위로 제한함
    return (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI)
  }

  const fetchData = async () => {
    try {
      // groupId를 이용해 추천 좌표 가져오기
      const recommendations:RouteMarker[] = await fetchRecommendations(gid)
      
      // recommendations에서 latitude와 longitude로 points 배열 구성
      const points:number[][] = recommendations.map(marker => [marker.longitude, marker.latitude])
      
      // 경로 데이터를 받아와 초기화
      const routeCoordinates:number[][] = await fetchRoute(points)
      console.log("Route Coordinates:", routeCoordinates)
      initMap(routeCoordinates, recommendations)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }


  useEffect(() => {
    if (!init) {
      // 초기값 하드코딩 나중에는 값을 예정
      setLatitude(1.2833)
      setLongitude(103.8603)
      setInit(true)
      fetchData()
      setIsShow(true)
    } else {
      map.current?.setCenter([longitude, latitude])
    }
    console.log('latitude', latitude, 'longitude', longitude)
  }, [latitude, longitude])

  const delay = (ms: number | undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  const moveAlongCoordinates = async () => {
    for (const coordinate of coordinates) {
      if (prevCoordinate.current) {
        const angle = calculateAngle(prevCoordinate.current, [coordinate[0], coordinate[1]])
        setDirection({ y: angle })
      }
      prevCoordinate.current = [coordinate[0], coordinate[1]] // 매 반복마다 prevCoordinate 업데이트
      map.current?.setCenter([coordinate[0], coordinate[1]])
      await delay(50)
    }
    setFinished(true)
    setIsFinalModal(true)
    setIsShow(true)
  }

  // 슝슝
  useEffect(() => {
    if (isSimulation) {
      setFinished(false)
      moveAlongCoordinates()
    }
  }, [isSimulation])

  const initMap = (routeCoordinates: number[][], recommendations:RouteMarker[]) => {
    if (map.current || !mapContainer.current) {
      return
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [latitude, longitude],
      zoom: 17,
      pitch: 60,
      bearing: -20,
    })

    map.current.on('style.load', () => {
      map.current?.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          type: 'LineString',
          coordinates: coordinates,
        },
      })

      map.current?.addLayer({
        id: 'line',
        source: 'line',
        type: 'line',
        paint: {
          'line-width': 12,
          'line-emissive-strength': 0.8,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'red',
            1,
            'blue',
          ],
        },
      })

      if (map.current) {
        console.log("recommendations : " + recommendations)
        addMarkers(map.current, recommendations)
      }
    })
  }

  return (
    <article>
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
        }}
      />
    </article>
  )
}

export default MapComponent

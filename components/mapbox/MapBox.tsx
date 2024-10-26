'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/store/useMapStore'
import { coordinate } from '@/components/mapbox/coordinate/coordinate'
import { useModalStore } from '@/store/useModalStore'
import { useDijkstraStore } from '@/store/useDijkstraStore'
import { useDirectionStore } from '@/store/useDirectionStore'

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { longitude, latitude, init, setLatitude, setLongitude, setInit } =
    useMapStore()
  const { setIsShow } = useModalStore()
  const coordinates = coordinate
  const { isSimulation } = useDijkstraStore()
  const { setFinished } = useDirectionStore()

  useEffect(() => {
    if (!init) {
      // 초기값 하드코딩 나중에는 값을 예정
      setLatitude(37.2153254)
      setLongitude(126.9752034)
      setInit(true)
      initMap()

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
      map.current?.setCenter([coordinate[0], coordinate[1]])
      await delay(500)
    }
    setFinished(true)
  }

  // 슝슝
  useEffect(() => {
    if (isSimulation) {
      setFinished(false)
      moveAlongCoordinates()
    }
  }, [isSimulation])

  const initMap = () => {
    if (map.current || !mapContainer.current) {
      return
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [latitude, longitude],
      zoom: 20,
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
        new mapboxgl.Marker({ color: 'green' })
          .setLngLat([126.975275, 37.215837])
          .addTo(map.current)

        new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([127.121747, 37.383164])
          .addTo(map.current)
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

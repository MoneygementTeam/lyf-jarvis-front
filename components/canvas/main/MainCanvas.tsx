'use client'

import { Canvas } from '@react-three/fiber'
import { RootMap } from '@/components/canvas/map/RootMap'
import { useEffect, useState } from 'react'
import { useMapStore } from '@/store/useMapStore'
import { useDirectionStore } from '@/store/useDirectionStore'

export const BASE_CENTER = 0.00003

export const MainCanvas = () => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const { incrementLatitude, incrementLongitude } = useMapStore()
  const { setDirection, setFinished } = useDirectionStore()

  useEffect(() => {
    setAspectRatio(window.innerWidth / window.innerHeight)
  }, [])
  if (aspectRatio === null) return null

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = event.clientX * 0.0000001
    const offsetY = event.clientY * 0.0000001

    console.log(`offsetX : ${offsetX}, offsetY : ${offsetY}`)
    console.log(
      `event.clientX : ${event.clientX}, event.clientY : ${event.clientY}`
    )

    setDirection({ y: event.clientY })

    if (offsetX > BASE_CENTER) {
      incrementLongitude(offsetY)
    } else {
      incrementLongitude(-offsetY)
    }

    if (offsetY > BASE_CENTER) {
      incrementLatitude(-offsetX)
    } else {
      incrementLatitude(offsetX)
    }
  }

  return (
    <Canvas
      id="canvas"
      gl={{ antialias: true }}
      camera={{
        fov: 30,
        aspect: aspectRatio,
        near: 0.01,
        far: 10000,
        position: [12, 12, 12],
      }}
      // onClick={handleClick}
    >
      <ambientLight name="ambientLight" intensity={5} />
      <RootMap />
    </Canvas>
  )
}

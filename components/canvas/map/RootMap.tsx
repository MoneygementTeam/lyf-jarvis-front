'use client'

import { useThree } from '@react-three/fiber'
import { Camera, Vector3 } from 'three'
import { useEffect, useRef } from 'react'
import { GroundElements } from '@/components/canvas/map/floor/GroundElements'
import { usePlayersStore } from '@/store/usePlayersStore'
import { Kid } from '@/components/player/character/Kid'

export const RootMap = () => {
  const { players } = usePlayersStore()
  const camera = useThree((three) => three.camera as Camera)
  const controls = useRef<{ target: Vector3 } | null>(null)

  useEffect(() => {
    if (!controls.current) return
    camera.position.set(10, 10, 10)
    controls.current.target.set(0, 0, 0)
  }, [camera.position])

  return (
    <>
      <GroundElements />
      <Kid player={players[0]} position={{ x: 0, y: 0, z: 0 }} />
    </>
  )
}

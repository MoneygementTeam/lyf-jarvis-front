'use client'

import { useLoader } from '@react-three/fiber'
import { RepeatWrapping, TextureLoader } from 'three'
import { GROUP_MAP_SIZE } from '@/constant/constants'

export const Floor = () => {
  const sandTexture = useLoader(TextureLoader, '/sand.jpg')
  sandTexture.wrapS = RepeatWrapping
  sandTexture.wrapT = RepeatWrapping
  sandTexture.repeat.x = 5
  sandTexture.repeat.y = 5

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.001}>
      <planeGeometry args={[GROUP_MAP_SIZE, GROUP_MAP_SIZE]} />
      <meshStandardMaterial map={sandTexture} />
    </mesh>
  )
}

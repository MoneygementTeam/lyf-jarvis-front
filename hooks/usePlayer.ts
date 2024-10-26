'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Object3D, Vector3 } from 'three'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Player, usePlayersStore } from '@/store/usePlayersStore'
import { SkeletonUtils } from 'three-stdlib'
import { useFrame, useGraph } from '@react-three/fiber'
import { useDirectionStore } from '@/store/useDirectionStore'

interface UsePlayerProps {
  player: Player
  position: { x: number; y: number; z: number }
}

export const usePlayer = ({ player, position }: UsePlayerProps) => {
  const playerId = player?.id
  const { me, playerGroundStructuresFloorPlaneCorners } = usePlayersStore()
  const { isFinished } = useDirectionStore()

  const memoizedPosition = useMemo(() => position, [position])

  const nicknameRef = useRef<Object3D | null>(null)
  const playerRef = useRef<Object3D | null>(null)

  const { scene, materials, animations } = useGLTF(
    (() => {
      return '/models/Steve.glb'
    })()
  )

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const objectMap = useGraph(clone)
  const nodes = objectMap.nodes

  const [animation, setAnimation] = useState<string>(
    'CharacterArmature|CharacterArmature|CharacterArmature|Idle'
  )
  const { actions } = useAnimations(animations, playerRef)

  useEffect(() => {
    setAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Run')
    actions[animation]?.reset().fadeIn(0.5).play()
  }, [isFinished])

  useFrame(({ camera }) => {
    if (!player || !playerRef.current) return

    if (playerRef.current.position.distanceTo(position) > 0.1) {
      const direction = playerRef.current.position
        .clone()
        .sub(position)
        .normalize()
        .multiplyScalar(0.1)
      playerRef.current.position.sub(direction)
      playerRef.current.lookAt(new Vector3(position.x, position.y, position.z))

      if (actions.walk) {
        setAnimation('walk')
      } else {
        setAnimation(
          'CharacterArmature|CharacterArmature|CharacterArmature|Run'
        )
      }
    } else {
      setAnimation('CharacterArmature|CharacterArmature|CharacterArmature|Idle')
    }

    if (nicknameRef.current) {
      nicknameRef.current.position.set(
        playerRef.current.position.x,
        playerRef.current.position.y + 3.5,
        playerRef.current.position.z
      )
      nicknameRef.current.lookAt(10000, 10000, 10000)
    }

    if (me?.id === playerId) {
      camera.position.set(
        playerRef.current.position.x + 12,
        playerRef.current.position.y + 12,
        playerRef.current.position.z + 12
      )
      camera.lookAt(playerRef.current.position)

      const currentCloseStructure =
        playerGroundStructuresFloorPlaneCorners.find((structure) => {
          return (
            playerRef.current!.position.x < structure.corners[0].x &&
            playerRef.current!.position.x > structure.corners[2].x &&
            playerRef.current!.position.z < structure.corners[0].z &&
            playerRef.current!.position.z > structure.corners[2].z
          )
        })

      if (currentCloseStructure) {
        camera.lookAt(
          new Vector3(
            currentCloseStructure.position.x,
            undefined,
            currentCloseStructure.position.z
          )
        )
        camera.position.set(
          playerRef.current.position.x + 6,
          playerRef.current.position.y + 6,
          playerRef.current.position.z + 6
        )
      }
    }
  })

  return {
    me,
    nicknameRef,
    playerRef,
    memoizedPosition,
    playerId,
    nodes,
    materials,
  }
}

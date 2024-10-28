'use client'

import { Group, SkinnedMesh, Vector3 } from 'three'
import { usePlayer } from '@/hooks/usePlayer'
import { Player } from '@/store/usePlayersStore'
import React, { useEffect } from 'react'
import { useDirectionStore } from '@/store/useDirectionStore'

export interface KidProps {
  player: Player
  position: { x: number; y: number; z: number }
}

export const Kid = ({ player, position }: KidProps) => {
  const { playerRef, memoizedPosition, playerId, nodes, materials } = usePlayer(
    {
      player,
      position,
    }
  )
  const { direction } = useDirectionStore()

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.rotation.y = direction.y
    }
  }, [direction])
  
  return (
    <>
      <group
        ref={playerRef as React.RefObject<Group>}
        position={
          new Vector3(
            memoizedPosition.x,
            memoizedPosition.y,
            memoizedPosition.z
          )
        }
        name={playerId ?? ''}
        dispose={null}
      >
        <group name="Root_Scene">
          <group name="RootNode">
            <group
              name="CharacterArmature"
              rotation={[-Math.PI / 2, 0, 0]}
              scale={80}
            >
              <primitive object={nodes.Root} />
            </group>
            <skinnedMesh
              name="Character"
              geometry={(nodes.Character as SkinnedMesh).geometry}
              material={materials.Atlas}
              skeleton={(nodes.Character as SkinnedMesh).skeleton}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={80}
            />
          </group>
        </group>
      </group>
    </>
  )
}

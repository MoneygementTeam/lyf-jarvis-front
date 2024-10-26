import { create } from 'zustand'

export interface Player {
  id: string
  name: string
  position: { x: number; y: number; z: number }
}

export interface StructureBoundingBox {
  name: string
  box: {
    max: { x: number; z: number }
    min: { x: number; z: number }
  }
  position: { x: number; z: number }
}

interface UsePlayersStore {
  players: Player[]
  setPlayers: (players: Player[]) => void

  me: Player | undefined
  setMe: (me: Player | undefined) => void

  playGroundStructuresBoundingBox: StructureBoundingBox[]
  setPlayGroundStructuresBoundingBox: (
    structures: StructureBoundingBox[]
  ) => void

  playerGroundStructuresFloorPlaneCorners: {
    name: string
    corners: { x: number; z: number }[]
    position: { x: number; z: number }
  }[]
  calculateFloorPlaneCorners: () => void
}

export const usePlayersStore = create<UsePlayersStore>((set, get) => ({
  players: [],
  setPlayers: (players) => set({ players }),

  me: undefined,
  setMe: (me) => set({ me }),

  playGroundStructuresBoundingBox: [],
  setPlayGroundStructuresBoundingBox: (structures) =>
    set({ playGroundStructuresBoundingBox: structures }),

  playerGroundStructuresFloorPlaneCorners: [],
  calculateFloorPlaneCorners: () => {
    const boundingBoxes = get().playGroundStructuresBoundingBox
    const corners = boundingBoxes.map((item) => ({
      name: item.name,
      corners: [
        {
          x: item.box.max.x + item.position.x,
          z: item.box.max.z + item.position.z,
        },
        {
          x: item.box.max.x + item.position.x,
          z: item.box.min.z + item.position.z,
        },
        {
          x: item.box.min.x + item.position.x,
          z: item.box.min.z + item.position.z,
        },
        {
          x: item.box.min.x + item.position.x,
          z: item.box.max.z + item.position.z,
        },
      ],
      position: item.position,
    }))
    set({ playerGroundStructuresFloorPlaneCorners: corners })
  },
}))

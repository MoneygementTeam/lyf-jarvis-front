import { create } from 'zustand'

export interface Distance {
  latitude: number
  longitude: number
}

export interface Dijkstra {
  distances: Distance[]
  setDistances: (distances: Distance[]) => void
  isSimulation: boolean
  setIsSimulation: (isSimulation: boolean) => void
}

export const useDijkstraStore = create<Dijkstra>((set) => ({
  distances: [],
  setDistances: (distances) => set({ distances }),
  isSimulation: false,
  setIsSimulation: (isSimulation) => set({ isSimulation }),
}))

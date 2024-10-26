import { create } from 'zustand'

export interface Position {
  latitude: number
  longitude: number
  init: boolean
  setLatitude: (latitude: number) => void
  setLongitude: (longitude: number) => void
  setInit: (init: boolean) => void

  incrementLatitude(offset: number): void
  incrementLongitude(offset: number): void
}

export const useMapStore = create<Position>((set) => ({
  latitude: 0, // 올라가면 오른쪽이동
  longitude: 0, // 올라가면 왼쪽
  init: false,

  setLatitude: (latitude) => set({ latitude }),
  setLongitude: (longitude) => set({ longitude }),
  setInit: (init) => set({ init }),

  incrementLatitude: (offset) =>
    set((state) => ({ latitude: state.latitude + offset })),
  incrementLongitude: (offset) =>
    set((state) => ({ longitude: state.longitude + offset })),
}))

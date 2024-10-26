import { create } from 'zustand'

export interface Direction {
  direction: { y: number }
  setDirection: (direction: { y: number }) => void
  isFinished: boolean
  setFinished: (isFinished: boolean) => void
}

export const useDirectionStore = create<Direction>((set) => ({
  direction: { y: 0 },
  setDirection: (direction) => set({ direction }),
  isFinished: true,
  setFinished: (isFinished) => set({ isFinished }),
}))

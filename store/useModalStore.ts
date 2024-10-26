import { create } from 'zustand'

export interface ModalProp {
  isShow: boolean
  setIsShow: (isShow: boolean) => void
}

export const useModalStore = create<ModalProp>((set) => ({
  isShow: false,
  setIsShow: (isShow) => set({ isShow }),
}))

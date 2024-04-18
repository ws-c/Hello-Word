import { create } from 'zustand'

type Store = {
  isMuted: boolean
  changeMuted: () => void
}

export const useSettingStore = create<Store>()((set) => ({
  isMuted: false,
  changeMuted: () => set((state) => ({ isMuted: !state.isMuted })),
}))

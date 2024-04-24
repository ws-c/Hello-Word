import { getUserToken } from '@/utils/localStorage'
import { create } from 'zustand'


type SettingStore = {
  isMuted: boolean
  changeMuted: () => void
}

type TenWordStore = {
  tenWord: number
  addTenWord: () => void
  formatTenWord: () => void
}
type UserStore = {
  USER_TOKEN: string
}


// 静音设置
export const useSettingStore = create<SettingStore>((set) => ({
  isMuted: false,
  changeMuted: () => set((state) => ({ isMuted: !state.isMuted })),
}))

// 十个单词状态
export const useTenWordStore = create<TenWordStore>((set) => ({
  tenWord: 1,
  addTenWord: () => set((state) => ({ tenWord: state.tenWord + 1 })),
  formatTenWord: () => set(() => ({ tenWord: 1 })),
}))

// USER_TOKEN
export const useUserStore = create<UserStore>((set) => ({
  USER_TOKEN: getUserToken()!,
}))

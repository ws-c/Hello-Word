import { getLocalTheme, getUserToken } from '@/utils/localStorage'
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
type CardStore = {
  CardNumber: string
}
type ThemeStore = {
  Theme: string
  setTheme: () => void
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

// 打卡
export const useCardStore = create<CardStore>((set) => ({
  CardNumber: getUserToken()!,
}))

// 双色模式
export const useThemeStore = create<ThemeStore>((set) => ({
  Theme: getLocalTheme()!,
  setTheme: () =>
    set((state) => ({ Theme: state.Theme === 'light' ? 'dark' : 'light' })),
}))

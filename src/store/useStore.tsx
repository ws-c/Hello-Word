import { create } from 'zustand'

// 定义第一个自定义 hook 的类型
type SettingStore = {
  isMuted: boolean
  changeMuted: () => void
}

// 定义第二个自定义 hook 的类型
type TenWordStore = {
  tenWord: number
  addTenWord: () => void
  formatTenWord: () => void
}

// 创建第一个自定义 hook
export const useSettingStore = create<SettingStore>((set) => ({
  isMuted: false,
  changeMuted: () => set((state) => ({ isMuted: !state.isMuted })),
}))

// 创建第二个自定义 hook
export const useTenWordStore = create<TenWordStore>((set) => ({
  tenWord: 1,
  addTenWord: () => set((state) => ({ tenWord: state.tenWord + 1 })),
  formatTenWord: () => set(() => ({ tenWord: 1 })),
}))

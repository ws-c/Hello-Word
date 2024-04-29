'use client'
import { useEffect, useState } from 'react'
import './index.css'
import { getLocalTheme, setLocalTheme } from '@/utils/localStorage'
import { useThemeStore } from '@/store/useStore'
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>(getLocalTheme()!)
  const [isChecked, setIsChecked] = useState(false)
  const { setTheme : global_setTheme } = useThemeStore()

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.dataset.theme = newTheme
    setLocalTheme(newTheme)
    global_setTheme()
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    if(theme === 'dark'){
      setIsChecked(true)
    }else{
      setIsChecked(false)
    }
  }, [theme])

  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleTheme}
        />{' '}
        {/* Move onChange handler here */}
        <span className="slider round"></span>
      </label>
    </>
  )
}

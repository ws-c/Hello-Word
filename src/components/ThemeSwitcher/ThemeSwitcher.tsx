'use client'
import { useState } from 'react'
import { Switch } from 'antd'
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>('light')

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      document.documentElement.dataset.theme = theme
    } else {
      setTheme('light')
      document.documentElement.dataset.theme = theme
    }
  }
  const onChange = (checked: boolean) => {
    toggleTheme()
    console.log(`switch to ${checked}`)
  }
  return <Switch defaultChecked onChange={onChange} />
}

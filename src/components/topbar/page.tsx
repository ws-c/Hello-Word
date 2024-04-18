'use client'
import Link from 'next/link'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'
import { SearchOutlined, SettingOutlined } from '@ant-design/icons'
import Image from 'next/image'
import starBook from '@/assets/starBook.png'
import Setting from '../setting/Setting'
import { useState } from 'react'
import Search from '../search/Search'
export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)

  const onClose = () => {
    setOpen(false)
  }
  const onCloseSearch = () => {
    setOpenSearch(false)
  }
  return (
    <header className="header">
      <Link href="/">
        <div className="logo">
          <span>Hello Word</span>
        </div>
      </Link>
      <div className="tool-bar">
        <ThemeSwitcher></ThemeSwitcher>
        <div onClick={() => setOpenSearch(true)}>
          <SearchOutlined className="Header-Font search-icon"></SearchOutlined>
        </div>
        <div>
          <Link href="/star-book">
            <Image
              className="Header-Font starBook-icon"
              src={starBook}
              alt="starBook"
              width={30}
              height={32}
            ></Image>
          </Link>
        </div>
        <div>
          <SettingOutlined
            onClick={() => setOpen(true)}
            className="Header-Font Setting"
          ></SettingOutlined>
        </div>
      </div>
      {open && <Setting onClose={onClose}></Setting>}
      {openSearch && <Search onCloseSearch={onCloseSearch}></Search>}
    </header>
  )
}

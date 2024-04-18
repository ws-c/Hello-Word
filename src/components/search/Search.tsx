import React, { useEffect, useRef, useState } from 'react'
import style from './index.module.css'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface ChildProps {
  onCloseSearch: () => void
}
const Search: React.FC<ChildProps> = ({ onCloseSearch }) => {
  const router = useRouter()
  const [searchText, setSearchText] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleInputClick = (event: any) => {
    event.stopPropagation() // 阻止事件冒泡到父元素
  }
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault() // 阻止表单默认提交行为
    console.log(searchText.trim())
    router.push(`/search/${searchText.trim()}`)
    onCloseSearch()
  }
  // 更新输入框中的文本
  const handleChange = (event: any) => {
    setSearchText(event.target.value)
  }
  const handleSearch = (event: any) => {
    event.stopPropagation()
    console.log(searchText.trim())
    router.push(`/search/${searchText.trim()}`)
    onCloseSearch()
  }
  // 当组件加载完成后，自动聚焦到输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  return (
    <div className={style.blurContainer} onClick={onCloseSearch}>
      <form className={style.searchContainer} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onClick={handleInputClick}
          onChange={handleChange}
        />
        <SearchOutlined className={style.searchIcon} onClick={handleSearch} />
      </form>
    </div>
  )
}

export default Search

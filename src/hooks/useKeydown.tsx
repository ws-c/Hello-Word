import { useEffect } from 'react'
import debounce from '../utils/debounce'
type tsProp = {
  onPlay?: (type: string, word: string) => void
  word?: { cet4_word: string } | undefined
  setWordState?: (flag: boolean) => void
  banKeydown?: string
  flag?: string
}
export default function useKeydown({
  onPlay,
  word,
  setWordState,
  banKeydown,
  flag,
}: tsProp) {
  useEffect(() => {
    const handleKeyDown = debounce((event: KeyboardEvent) => {
      if (onPlay) {
        if (event.key === 'z') {
          // 在按下 Z 键时触发
          onPlay('1', word?.cet4_word!)
        }
        if (event.key === 'x') {
          // 在按下 x 键时触发
          onPlay('2', word?.cet4_word!)
        }
      }
      if (setWordState) {
        if (event.key === 'ArrowLeft' && banKeydown === 'ArrowLeft') {
          // 在按下 左方向键 时触发
          setWordState(false)
        }
        if (event.key === 'ArrowRight') {
          // 在按下 右方向键 时触发
          if (flag && flag === 'know') {
            setWordState(true)
          } else if (flag && flag === 'forget') {
            setWordState(false)
          } else {
            setWordState(true)
          }
        }
      }
    }, 500)
    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyDown)
    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [banKeydown, flag, onPlay, setWordState, word?.cet4_word])
}

import { useEffect } from 'react'
import debounce from '../utils/debounce'
type tsProp = {
  onPlay: (type: string, word: string) => void
  word: { cet4_word: string } | undefined
  setWordState?: (flag: boolean) => void
}
export default function useKeydown({ onPlay, word, setWordState }: tsProp) {
  useEffect(() => {
    const handleKeyDown = debounce((event: KeyboardEvent) => {
      if (event.key === 'z') {
        // 在按下 Z 键时触发
        onPlay('1', word?.cet4_word!)
      }
      if (event.key === 'x') {
        // 在按下 x 键时触发
        onPlay('2', word?.cet4_word!)
      }
      if (setWordState) {
        if (event.key === 'ArrowLeft') {
          // 在按下 左方向键 时触发
          setWordState(false)
        }
        if (event.key === 'ArrowRight') {
          // 在按下 右方向键 时触发
          setWordState(true)
        }
      }
    }, 300)
    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyDown)
    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onPlay, setWordState, word?.cet4_word])
}

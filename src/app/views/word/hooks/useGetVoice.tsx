import { useState } from 'react'

export default function useGetVoice() {
  const [, setAudioUrl] = useState('')
  const getVoice = async (type: string, audio: string) => {
    try {
      const res = await fetch(`/apis/getVoice?type=${type}&audio=${audio}`)
      if (res.ok) {
        const blob = await res.blob() // 获取音频文件的 Blob 数据
        const audioUrl = URL.createObjectURL(blob) // 创建 Blob 对象的 URL
        setAudioUrl(audioUrl) // 更新音频文件的 URL
        // 创建一个新的音频对象
        const wordAudio = new Audio(audioUrl)
        // 播放音频
        wordAudio.play()
      } else {
        console.error('Error fetching data:', res.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return {getVoice }
}

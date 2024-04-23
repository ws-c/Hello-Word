'use client'
import {
  getLocalGoal,
  getLocalIndex,
  getLocalTodayIndex,
  setLocalGoal,
  setLocalIndex,
  setLocalTodayIndex,
} from '@/utils/localStorage'
import './page.css'
import { InputNumber, Statistic } from 'antd'
import type { InputNumberProps } from 'antd'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import useGetData from '@/hooks/useGetData'
import type { word } from '@/types/word'
import useGetVoice from '@/hooks/useGetVoice'
import { useSettingStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
export default function First() {
  const router = useRouter()
  const [count, setCount] = useState(1)
  const [countToday, setCountToday] = useState(1)
  const [goal, setGoal] = useState(20)
  useEffect(() => {
    if (localStorage.getItem('index') === null) {
      setLocalIndex(1)
    }
    if (localStorage.getItem('TodayIndex') === null) {
      setLocalTodayIndex(1)
    }
    if (
      localStorage.getItem('goal') === null ||
      +localStorage.getItem('goal')! < 20
    ) {
      setLocalGoal(20)
    }
    setCount(getLocalIndex()! || 1)
    setCountToday(getLocalTodayIndex()! || 1)
    setGoal(getLocalGoal() || 20)
    const getWord = async () => {
      setWord(await fetchData(index!))
    }
    getWord()
  }, [])
  // 获取单词
  const [index, setIndex] = useState(getLocalIndex()! + getLocalTodayIndex()!)
  const [word, setWord] = useState<word>()
  const { fetchData } = useGetData()
  const onChange: InputNumberProps['onChange'] = (value) => {
    setGoal(+value!)
    setLocalGoal(+value!)
  }
  // 获取音频
  const { isMuted } = useSettingStore()
  const { getVoice } = useGetVoice()
  const onPlay = useCallback(
    (type: string, audio: string) => {
      if (isMuted) return
      getVoice(type, audio)
      router.push(`/word`)
    },
    [getVoice, isMuted, router]
  )
  return (
    <>
      <div className="plan-container">
        <h1>今日计划</h1>
        <div className="plan-box">
          <div className="new-box">
            <div>新学词</div>
            <InputNumber
              min={20}
              max={100}
              defaultValue={goal}
              onChange={onChange}
              changeOnWheel
            />
          </div>
          <Link href={'/word'}>
            <div
              onClick={() => onPlay('1', word?.cet4_word!)}
              className="new-box start-btn"
            >
              开始学习
            </div>
          </Link>
        </div>
      </div>
      <Statistic
        className="total-statistic"
        title="总进度"
        value={count === 1 ? 0 : count}
        suffix="/ 4485"
      />
      <Statistic
        className="today-statistic"
        title="今日完成"
        value={countToday - 1}
        suffix={`/ ${goal}`}
      />
      {/* <Word></Word> */}
    </>
  )
}

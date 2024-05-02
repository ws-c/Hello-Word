'use client'
import {
  getCardNumber,
  getLocalGoal,
  getLocalIndex,
  getLocalTodayIndex,
  getUserToken,
  setLocalGoal,
  setLocalIndex,
  setLocalTodayIndex,
  setUserToken,
} from '@/utils/localStorage'
import './page.css'
import { InputNumber, Progress, Statistic } from 'antd'
import type { InputNumberProps } from 'antd'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import useGetData from '@/hooks/useGetData'
import useGetVoice from '@/hooks/useGetVoice'
import { useSettingStore, useThemeStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import dictionary from '@/assets/dictionary.png'
import darkDictionary from '@/assets/dictionary-dark.png'
import calendar from '@/assets/calendar.png'
import darkCalendar from '@/assets/calendar-dark.png'
import dynamic from 'next/dynamic'

const Image = dynamic(() => import('next/image'), {
  ssr: false,
})

export default function First() {
  const { Theme } = useThemeStore()
  const [card, setCard] = useState<any>(0)
  const router = useRouter()
  const [count, setCount] = useState(1)
  const [countToday, setCountToday] = useState(1)
  const [goal, setGoal] = useState(20)
  // 初始化
  const initLocalIndex = () => {
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
  }
  // 用户注册
  const register = () => {
    let token = getUserToken()
    if (!token) {
      // 如果 localStorage 中没有 token，则生成新的 token
      const tokenKey = uuidv4().slice(0, 8) // 生成随机的 UUID
      setUserToken(tokenKey)
      fetch(`/apis/register?id=${tokenKey}`)
    }
  }

  // 获取单词
  const [index, setIndex] = useState(getLocalIndex()! + getLocalTodayIndex()!)
  const { word } = useGetData(index)
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
  // 首次渲染
  useEffect(() => {
    initLocalIndex()
    register()
    setCard(getCardNumber() || 0)
  }, [])
  // 跳转到词表页面
  const toDictionary = () => {
    router.push('/dictionary')
  }

  return (
    <>
      <div className="first-container">
        <div className="first-top">
          <div className="font-container">
            已打卡天数
            <Image
              className="calendar"
              src={Theme === 'dark' ? darkCalendar : calendar}
              alt="calendar"
              width={18}
              height={18}
            ></Image>
          </div>
          <p className="card">{card.cardNum ? card.cardNum : '0'}</p>
        </div>
        <div className="plan-container">
          <div className="plan-header">
            <div className="plan-header_left">
              <h3>英语四级乱序词汇 </h3> <span>&gt;</span>
            </div>
            <div className="font-container" onClick={toDictionary}>
              <Image
                src={Theme === 'dark' ? darkDictionary : dictionary}
                alt="dictionary"
                width={18}
                height={18}
              ></Image>
              词表
            </div>
          </div>
          <div className="plan-body">
            <div className="plan-header">
              <span className="percent">
                已学{((count / 4485) * 100).toFixed(1)}%
              </span>

              <span>{count === 1 ? 0 : count}/ 4485</span>
            </div>
            <Progress percent={(count / 4485) * 100} showInfo={false} />
          </div>
        </div>
        <div className="plan-container">
          <div className="plan-header">
            <h1>今日计划</h1>
            <div className="Statistic-container">
              <div className="finished">已完成：</div>
              <Statistic
                value={countToday - 1}
                suffix={`/ ${goal}`}
              />
            </div>
          </div>
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
      </div>
    </>
  )
}

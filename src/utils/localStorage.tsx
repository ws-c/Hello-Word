export const setLocalIndex = (index: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('index', '' + index)
  }
}

export const getLocalIndex = () => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('index') || '1')
  }
}
export const setLocalTheme = (theme: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme)
  }
}

export const getLocalTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light'
  }
}
// 今日完成数量
export const getLocalTodayIndex = () => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('TodayIndex') || '1')
  }
}
export const setLocalTodayIndex = (TodayIndex: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('TodayIndex', '' + TodayIndex)
  }
}
// 今日完成目标数量
export const getLocalGoal = () => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('goal') || '20')
  }
}
export const setLocalGoal = (goal: number) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('goal', '' + goal)
  }
}

export const getUserToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_token') || ''
  }
}
export const setUserToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_token', token)
  }
}
export const getCardNumber = () => {
  if (typeof window !== 'undefined') {
    const cardString = localStorage.getItem('CardNumber')
    if (cardString) {
      return JSON.parse(cardString)
    } else {
      return null
    }
  }
}
export const setCardNumber = (Card: { cardNum: number; date: Date }) => {
  if (typeof window !== 'undefined') {
    const cardString = JSON.stringify(Card)
    localStorage.setItem('CardNumber', cardString)
  }
}

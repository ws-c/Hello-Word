
export const setLocalIndex = (index: number) => {
  if (typeof window !== 'undefined'){
  localStorage.setItem('index', '' +index)
  }
}

export const getLocalIndex = () => {
  if (typeof window !== 'undefined'){
  return parseInt(localStorage.getItem('index') || '1')
  }
}
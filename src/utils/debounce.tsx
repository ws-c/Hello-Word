export default function debounce(func: Function, delay: number) {
  let timer: number | null = null
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function mergeEveryNumber(
  arr: any[],
  number: number,
  isSerialNum: boolean
): string[] {
  let mergedArr = []
  if (isSerialNum) {
    let j = 1
    for (let i = 0; i < arr.length; i += number) {
      let mergedStr = arr.slice(i, i + number).join('')
      mergedArr.push(`${j}. ` + mergedStr)
      j++
    }
  } else {
    for (let i = 0; i < arr.length; i += number) {
      let mergedStr = arr.slice(i, i + number).join('')
      mergedArr.push(mergedStr)
    }
  }

  return mergedArr
}

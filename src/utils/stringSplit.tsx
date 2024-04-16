export function mergeEveryThree(arr: any[]) {
  let mergedArr = []
  let j = 1
  for (let i = 0; i < arr.length; i += 3) {
    let mergedStr = arr.slice(i, i + 3).join('')
    mergedArr.push(`${j}. ` + mergedStr)
    j++
  }
  return mergedArr
}
// 冒泡排序
function popSort(data) {
  const arr = [...data]
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}

// 快排
function quickSort(arr) {
  if (arr.length <= 1) return arr
  const midIndex = Math.floor(arr.length / 2)
  const mid = arr.splice(midIndex, 1)[0]
  const leftArr = []
  const rightArr = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > mid) {
      rightArr.push(arr[i])
    } else {
      leftArr.push(arr[i])
    }
  }
  return [...quickSort(leftArr), mid, ...quickSort(rightArr)]
}

function selectSort(data) {
  const arr = [...data]
  for (let i = 0; i < arr.length; i++) {
    let min = arr[i]
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (min > arr[j]) {
        min = arr[j]
        minIndex = j
      }
    }
    if (min !== arr[i] && minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}

console.log(popSort([2, 1234, 45, 1, 342, 67, 3, 4]))
console.log(quickSort([2, 1234, 45, 1, 342, 67, 3, 4]))
console.log(selectSort([2, 1234, 45, 1, 342, 67, 3, 4]))

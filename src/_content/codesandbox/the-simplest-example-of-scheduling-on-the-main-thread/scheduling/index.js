import './main.css'

let sortPass = array => {
  let needOneMorePass = false

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] > array[i + 1]) {
      let temp = array[i]
      array[i] = array[i + 1]
      array[i + 1] = temp

      needOneMorePass = true
    }
  }

  return needOneMorePass
}

let bubbleSortSync = array => {
  let clone = array.slice()

  while (sortPass(clone)) {}

  return clone
}

// we won't be able to return sorted array synchronously anymore
// so let's use promises
let bubbleSortAsync = (array, cb) =>
  new Promise(resolve => {
    // immutability espeсially importaint in async code
    let clone = array.slice()

    requestIdleCallback(function step(deadline) {
      let needOneMorePass = false

      do {
        needOneMorePass = sortPass(clone)
      } while (needOneMorePass && deadline.timeRemaining())

      if (needOneMorePass) {
        cb && cb(clone)
        // resume sorting later
        requestIdleCallback(step)
      } else {
        resolve(clone)
      }
    })
  })

let randomArr = () =>
  Array.from({
    length: 30000,
  }).map(() => Math.round(Math.random() * 10000))

let renderArr = arr =>
  (document.querySelector('.list').innerHTML = `
  <li>${arr[0]}</li>
  <li>${arr[1]}</li>
  <li>${arr[2]}</li>
  <li>${arr[3]}</li>
  <li>...</li>
  <li>${arr[arr.length / 2]}</li>
  <li>${arr[arr.length / 2 + 1]}</li>
  <li>${arr[arr.length / 2 + 2]}</li>
  <li>...</li>
  <li>${arr[arr.length - 1]}</li>
`)

document.getElementById('sync').addEventListener('click', () => {
  let arr = randomArr()

  renderArr(arr)
  asyncButton.disabled = true

  let sortedArr = bubbleSortSync(arr)

  renderArr(sortedArr)
  asyncButton.disabled = false
})

let asyncButton = document.getElementById('async')

asyncButton.addEventListener('click', () => {
  let arr = randomArr()

  renderArr(arr)
  asyncButton.disabled = true

  bubbleSortAsync(arr, a => renderArr(a)).then(sortedArr => {
    renderArr(sortedArr)
    asyncButton.disabled = false
  })
})

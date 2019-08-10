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
  <li>${arr[arr.length - 1]}</li>
`)

let button = document.getElementById('sync')
button.addEventListener('click', () => {
  let arr = randomArr()

  renderArr(arr)
  button.disabled = true

  let sortedArr = bubbleSortSync(arr)

  renderArr(sortedArr)
  button.disabled = false
})

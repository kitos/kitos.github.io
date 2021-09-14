let nextDigit = (d) => (d + 1) % 10

let prevDigit = (d) => (10 + d - 1) % 10

let neighbours = (n) => {
  let woThousand = n % 1000

  let thousands = Math.floor(n / 1000)
  let hundreds = Math.floor(woThousand / 100)
  let tens = Math.floor((n % 100) / 10)
  let ones = n % 10

  let woHundreds = n - hundreds * 100
  let woTens = n - tens * 10
  let wo1 = n - ones

  return [
    prevDigit(thousands) * 1000 + woThousand,
    nextDigit(thousands) * 1000 + woThousand,
    woHundreds + prevDigit(hundreds) * 100,
    woHundreds + nextDigit(hundreds) * 100,
    woTens + prevDigit(tens) * 10,
    woTens + nextDigit(tens) * 10,
    wo1 + prevDigit(ones),
    wo1 + nextDigit(ones),
  ]
}

export let openLock = async (deadEnds, target, onAdd) => {
  let targetNumber = Number(target)
  let visited = new Set(deadEnds.map((dd) => Number(dd)))
  let q = [[0, 0]]
  let next

  while ((next = q.shift())) {
    let [turns, pass, parent] = next

    if (!visited.has(pass)) {
      visited.add(pass)

      if (parent != null) {
        await onAdd(parent, pass, turns)
      }

      if (pass === targetNumber) {
        return turns
      }

      neighbours(pass).forEach((neigh) => {
        q.push([turns + 1, neigh, pass])
      })
    }
  }

  return -1
}

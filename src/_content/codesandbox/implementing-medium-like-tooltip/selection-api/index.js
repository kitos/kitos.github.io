import React, { useState } from 'react'
import ReactDOM from 'react-dom'

let App = () => {
  let [{ top, left, width, height }, setRect] = useState({})

  let handleMouseUp = () => {
    let selection = window.getSelection()

    if (!selection.isCollapsed) {
      let range = selection.getRangeAt(0)
      setRect(range.getBoundingClientRect())
    }
  }

  return (
    <div className="App">
      <h1>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Selection">
          Selection
        </a>{' '}
        and{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Range">
          Range
        </a>{' '}
        api
      </h1>

      <h2>Select some text</h2>

      <p onMouseUp={handleMouseUp}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium
        eum, distinctio eveniet itaque cumque corrupti eligendi quae quasi earum
        quaerat, nesciunt soluta atque omnis eos, porro iure magni ad illo!
      </p>

      <div
        style={{
          position: 'absolute',
          border: '2px dashed green',
          top,
          left,
          width,
          height,
        }}
      />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

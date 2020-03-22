import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Manager, Popper } from 'react-popper'

import SelectionReference from './selection-reference'

let tooltipStyle = {
  background: '#fff',
  border: '1px solid green',
  padding: 10,
  margin: 10,
}

let App = () => {
  let [selectedText, setSelectedText] = useState('')

  return (
    <div>
      <h1>Mediup like popup</h1>

      <h2>Select some text</h2>

      <Manager>
        <SelectionReference
          onSelect={selection => setSelectedText(selection.toString())}
        >
          {getProps => (
            <p
              {...getProps({
                onMouseUp: () => console.log('We still can use this callback!'),
              })}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              hic aperiam assumenda maiores numquam. Repellendus, aut
              perferendis eius, magnam sint reprehenderit voluptate,
              consequuntur consectetur corrupti distinctio placeat. Dolores,
              omnis hic!
            </p>
          )}
        </SelectionReference>

        <Popper placement="bottom">
          {({ ref, style, placement, arrowProps }) => (
            <div ref={ref} style={{ ...style, ...tooltipStyle }}>
              easy 🙈
              <p>
                selected text: <b>{selectedText}</b>
              </p>
            </div>
          )}
        </Popper>
      </Manager>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

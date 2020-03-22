import React from 'react'
import ReactDOM from 'react-dom'

import { Manager, Reference, Popper } from 'react-popper'

let tooltipStyle = {
  background: '#fff',
  border: '1px solid green',
  padding: 10,
  margin: 10,
}

let App = () => (
  <div>
    <Manager>
      <Reference>
        {({ ref }) => (
          <input ref={ref} type="text" placeholder="Input with tooltip..." />
        )}
      </Reference>

      <Popper placement="bottom">
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={{ ...style, ...tooltipStyle }}>
            🖖here it is
          </div>
        )}
      </Popper>
    </Manager>

    <p>This text should be overlaped by tooltip.</p>
  </div>
)

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

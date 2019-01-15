import React from 'react'
import { Reference } from 'react-popper'

const PADDING = 10

// https://github.com/FezVrasta/react-popper#usage-without-a-reference-htmlelement
class VirtualSelectionReference {
  constructor(selection) {
    this.selection = selection
  }

  getBoundingClientRect() {
    let rect = this.selection.getRangeAt(0).getBoundingClientRect()

    return new Proxy(rect, {
      get: function(target, prop) {
        if (prop === 'top') {
          return target.top - PADDING
        }

        if (prop === 'bottom') {
          return target.bottom + PADDING
        }

        return target[prop]
      },
    })
  }

  get clientWidth() {
    return this.getBoundingClientRect().width
  }

  get clientHeight() {
    return this.getBoundingClientRect().height
  }
}

let SelectionReference = ({ onSelect, children }) => (
  <Reference>
    {({ ref }) =>
      children(({ onMouseUp, ...rest } = {}) => ({
        ...rest,
        onMouseUp: (...args) => {
          let selection = window.getSelection()

          if (!selection.isCollapsed) {
            ref(new VirtualSelectionReference(selection))
            onSelect && onSelect(selection, ...args)
          }

          onMouseUp && onMouseUp(...args)
        },
      }))
    }
  </Reference>
)

export default SelectionReference
export { SelectionReference }

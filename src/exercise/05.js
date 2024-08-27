// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {Switch} from '../switch'
import {useToggle} from './05/hooks/useToggle'

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  function toggleStateReducer(state, action) {
    switch (action.type) {
      case 'toggle': {
        if (clickedTooMuch) {
          return {on: state.on}
        }
        return {on: !state.on}
      }
      case 'reset': {
        return {on: false}
      }
      default: {
        throw new Error(`Unsupported type: ${action.type}`)
      }
    }
  }

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/

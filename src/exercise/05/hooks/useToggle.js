import * as React from 'react'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

export const ActionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

export function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case ActionTypes.toggle: {
      return {on: !state.on}
    }
    case ActionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

export function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: ActionTypes.toggle})
  const reset = () => dispatch({type: ActionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}
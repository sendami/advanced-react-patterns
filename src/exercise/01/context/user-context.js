import * as userClient from '../../../user-client'
import {useAuth} from '../../../auth-context'
import React from 'react'

const UserContext = React.createContext()
UserContext.displayName = 'UserContext'

function userReducer(state, action) {
  switch (action.type) {
    case 'start update': {
      return {
        ...state,
        user: {...state.user, ...action.updates},
        status: 'pending',
        storedUser: state.user,
      }
    }
    case 'finish update': {
      return {
        ...state,
        user: action.updatedUser,
        status: 'resolved',
        storedUser: null,
        error: null,
      }
    }
    case 'fail update': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      }
    }
    case 'reset': {
      return {
        ...state,
        status: null,
        error: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserProvider({children}) {
  const {user} = useAuth()
  const [state, dispatch] = React.useReducer(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  })
  const value = [state, dispatch]
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}

function updateUser(dispatch, user, updates) {
  dispatch({type: 'start update', updates: updates})
  userClient.updateUser(user, updates).then(
    updatedUser => dispatch({type: 'finish update', updatedUser}),
    error => dispatch({type: 'fail update', error}),
  )
}

export {UserProvider, useUser, updateUser}
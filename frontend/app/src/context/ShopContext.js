import { createContext, useReducer } from 'react'

// Context to save and modify shop evaluations

export const ShopContext = createContext()

export const shopReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PARTS':
      return {
        ...state,
        parts: action.payload    // list of parts (winaris)
      }
    case 'CLEAR_DATA':          // clear parts (winaris)
      return {
        ...state,
        parts: null
      }
    default:
      return state
  }
}

export const ShopContextProvider = ({ children }) => {
  const [state, shopDispatch] = useReducer(shopReducer, {
    parts: null
  })
  
  // provide ShopContext context to all parts of app
  return (
    <ShopContext.Provider value={{ ...state, shopDispatch }}>
      { children }
    </ShopContext.Provider>
  )

}
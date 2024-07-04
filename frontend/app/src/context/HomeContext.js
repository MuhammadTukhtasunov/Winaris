import { createContext, useReducer } from 'react'

// Context to save and modify home data

export const HomeContext = createContext()

export const homeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GRANTS':
      return { 
        ...state, 
        grants: action.payload,
      }
    case 'SET_PUBS':
      return { 
        ...state, 
        pubs: action.payload,
      }
    case 'SET_EXPENS':
      return { 
        ...state, 
        expens: action.payload,
      }
    case 'SET_COURSES':
      return { 
        ...state, 
        courses: action.payload,
      }
    case 'SET_ANON_DATA':
      return { 
        ...state, 
        anonData: action.payload,
      }
    case 'SET_PLOT':
      return { 
        ...state, 
        plot: action.payload,
      }
    case 'CLEAR_DATA':
      return {
        grants: null,
        pubs: null,
        expens: null,
        courses: null,
        anonData: null,
        plot: null
      }
    default:
      return state
  }
}

export const HomeContextProvider = ({ children }) => {
  const [state, homeDispatch] = useReducer(homeReducer, { 
    grants: null,
    pubs: null,
    expens: null,
    courses: null,
    anonData: null,
    plot: null
  })
  
  // provide HomeContext context to all parts of app
  return (
    <HomeContext.Provider value={{ ...state, homeDispatch }}>
      { children }
    </HomeContext.Provider>
  )

}
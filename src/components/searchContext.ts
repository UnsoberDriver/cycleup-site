import { createContext, useContext } from 'react'

export const SearchContext = createContext<{ open: (q?: string) => void }>({ open: () => {} })
export const useSearch = () => useContext(SearchContext)

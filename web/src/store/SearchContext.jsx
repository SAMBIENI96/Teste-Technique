import { createContext, useContext, useEffect, useState } from 'react'

const SearchContext = createContext(null)
const KEY = 'tm-search'

const empty = { levelId: null, subjectId: null, windows: [], goal: null }

/** Recherche gardée en mémoire et en sessionStorage : retour arrière sans ressaisie. */
export function SearchProvider({ children }) {
  const [search, setSearch] = useState(() => {
    try { return { ...empty, ...JSON.parse(sessionStorage.getItem(KEY)) } } catch { return empty }
  })

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(search)) } catch { /* stockage indisponible */ }
  }, [search])

  const update = (patch) => setSearch(s => ({ ...s, ...patch }))
  const reset = () => setSearch(empty)

  return <SearchContext.Provider value={{ search, update, reset }}>{children}</SearchContext.Provider>
}

export const useSearch = () => useContext(SearchContext)

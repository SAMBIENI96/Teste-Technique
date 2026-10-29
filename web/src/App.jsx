import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'
import ConfirmationPage from './pages/ConfirmationPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/tuteurs" element={<ResultsPage />} />
        <Route path="/reservation/:reference" element={<ConfirmationPage />} />
      </Routes>
    </>
  )
}

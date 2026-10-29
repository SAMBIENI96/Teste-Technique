import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SearchPage from './pages/SearchPage'

// Chargées à la demande : la page d'accueil s'affiche plus vite
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-lavender" />}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/tuteurs" element={<ResultsPage />} />
        <Route path="/reservation/:reference" element={<ConfirmationPage />} />
      </Routes>
      </Suspense>
    </>
  )
}

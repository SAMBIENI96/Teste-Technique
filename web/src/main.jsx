import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { SearchProvider } from './store/SearchContext'
import App from './App'
import './index.css'

const loadMotionFeatures = () => import('./lib/motionFeatures').then(r => r.default)

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Respecte « réduire les animations » du système */}
        <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <SearchProvider><App /></SearchProvider>
        </MotionConfig>
        </LazyMotion>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

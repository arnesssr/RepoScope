import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import LandingPage from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/Auth/Callback'
import DashboardLayout from './components/layout/DashboardLayout'
import { useThemeStore } from './stores/themeStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Dashboard routes with layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path=":repoId" element={<Dashboard />} />
            <Route path="repositories" element={<div className="text-white">Repositories page coming soon...</div>} />
            <Route path="commits" element={<div className="text-white">Commits page coming soon...</div>} />
            <Route path="contributors" element={<div className="text-white">Contributors page coming soon...</div>} />
            <Route path="analytics" element={<div className="text-white">Analytics page coming soon...</div>} />
            <Route path="activity" element={<div className="text-white">Activity page coming soon...</div>} />
            <Route path="files" element={<div className="text-white">Files page coming soon...</div>} />
            <Route path="settings" element={<div className="text-white">Settings page coming soon...</div>} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App

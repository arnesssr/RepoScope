import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import LandingPage from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/Auth/Callback'
import DashboardLayout from './components/layout/DashboardLayout'
import Analytics from './pages/Analytics'
import Planning from './pages/Planning'
import Threats from './pages/Threats'
import Timeline from './pages/Timeline'
import Settings from './pages/Settings'
import Analysis from './pages/Analysis'
import Dependencies from './pages/Dependencies'
import CodeQuality from './pages/CodeQuality'
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
            <Route path="analytics" element={<Analytics />} />
            <Route path="planning" element={<Planning />} />
            <Route path="threats" element={<Threats />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analysis/:repoId" element={<Analysis />} />
            <Route path="dependencies" element={<Dependencies />} />
            <Route path="code-quality" element={<CodeQuality />} />
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

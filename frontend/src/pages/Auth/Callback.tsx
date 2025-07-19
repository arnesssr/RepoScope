import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { toast } from 'react-hot-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isProcessing, setIsProcessing] = useState(true)
  const processedRef = useRef(false)

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double execution using ref (survives re-renders)
      if (processedRef.current) return
      processedRef.current = true
      // Check if this is a direct redirect from backend
      const token = searchParams.get('token')
      const username = searchParams.get('user')
      const loginStatus = searchParams.get('login')
      const avatarUrl = searchParams.get('avatar_url')
      const email = searchParams.get('email')

      if (loginStatus === 'success' && token && username) {
        // Store auth data from URL params
        setAuth(
          { 
            username,
            avatar_url: avatarUrl || undefined,
            email: email || undefined
          },
          token
        )
        toast.success(`Welcome back, ${username}!`)
        navigate('/dashboard', { replace: true })
        return
      }

      // New flow: Handle GitHub OAuth code
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        toast.error('Authentication failed: ' + error)
        navigate('/', { replace: true })
        return
      }

      if (code) {
        try {
          // Call backend to exchange code for token
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/github/callback?code=${code}`)
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
            throw new Error(errorData.detail || 'Failed to authenticate')
          }

          // Parse JSON response
          const data = await response.json()
          
          if (data.access_token && data.user) {
            // Store auth data
            setAuth(
              {
                username: data.user.username,
                name: data.user.name,
                email: data.user.email,
                avatar_url: data.user.avatar_url
              },
              data.access_token
            )
            
            toast.success(`Welcome, ${data.user.username}!`)
            navigate('/dashboard', { replace: true })
          } else {
            throw new Error('Invalid response from server')
          }
        } catch (error) {
          console.error('Auth error:', error)
          toast.error(error.message || 'Authentication failed. Please try again.')
          navigate('/', { replace: true })
        }
      } else {
        // No code or token, redirect to home
        navigate('/', { replace: true })
      }
    }

    handleCallback().finally(() => setIsProcessing(false))
  }, [searchParams, setAuth, navigate])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Authenticating...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  )
}

export default AuthCallback

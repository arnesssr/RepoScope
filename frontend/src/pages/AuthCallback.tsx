import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // TODO: Handle OAuth callback
    // For now, just redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }, [navigate])

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

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth, database } from '../lib/firebase'
import { ref, set } from 'firebase/database'
import { useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Save user info to Firebase
      await set(ref(database, `users/${user.uid}`), {
        name: user.displayName,
        email: user.email,
        avatarUrl: user.photoURL,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      })

      console.log('User logged in:', user.email)
    } catch (error) {
      console.error('Sign-in error:', error)
      alert('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Pair-Prep</h1>
          <p className="text-gray-600 text-lg">Study together, achieve more</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              🎯
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Track Goals</h3>
              <p className="text-sm text-gray-600">Set daily prep goals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Real-Time Sync</h3>
              <p className="text-sm text-gray-600">See your friend's progress instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              🔥
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Build Streaks</h3>
              <p className="text-sm text-gray-600">Stay motivated together</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 spinner"></div>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Pair-Prep works best on mobile. Install it to your home screen for the full app experience!
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-600 text-sm max-w-md">
        <p>📱 <strong>Works offline</strong> - All your goals are saved locally</p>
      </div>
    </div>
  )
}

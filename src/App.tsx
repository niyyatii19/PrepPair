import { useEffect, useState } from 'react'
import './App.css'
import LoginScreen from './pages/LoginScreen'
import MainScreen from './pages/MainScreen'

function App() {
  const [userData, setUserData] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Load user from localStorage
    const saved = localStorage.getItem('prep-pair-user')
    if (saved) {
      try {
        setUserData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load user data:', e)
      }
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogin = (user: any) => {
    setUserData(user)
    localStorage.setItem('prep-pair-user', JSON.stringify(user))
  }

  const handleLogout = async () => {
    if (userData) {
      try {
        // Import and remove user from Firebase
        const { removeUserFromRoom } = await import('./lib/firebaseRoom')
        await removeUserFromRoom(userData.room, userData.id)
        console.log('User removed from Firebase room')
      } catch (error) {
        console.error('Error during logout cleanup:', error)
      }
    }
    
    // Clear all localStorage data
    localStorage.removeItem('prep-pair-user')
    localStorage.removeItem('prep-pair-goals')
    localStorage.removeItem('prep-pair-history')
    
    // Reset state
    setUserData(null)
    console.log('Logout complete: all data cleared')
  }

  if (!userData) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <MainScreen userData={userData} onLogout={handleLogout} isOnline={isOnline} />
}

export default App


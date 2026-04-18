import { signOut } from 'firebase/auth'
import { auth } from './firebase'

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
    console.log('User logged out')
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  }
}

export const isUserAuthenticated = (): boolean => {
  return !!auth.currentUser
}

export const getCurrentUser = () => {
  return auth.currentUser
}

import { messaging } from './firebase'

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messaging) {
    console.log('Messaging not supported in this browser')
    return null
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('Notification permission granted')
      
      // Get FCM token
      const { getToken } = await import('firebase/messaging')
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FCM_PUBLIC_KEY,
      })
      
      console.log('FCM Token:', token)
      return token
    } else {
      console.log('Notification permission denied')
      return null
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return null
  }
}

export const setupNotificationListener = (): void => {
  if (!messaging) {
    console.log('Messaging not supported')
    return
  }

  // Handle messages when app is in foreground
  const { onMessage } = require('firebase/messaging')
  
  onMessage(messaging, (payload: any) => {
    console.log('Message received in foreground:', payload)
    
    const notificationTitle = payload.notification?.title || 'Pair-Prep'
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new update!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'pair-prep-notification',
    }

    // Show notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notificationTitle, notificationOptions)
    }
  })
}

export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported')
    return
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    })
  }
}

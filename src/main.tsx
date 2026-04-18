import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => console.log('✓ Service Worker registered'),
      (err) => console.log('✗ Service Worker registration failed:', err)
    )
  })
}

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

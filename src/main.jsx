import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import { initializeDatabase } from './services/dbInit'

// Initialize database on app start
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully')
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error)
  })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)


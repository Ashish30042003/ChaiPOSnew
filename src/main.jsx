import React from 'react'
import ReactDOM from 'react-dom/client'
import ChaiCornerPOS from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChaiCornerPOS />
    </ErrorBoundary>
  </React.StrictMode>,
)

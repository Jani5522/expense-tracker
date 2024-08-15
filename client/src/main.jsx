import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center"
     richColors 
     toastOptions={{
      style: { background: 'red' },
      className: 'my-toast',
      }}
    />
  </React.StrictMode>,
)

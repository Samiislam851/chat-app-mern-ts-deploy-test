import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ContextProvider from './Configs/ContextProvider.tsx'
import SocketContextProvider from './Configs/SocketContextProvider.tsx'






ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </ContextProvider>
  </React.StrictMode>,
)

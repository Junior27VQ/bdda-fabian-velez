import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.tsx'
import InventarioApp from './components/InventarioApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InventarioApp />
  </StrictMode>,
)

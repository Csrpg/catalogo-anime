import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'

// Importa los estilos globales SCSS
import './styles/main.scss'

// Importa las fuentes de Google (también se pueden poner en index.html)
// Si prefieres index.html, elimina estas líneas
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/900.css'

// createRoot → API moderna de React 18
// document.getElementById('root')! → el ! le dice a TS que no será null
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

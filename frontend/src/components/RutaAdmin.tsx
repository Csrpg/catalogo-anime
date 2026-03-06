// Protege rutas que requieren rol de admin.
// Si el usuario está logueado pero NO es admin → redirige a /
// Si no está logueado → redirige a /login
//
// Uso en App.tsx:
// <Route path="/admin" element={<RutaAdmin><Admin /></RutaAdmin>} />

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const RutaAdmin = ({ children }: Props) => {
  const { usuario, cargando } = useAuth()

  if (cargando) return null

  // No logueado → al login
  if (!usuario) return <Navigate to="/login" replace />

  // Logueado pero no admin → al inicio
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />

  return <>{children}</>
}

export default RutaAdmin

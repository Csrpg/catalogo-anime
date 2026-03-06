// Protege rutas que requieren estar logueado.
// Si el usuario NO está logueado, lo redirige a /login.
// Si está cargando (verificando token), muestra nada.
//
// Uso en App.tsx:
// <Route path="/favoritos" element={<RutaPrivada><Favoritos /></RutaPrivada>} />

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const RutaPrivada = ({ children }: Props) => {
  const { usuario, cargando } = useAuth()

  // Mientras verifica el token guardado, no renderiza nada
  // (evita el flash de redirección)
  if (cargando) return null

  // Si no hay usuario logueado → redirige a login
  // replace: true → no guarda la ruta en el historial
  if (!usuario) return <Navigate to="/login" replace />

  // Si hay usuario → renderiza el componente hijo
  return <>{children}</>
}

export default RutaPrivada

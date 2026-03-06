// Estado global de autenticación con React Context.
// Guarda el usuario y el token en memoria y en
// localStorage para que persista al recargar.
//
// ¿Qué es Context?
// Es como una "mochila" que llevas contigo por toda
// la app. Cualquier componente puede meter la mano
// y sacar el usuario o el token sin pasarlo por props.


import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Usuario } from '../types'
import { perfilApi } from '../services/api'

// ── 1. Definir qué va dentro de la mochila ───────
interface AuthContextType {
  usuario: Usuario | null          // null = no logueado
  token: string | null
  cargando: boolean                // true mientras verifica el token al inicio
  login: (token: string, usuario: Usuario) => void
  logout: () => void
  setUsuario: (usuario: Usuario) => void
}

// ── 2. Crear el contexto vacío ───────────────────
// {} as AuthContextType → le decimos a TypeScript
// "confía en mí, esto se va a rellenar"
const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// ── 3. Proveedor: el componente que envuelve la app
// Todos los hijos de <AuthProvider> pueden usar useAuth()
interface AuthProviderProps {
  children: ReactNode   // ReactNode = cualquier JSX válido
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)  // empieza en true

  // Al montar la app, comprueba si había un token guardado
  // Si lo hay, verifica que sigue siendo válido con el backend
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token')

    if (tokenGuardado) {
      setToken(tokenGuardado)
      // Llama a GET /api/auth/perfil para obtener los datos del usuario
      // El interceptor de api.ts añade el token automáticamente
      perfilApi()
        .then(res => {
          setUsuario(res.data.usuario)
        })
        .catch(() => {
          // Token expirado o inválido → limpiar
          localStorage.removeItem('token')
          setToken(null)
          setUsuario(null)
        })
        .finally(() => {
          setCargando(false)  // ya terminamos de verificar
        })
    } else {
      // No había token → no hay que verificar nada
      setCargando(false)
    }
  }, [])  // [] → solo se ejecuta una vez al montar

  // ── login: guarda token y usuario ──────────────
  const login = (nuevoToken: string, nuevoUsuario: Usuario) => {
    localStorage.setItem('token', nuevoToken)  // persiste en el navegador
    setToken(nuevoToken)
    setUsuario(nuevoUsuario)
  }

  // ── logout: borra todo ──────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
  }

  // ── Lo que metemos en la mochila ────────────────
  const valor: AuthContextType = {
    usuario,
    token,
    cargando,
    login,
    logout,
    setUsuario,
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}

// ── 4. Hook personalizado ────────────────────────
// En vez de escribir useContext(AuthContext) en cada
// componente, usamos este hook más corto y legible:
// const { usuario, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)

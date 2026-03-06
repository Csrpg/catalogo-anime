// Formulario de inicio de sesión.
// Al hacer login guarda el token en AuthContext/localStorage
// y redirige a la página de inicio.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) { setError('Rellena todos los campos.'); return }
    setCargando(true)
    setError('')
    try {
      const res = await loginApi({ email, password })
      // login() guarda el token en localStorage y actualiza el contexto
      login(res.data.token, res.data.usuario)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Email o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  // Permitir enviar con Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Panel izquierdo decorativo */}
      <div style={{ background: '#0a0002', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://cdn.myanimelist.net/images/anime/1208/94745l.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, filter: 'saturate(0.2)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.4 }}>
            La Casa<br />del Anime
          </div>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
            Tu catálogo personal de anime
          </p>
        </div>
      </div>

      {/* Panel derecho con el formulario */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: 'var(--background)' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '0.4rem' }}>
            Bienvenido
          </h2>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', color: 'var(--text)', opacity: 0.52, fontStyle: 'italic', marginBottom: '2.5rem' }}>
            Inicia sesión para continuar
          </p>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="tu@email.com"
              style={{ width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.8rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(143,10,28,0.2)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="••••••••"
              style={{ width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.8rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(143,10,28,0.2)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--primary)', fontStyle: 'italic', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={cargando} style={{
            width: '100%', fontFamily: "'Cinzel', serif", fontSize: '0.66rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', padding: '1rem',
            background: 'var(--primary)', color: 'white', border: 'none', marginTop: '0.5rem',
            opacity: cargando ? 0.6 : 1, transition: 'background 0.2s, transform 0.2s',
          }}>
            {cargando ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--text)', opacity: 0.52, fontStyle: 'italic' }}>
            ¿Sin cuenta?{' '}
            <Link to="/registro" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>

      {/* Responsive: ocultar panel izquierdo en móvil */}
      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr; } div[style*="background: #0a0002"] { display: none; } }`}</style>
    </div>
  )
}

export default Login

// Formulario de registro de nuevo usuario.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registroApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Registro = () => {
  const [nombre, setNombre]     = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async () => {
    if (!nombre || !email || !password) { setError('Rellena todos los campos.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setCargando(true)
    setError('')
    try {
      const res = await registroApi({ nombre, email, password })
      login(res.data.token, res.data.usuario)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al registrarse.')
    } finally {
      setCargando(false)
    }
  }

  const campo = (label: string, type: string, value: string, onChange: (v: string) => void, placeholder: string) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        style={{ width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.8rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(143,10,28,0.2)', color: 'var(--text)', outline: 'none' }}
      />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ background: '#0a0002', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://cdn.myanimelist.net/images/anime/1517/100633l.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, filter: 'saturate(0.2)' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem', lineHeight: 1.4 }}>La Casa<br />del Anime</div>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.05rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Únete a la comunidad</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: 'var(--background)' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '0.4rem' }}>Crear cuenta</h2>
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', color: 'var(--text)', opacity: 0.52, fontStyle: 'italic', marginBottom: '2.5rem' }}>Regístrate para guardar favoritos y dejar reseñas</p>

          {campo('Nombre', 'text', nombre, setNombre, 'Tu nombre')}
          {campo('Email', 'email', email, setEmail, 'tu@email.com')}
          {campo('Contraseña', 'password', password, setPassword, '••••••••')}

          {error && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--primary)', fontStyle: 'italic', marginBottom: '1rem' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={cargando} style={{
            width: '100%', fontFamily: "'Cinzel', serif", fontSize: '0.66rem',
            letterSpacing: '0.2em', textTransform: 'uppercase', padding: '1rem',
            background: 'var(--primary)', color: 'white', border: 'none', marginTop: '0.5rem',
            opacity: cargando ? 0.6 : 1,
          }}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--text)', opacity: 0.52, fontStyle: 'italic' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr; } div[style*="background: #0a0002"] { display: none; } }`}</style>
    </div>
  )
}

export default Registro

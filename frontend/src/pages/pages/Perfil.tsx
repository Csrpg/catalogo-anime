// Página del perfil del usuario logueado.
// Permite actualizar nombre y avatar.

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { actualizarPerfilApi } from '../services/api'

const Perfil = () => {
  const { usuario, setUsuario } = useAuth()
  const [nombre, setNombre]     = useState(usuario?.nombre || '')
  const [avatar, setAvatar]     = useState(usuario?.avatar || '')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje]   = useState('')

  const guardar = async () => {
    setGuardando(true)
    setMensaje('')
    try {
      const res = await actualizarPerfilApi({ nombre, avatar })
      setUsuario(res.data.usuario)
      setMensaje('Perfil actualizado correctamente.')
    } catch {
      setMensaje('Error al actualizar el perfil.')
    } finally {
      setGuardando(false)
    }
  }

  if (!usuario) return null

  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <section style={{ padding: '5rem 4rem', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)' }}>Mi Perfil</h1>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(143,10,28,0.3), transparent)' }} />
        </div>

        {/* Avatar preview */}
        {avatar && (
          <img src={avatar} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '2rem', border: '2px solid rgba(143,10,28,0.2)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { label: 'Nombre', value: nombre, setter: setNombre, type: 'text', placeholder: 'Tu nombre' },
            { label: 'URL del avatar', value: avatar, setter: setAvatar, type: 'url', placeholder: 'https://...' },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label}>
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>{label}</label>
              <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
                style={{ width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.8rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(143,10,28,0.2)', color: 'var(--text)', outline: 'none' }}
              />
            </div>
          ))}

          {/* Email (solo lectura) */}
          <div>
            <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', color: 'var(--text)', opacity: 0.6, fontStyle: 'italic', padding: '0.8rem 0', borderBottom: '1px solid rgba(143,10,28,0.1)' }}>{usuario.email}</p>
          </div>

          {/* Rol */}
          <div>
            <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.52, display: 'block', marginBottom: '0.5rem' }}>Rol</label>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', background: usuario.rol === 'admin' ? 'var(--primary)' : 'rgba(143,10,28,0.08)', color: usuario.rol === 'admin' ? 'white' : 'var(--primary)' }}>
              {usuario.rol}
            </span>
          </div>

          {mensaje && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.95rem', color: 'var(--primary)', fontStyle: 'italic' }}>{mensaje}</p>}

          <button onClick={guardar} disabled={guardando} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.66rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '1rem 2rem', background: 'var(--primary)',
            color: 'white', border: 'none', alignSelf: 'flex-start',
            opacity: guardando ? 0.6 : 1,
          }}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default Perfil

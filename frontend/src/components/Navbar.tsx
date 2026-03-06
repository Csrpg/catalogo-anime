// Barra de navegación fija en la parte superior.
// Muestra distintas opciones según si estás logueado
// y según tu rol (usuario vs admin).

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuAbierto(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(255,249,238,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(143,10,28,0.12)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div style={{
        padding: '0 3rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
          La Casa <span style={{ color: 'var(--text)', fontWeight: 400 }}>del Anime</span>
        </Link>

        {/* Links desktop */}
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }} className="nav-desktop">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          {usuario && <NavLink to="/favoritos">Favoritos</NavLink>}
        </ul>

        {/* Derecha desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="nav-desktop">
          {/* Panel Admin: solo si es admin */}
          {usuario?.rol === 'admin' && (
            <Link to="/admin" style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--primary)', textDecoration: 'none',
              border: '1px solid rgba(143,10,28,0.3)', padding: '0.4rem 0.9rem',
              transition: 'all 0.2s',
            }}>
              Panel Admin
            </Link>
          )}

          {usuario ? (
            /* Usuario logueado: nombre + cerrar sesión */
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/perfil" style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none',
              }}>
                {usuario.nombre}
              </Link>
              <button onClick={handleLogout} style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '0.55rem 1.3rem',
                background: 'transparent', color: 'var(--primary)',
                border: '1px solid rgba(143,10,28,0.3)', transition: 'all 0.2s',
              }}>
                Salir
              </button>
            </div>
          ) : (
            /* No logueado: botón iniciar sesión */
            <Link to="/login" style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.55rem 1.3rem', background: 'var(--primary)', color: 'white',
              textDecoration: 'none', transition: 'background 0.2s',
            }}>
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Hamburger móvil */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="hamburger-btn"
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', padding: '4px' }}
          aria-label="Menú"
        >
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--primary)', transition: 'all 0.3s', transform: menuAbierto ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--primary)', transition: 'all 0.3s', opacity: menuAbierto ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'var(--primary)', transition: 'all 0.3s', transform: menuAbierto ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <div style={{
        maxHeight: menuAbierto ? '320px' : '0',
        overflow: 'hidden', transition: 'max-height 0.4s ease',
        background: 'rgba(255,249,238,0.98)', backdropFilter: 'blur(12px)',
        borderTop: menuAbierto ? '1px solid rgba(143,10,28,0.1)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}>
        {[
          { to: '/', label: 'Inicio' },
          { to: '/catalogo', label: 'Catálogo' },
          ...(usuario ? [{ to: '/favoritos', label: 'Favoritos' }] : []),
          ...(usuario?.rol === 'admin' ? [{ to: '/admin', label: 'Panel Admin' }] : []),
        ].map(({ to, label }) => (
          <Link key={to} to={to} onClick={() => setMenuAbierto(false)} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--text)', padding: '0.9rem 2rem',
            borderLeft: '2px solid transparent', transition: 'all 0.2s', textDecoration: 'none',
          }}>
            {label}
          </Link>
        ))}
        {usuario ? (
          <button onClick={handleLogout} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--primary)', padding: '0.9rem 2rem',
            textAlign: 'left', background: 'none', border: 'none', borderLeft: '2px solid transparent',
          }}>
            Cerrar sesión
          </button>
        ) : (
          <Link to="/login" onClick={() => setMenuAbierto(false)} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', background: 'var(--primary)', color: 'white',
            margin: '0.75rem 2rem 1rem', padding: '0.7rem', textAlign: 'center', textDecoration: 'none',
          }}>
            Iniciar sesión
          </Link>
        )}
      </div>

      {/* CSS responsive incrustado */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

// Componente auxiliar para los links del navbar
const NavLink = ({ to, children }: { to: string; children: string }) => (
  <li>
    <Link to={to} style={{
      fontFamily: "'Cinzel', serif", fontSize: '0.62rem', fontWeight: 600,
      letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text)',
      textDecoration: 'none', position: 'relative', paddingBottom: '4px',
    }}>
      {children}
    </Link>
  </li>
)

export default Navbar

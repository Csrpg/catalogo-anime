
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      background: '#0a0002',
      padding: '2.5rem 4rem',
      borderTop: '1px solid rgba(143,10,28,0.2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>
          La Casa del Anime
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[['/', 'Inicio'], ['/catalogo', 'Catálogo']].map(([to, label]) => (
            <Link key={to} to={to} style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none', transition: 'color 0.2s',
            }}>
              {label}
            </Link>
          ))}
        </div>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
          © 2026 — Proyecto Bootcamp Fullstack
        </p>
      </div>
    </footer>
  )
}

export default Footer

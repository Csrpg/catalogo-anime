// Página 404 — cuando la ruta no existe.

import { Link } from 'react-router-dom'

const NoEncontrado = () => (
  <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '8rem', fontWeight: 900, color: 'rgba(143,10,28,0.1)', lineHeight: 1 }}>404</div>
    <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.05em' }}>Página no encontrada</h1>
    <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.1rem', color: 'var(--text)', opacity: 0.55, fontStyle: 'italic' }}>
      La página que buscas no existe o ha sido movida.
    </p>
    <Link to="/" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.9rem 2rem', background: 'var(--primary)', color: 'white', textDecoration: 'none' }}>
      Volver al inicio
    </Link>
  </main>
)

export default NoEncontrado

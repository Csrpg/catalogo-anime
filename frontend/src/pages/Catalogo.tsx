// Grid completo de animes con búsqueda, filtros por género y paginación.

import { useEffect, useState } from 'react'
import type { Anime } from '../types'
import { getAnimesApi, getGenerosApi } from '../services/api'
import AnimeCard from '../components/AnimeCard'

const Catalogo = () => {
  const [animes, setAnimes]       = useState<Anime[]>([])
  const [generos, setGeneros]     = useState<string[]>([])
  const [total, setTotal]         = useState(0)
  const [pagina, setPagina]       = useState(1)
  const [totalPags, setTotalPags] = useState(1)
  const [cargando, setCargando]   = useState(true)

  // Filtros
  const [buscar, setBuscar]   = useState('')
  const [genero, setGenero]   = useState('')
  const [tipo, setTipo]       = useState('')
  const [estado, setEstado]   = useState('')

  // Cargar géneros una sola vez
  useEffect(() => {
    getGenerosApi()
      .then(res => setGeneros(res.data.generos))
      .catch(console.error)
  }, [])

  // Cargar animes cuando cambian los filtros o la página
  useEffect(() => {
    setCargando(true)
    getAnimesApi({ buscar, genero, tipo, estado, pagina, limite: 12 })
      .then(res => {
        setAnimes(res.data.animes)
        setTotal(res.data.total)
        setTotalPags(res.data.totalPaginas)
      })
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [buscar, genero, tipo, estado, pagina])

  // Cuando cambia un filtro, volver a la página 1
  const cambiarFiltro = (setter: (v: string) => void, valor: string) => {
    setter(valor)
    setPagina(1)
  }

  // const s: React.CSSProperties = {}

  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 4rem' }}>

        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            Catálogo
          </h1>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(143,10,28,0.3), transparent)' }} />
          <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>
            {total} animes
          </span>
        </div>

        {/* Búsqueda */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '1.1rem' }}>⌕</span>
          <input
            type="text"
            placeholder="Buscar anime..."
            value={buscar}
            onChange={e => cambiarFiltro(setBuscar, e.target.value)}
            style={{
              width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'transparent', border: '1px solid rgba(143,10,28,0.2)',
              color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.42, marginRight: '0.3rem' }}>
            Género
          </span>
          {/* "Todos" */}
          <FiltroBtn activo={genero === ''} onClick={() => cambiarFiltro(setGenero, '')}>Todos</FiltroBtn>
          {generos.map(g => (
            <FiltroBtn key={g} activo={genero === g} onClick={() => cambiarFiltro(setGenero, g)}>{g}</FiltroBtn>
          ))}

          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.42, marginLeft: '1rem', marginRight: '0.3rem' }}>
            Tipo
          </span>
          {['', 'TV', 'Película', 'OVA'].map(t => (
            <FiltroBtn key={t} activo={tipo === t} onClick={() => cambiarFiltro(setTipo, t)}>
              {t || 'Todos'}
            </FiltroBtn>
          ))}

          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.42, marginLeft: '1rem', marginRight: '0.3rem' }}>
            Estado
          </span>
          {['', 'En emisión', 'Finalizado'].map(e => (
            <FiltroBtn key={e} activo={estado === e} onClick={() => cambiarFiltro(setEstado, e)}>
              {e || 'Todos'}
            </FiltroBtn>
          ))}
        </div>

        {/* Grid */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--text)', opacity: 0.4, textTransform: 'uppercase' }}>
            Cargando...
          </div>
        ) : animes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Crimson Pro', serif", fontSize: '1.2rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>
            No se encontraron animes con esos filtros.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {animes.map((anime, i) => (
              <AnimeCard key={anime._id} anime={anime} numero={(pagina - 1) * 12 + i + 1} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPags > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <PagBtn onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>‹</PagBtn>
            {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
              <PagBtn key={n} onClick={() => setPagina(n)} activo={n === pagina}>{n}</PagBtn>
            ))}
            <PagBtn onClick={() => setPagina(p => Math.min(totalPags, p + 1))} disabled={pagina === totalPags}>›</PagBtn>
          </div>
        )}
      </section>
    </main>
  )
}

// Botón de filtro reutilizable
const FiltroBtn = ({ children, activo, onClick }: { children: string; activo: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.15em',
    textTransform: 'uppercase', padding: '0.4rem 1rem',
    background: activo ? 'var(--primary)' : 'transparent',
    border: `1px solid ${activo ? 'var(--primary)' : 'rgba(143,10,28,0.2)'}`,
    color: activo ? 'white' : 'var(--text)', transition: 'all 0.2s',
  }}>
    {children}
  </button>
)

// Botón de paginación
const PagBtn = ({ children, onClick, activo, disabled }: { children: React.ReactNode; onClick: () => void; activo?: boolean; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} style={{
    fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.1em',
    padding: '0.5rem 0.9rem',
    background: activo ? 'var(--primary)' : 'transparent',
    border: `1px solid ${activo ? 'var(--primary)' : 'rgba(143,10,28,0.2)'}`,
    color: activo ? 'white' : 'var(--text)',
    opacity: disabled ? 0.3 : 1,
    transition: 'all 0.2s',
  }}>
    {children}
  </button>
)

export default Catalogo

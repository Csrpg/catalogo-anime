// Tarjeta de anime con efecto hover.
// En reposo: muestra imagen + título + año.
// Al hacer hover: imagen oscurecida + score + géneros + sinopsis + botón.

import { useNavigate } from 'react-router-dom'
import { Anime } from '../types'

interface Props {
  anime: Anime
  numero?: number   
}

const AnimeCard = ({ anime, numero }: Props) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/anime/${anime._id}`)}
      style={{
        position: 'relative',
        aspectRatio: '2/3',
        overflow: 'hidden',
        background: '#1a0005',
        cursor: 'none',
      }}
      className="anime-card"
    >
      {/* Imagen de fondo */}
      <img
        src={anime.imagen}
        alt={anime.titulo}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).style.background = '#2a0008' }}
      />

      {/* Gradiente inferior (siempre visible) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,0,2,0.95) 0%, transparent 55%)',
      }} />

      {/* Número decorativo */}
      {numero !== undefined && (
        <div style={{
          position: 'absolute', top: '0.8rem', right: '0.8rem',
          fontFamily: "'Cinzel', serif", fontSize: '0.56rem', fontWeight: 900,
          color: 'rgba(255,255,255,0.1)', letterSpacing: '0.1em',
        }}>
          #{String(numero).padStart(2, '0')}
        </div>
      )}

      {/* Info base (título + año) */}
      <div className="card-base-info" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '1.2rem', transition: 'transform 0.4s ease',
      }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.76rem', fontWeight: 600, color: 'white', lineHeight: 1.3, marginBottom: '0.3rem' }}>
          {anime.titulo}
        </div>
        <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.74rem', color: 'rgba(255,255,255,0.32)', fontStyle: 'italic' }}>
          {anime.anyo ?? '—'}
        </div>
      </div>

      {/* Info hover (score + géneros + sinopsis + botón) */}
      <div className="card-hover-info" style={{
        position: 'absolute', inset: 0, padding: '1.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        opacity: 0, transition: 'opacity 0.4s ease',
      }}>
        {anime.puntuacion && (
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: '#ff3d5a', marginBottom: '0.5rem' }}>
            {anime.puntuacion.toFixed(1)}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.8rem' }}>
          {anime.generos.slice(0, 3).map(g => (
            <span key={g} style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.46rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.15rem 0.4rem',
              border: '1px solid rgba(255,80,80,0.35)', color: 'rgba(255,255,255,0.62)',
            }}>
              {g}
            </span>
          ))}
        </div>
        <p style={{
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.5,
          fontStyle: 'italic', marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {anime.sinopsis}
        </p>
        <button style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.54rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', padding: '0.5rem 1rem',
          background: 'var(--primary)', color: 'white', border: 'none', width: '100%',
        }}>
          Ver más
        </button>
      </div>

      {/* CSS para el hover effect */}
      <style>{`
        .anime-card:hover img { transform: scale(1.08); filter: saturate(0.25) brightness(0.32); }
        .anime-card img { transition: transform 0.5s ease, filter 0.5s ease; }
        .anime-card:hover .card-base-info { transform: translateY(-8px); }
        .anime-card:hover .card-hover-info { opacity: 1 !important; }
      `}</style>
    </div>
  )
}

export default AnimeCard

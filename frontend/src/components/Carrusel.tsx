// Carrusel de animes destacados (top 10).
// Carga los animes con destacado: true del backend.
// Autoplay cada 5 segundos, flechas manuales, thumbnails laterales.

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anime } from '../types'
import { getAnimesApi } from '../services/api'

const Carrusel = () => {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [actual, setActual] = useState(0)
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cargar animes destacados al montar
  useEffect(() => {
    getAnimesApi({ destacado: true, limite: 10 })
      .then(res => setAnimes(res.data.animes))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  // Autoplay
  useEffect(() => {
    if (animes.length === 0) return
    timerRef.current = setInterval(() => {
      setActual(prev => (prev + 1) % animes.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [animes.length])

  const irA = (n: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setActual((n + animes.length) % animes.length)
    // Reiniciar autoplay
    timerRef.current = setInterval(() => {
      setActual(prev => (prev + 1) % animes.length)
    }, 5000)
  }

  if (cargando || animes.length === 0) {
    return (
      <div style={{ height: '100vh', background: 'linear-gradient(135deg, #1e0006, #8a001a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          Cargando...
        </div>
      </div>
    )
  }

  const anime = animes[actual]

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* Slides — uno por anime */}
      {animes.map((a, i) => (
        <div key={a._id} style={{
          position: 'absolute', inset: 0,
          opacity: i === actual ? 1 : 0,
          transition: 'opacity 0.9s ease',
          pointerEvents: i === actual ? 'all' : 'none',
        }}>
          {/* Fondo oscuro-rojo */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1e0006 0%, #8a001a 45%, #3d0010 100%)' }} />
          {/* Imagen del anime */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${a.imagen})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.22, filter: 'saturate(0.6)',
            transform: i === actual ? 'scale(1.0)' : 'scale(1.05)',
            transition: 'transform 8s ease',
          }} />
          {/* Gradiente negro-rojo lateral */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(12,0,3,0.97) 0%, rgba(90,5,18,0.78) 42%, rgba(120,5,25,0.2) 70%, transparent 100%)',
          }} />
        </div>
      ))}

      {/* Contenido del slide activo */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '0 5rem', maxWidth: '650px',
        height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {/* Badge */}
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#ff3d5a', border: '1px solid #ff3d5a',
          padding: '0.3rem 0.8rem', display: 'inline-block', marginBottom: '1.5rem',
          animation: 'fadeInUp 0.6s ease 0.2s both',
        }}>
          ⭐ Top Anime — #{actual + 1}
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem',
          animation: 'fadeInUp 0.6s ease 0.35s both',
        }}>
          {anime.titulo}
        </h1>

        {/* Score + tags */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.2rem', alignItems: 'center', animation: 'fadeInUp 0.6s ease 0.5s both' }}>
          {anime.puntuacion && (
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 900, color: '#ff3d5a' }}>
              {anime.puntuacion.toFixed(1)}<span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.32)', fontFamily: "'Crimson Pro', serif" }}> / 10</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.52)' }}>{anime.tipo}</span>
            {anime.generos.slice(0, 2).map(g => (
              <span key={g} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.52)' }}>{g}</span>
            ))}
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.52)' }}>{anime.estado}</span>
          </div>
        </div>

        {/* Sinopsis */}
        <p style={{
          fontSize: '0.98rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.58)',
          marginBottom: '2rem', fontStyle: 'italic', fontWeight: 300,
          animation: 'fadeInUp 0.6s ease 0.6s both',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {anime.sinopsis}
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '1rem', animation: 'fadeInUp 0.6s ease 0.75s both' }}>
          <button onClick={() => navigate(`/anime/${anime._id}`)} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '0.9rem 2rem',
            background: 'var(--primary)', color: 'white', border: 'none',
          }}>
            Ver detalles
          </button>
        </div>
      </div>

      {/* Thumbnails laterales */}
      <div style={{
        position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '0.6rem', zIndex: 10,
      }}>
        {animes.map((a, i) => (
          <img
            key={a._id} src={a.imagen} alt={a.titulo}
            onClick={() => irA(i)}
            style={{
              width: '56px', height: '80px', objectFit: 'cover',
              opacity: i === actual ? 1 : 0.3,
              border: `1px solid ${i === actual ? '#ff3d5a' : 'transparent'}`,
              transform: i === actual ? 'scale(1.06)' : 'scale(1)',
              transition: 'all 0.3s',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ))}
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '2.5rem', left: '5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
        {animes.map((_, i) => (
          <button
            key={i} onClick={() => irA(i)}
            style={{
              width: i === actual ? '48px' : '24px', height: '2px',
              background: i === actual ? '#ff3d5a' : 'rgba(255,255,255,0.18)',
              border: 'none', padding: 0, transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Flechas */}
      <button onClick={() => irA(actual - 1)} style={{
        position: 'absolute', bottom: '1.8rem', right: '6rem', zIndex: 10,
        width: '40px', height: '40px', background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '1.2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>‹</button>
      <button onClick={() => irA(actual + 1)} style={{
        position: 'absolute', bottom: '1.8rem', right: '2.5rem', zIndex: 10,
        width: '40px', height: '40px', background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '1.2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>›</button>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

export default Carrusel

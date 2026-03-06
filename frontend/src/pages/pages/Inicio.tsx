// Página de inicio: carrusel de destacados + grid de animes recientes.

import { useEffect, useState } from 'react'
import { Anime } from '../types'
import { getAnimesApi } from '../services/api'
import Carrusel from '../components/Carrusel'
import AnimeCard from '../components/AnimeCard'

const Inicio = () => {
  const [recientes, setRecientes] = useState<Anime[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Cargar los últimos 6 animes
    getAnimesApi({ limite: 6, pagina: 1 })
      .then(res => setRecientes(res.data.animes))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  return (
    <main>
      {/* Carrusel ocupa el 100vh */}
      <Carrusel />

      {/* Animes recientes debajo */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            Últimas incorporaciones
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(143,10,28,0.3), transparent)' }} />
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--text)', opacity: 0.4, textTransform: 'uppercase' }}>
            Cargando...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))', gap: '1.5rem' }}>
            {recientes.map((anime, i) => (
              <AnimeCard key={anime._id} anime={anime} numero={i + 1} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Inicio

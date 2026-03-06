// Lista de animes favoritos del usuario logueado.

import { useEffect, useState } from 'react'
import type { Favorito } from '../types'
import { getFavoritosApi, deleteFavoritoApi } from '../services/api'
import AnimeCard from '../components/AnimeCard'

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([])
  const [cargando, setCargando]   = useState(true)

  useEffect(() => {
    getFavoritosApi()
      .then(res => setFavoritos(res.data.favoritos))
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  const quitar = async (animeId: string) => {
    await deleteFavoritoApi(animeId)
    setFavoritos(prev => prev.filter(f => f.anime._id !== animeId))
  }

  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <section style={{ padding: '5rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '0.05em' }}>Mis Favoritos</h1>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(143,10,28,0.3), transparent)' }} />
          <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>{favoritos.length} animes</span>
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--text)', opacity: 0.4, textTransform: 'uppercase' }}>Cargando...</div>
        ) : favoritos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.2rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic', marginBottom: '1.5rem' }}>
              Todavía no tienes favoritos.
            </p>
            <a href="/catalogo" style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.9rem 2rem', background: 'var(--primary)', color: 'white', textDecoration: 'none' }}>
              Explorar catálogo
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))', gap: '1.5rem' }}>
            {favoritos.map(f => (
              <div key={f._id} style={{ position: 'relative' }}>
                <AnimeCard anime={f.anime} />
                {/* Botón quitar favorito */}
                <button
                  onClick={() => quitar(f.anime._id)}
                  title="Quitar de favoritos"
                  style={{
                    position: 'absolute', top: '0.6rem', left: '0.6rem', zIndex: 10,
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(10,0,2,0.8)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ff3d5a', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Favoritos

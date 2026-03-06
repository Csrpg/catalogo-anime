// Ficha completa de un anime: portada, info, trailer y reseñas.
// La URL es /anime/:id donde :id es el _id de MongoDB.

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Anime, Resena } from '../types'
import { getAnimeApi, getResenasApi, addFavoritoApi, deleteFavoritoApi, getFavoritosApi, crearResenaApi, borrarResenaApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DetalleAnime = () => {
  const { id } = useParams<{ id: string }>()    // extrae el :id de la URL
  const { usuario } = useAuth()

  const [anime, setAnime]           = useState<Anime | null>(null)
  const [resenas, setResenas]       = useState<Resena[]>([])
  const [esFavorito, setEsFavorito] = useState(false)
  const [cargando, setCargando]     = useState(true)

  // Formulario de nueva reseña
  const [puntuacion, setPuntuacion] = useState<number | ''>('')
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando]     = useState(false)
  const [errorResena, setErrorResena] = useState('')

  useEffect(() => {
    if (!id) return
    setCargando(true)

    // Carga en paralelo: anime + reseñas
    Promise.all([
      getAnimeApi(id),
      getResenasApi(id),
      ...(usuario ? [getFavoritosApi()] : []),
    ])
      .then(([animeRes, resenasRes, favRes]) => {
        setAnime(animeRes.data.anime)
        setResenas(resenasRes.data.resenas)
        if (favRes) {
          const favoritos = favRes.data.favoritos
          setEsFavorito(favoritos.some((f: any) => f.anime._id === id))
        }
      })
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [id, usuario])

  const toggleFavorito = async () => {
    if (!usuario || !id) return
    if (esFavorito) {
      await deleteFavoritoApi(id)
      setEsFavorito(false)
    } else {
      await addFavoritoApi(id)
      setEsFavorito(true)
    }
  }

  const enviarResena = async () => {
    if (!puntuacion && !comentario.trim()) {
      setErrorResena('Escribe un comentario o una puntuación.')
      return
    }
    if (!id) return
    setEnviando(true)
    setErrorResena('')
    try {
      const res = await crearResenaApi(id, { puntuacion: puntuacion || undefined, comentario: comentario || undefined })
      setResenas(prev => [res.data.resena, ...prev])
      setPuntuacion('')
      setComentario('')
    } catch (err: any) {
      setErrorResena(err.response?.data?.mensaje || 'Error al enviar la reseña.')
    } finally {
      setEnviando(false)
    }
  }

  const eliminarResena = async (resenaId: string) => {
    await borrarResenaApi(resenaId)
    setResenas(prev => prev.filter(r => r._id !== resenaId))
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--text)', opacity: 0.4, textTransform: 'uppercase' }}>Cargando...</div>
    </div>
  )

  if (!anime) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '64px' }}>
      <div style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1.2rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>Anime no encontrado.</div>
    </div>
  )

  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>

      {/* Hero difuminado de fondo */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${anime.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'blur(4px) saturate(0.4)', transform: 'scale(1.06)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,0,2,0.45) 0%, var(--background) 100%)' }} />
      </div>

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 4rem', marginTop: '-9rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem' }}>

        {/* Póster */}
        <img src={anime.imagen} alt={anime.titulo} style={{ width: '220px', aspectRatio: '2/3', objectFit: 'cover', boxShadow: '0 24px 64px rgba(0,0,0,0.35)', border: '1px solid rgba(143,10,28,0.15)' }} />

        {/* Info */}
        <div style={{ paddingTop: '5rem' }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[anime.tipo, anime.estado, ...(anime.episodios ? [`${anime.episodios} eps.`] : [])].map(t => (
              <span key={t} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(143,10,28,0.3)', color: 'var(--text)' }}>{t}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {anime.titulo}
          </h1>

          {/* Score + géneros */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            {anime.puntuacion && (
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>
                {anime.puntuacion.toFixed(1)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {anime.generos.map(g => (
                <span key={g} style={{ fontFamily: "'Cinzel', serif", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.6rem', border: '1px solid rgba(143,10,28,0.22)', color: 'var(--text)' }}>{g}</span>
              ))}
            </div>
          </div>

          {/* Sinopsis */}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text)', fontStyle: 'italic', fontWeight: 300, marginBottom: '1.5rem' }}>
            {anime.sinopsis}
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {usuario && (
              <button onClick={toggleFavorito} style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', padding: '0.9rem 2rem',
                background: esFavorito ? 'var(--accent)' : 'var(--primary)',
                color: 'white', border: 'none', transition: 'all 0.2s',
              }}>
                {esFavorito ? '♥ En favoritos' : '♡ Añadir favorito'}
              </button>
            )}
            {anime.trailer?.url && (
              <a href={anime.trailer.url} target="_blank" rel="noreferrer" style={{
                fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', padding: '0.9rem 2rem',
                background: 'transparent', color: 'var(--accent)',
                border: '1px solid rgba(143,10,28,0.3)', transition: 'all 0.2s',
              }}>
                ▶ Ver trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── RESEÑAS ── */}
      <section style={{ padding: '4rem 4rem 5rem', maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>Reseñas</h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(143,10,28,0.3), transparent)' }} />
          <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>{resenas.length} reseñas</span>
        </div>

        {/* Formulario nueva reseña */}
        {usuario && (
          <div style={{ marginBottom: '2.5rem', padding: '2rem', background: 'white', border: '1px solid rgba(143,10,28,0.08)', borderTop: '3px solid var(--primary)' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.55, marginBottom: '1.2rem' }}>
              Tu reseña
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.5 }}>Puntuación</label>
              <input type="number" min={1} max={10} value={puntuacion} onChange={e => setPuntuacion(e.target.value ? Number(e.target.value) : '')}
                placeholder="1-10"
                style={{ width: '80px', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.4rem 0.6rem', border: 'none', borderBottom: '1px solid rgba(143,10,28,0.2)', background: 'transparent', color: 'var(--text)', outline: 'none' }}
              />
            </div>
            <textarea
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              rows={3}
              style={{ width: '100%', fontFamily: "'Crimson Pro', serif", fontSize: '1rem', padding: '0.8rem', border: '1px solid rgba(143,10,28,0.15)', background: 'transparent', color: 'var(--text)', outline: 'none', resize: 'vertical', marginBottom: '0.8rem' }}
            />
            {errorResena && <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.9rem', color: 'var(--primary)', fontStyle: 'italic', marginBottom: '0.8rem' }}>{errorResena}</p>}
            <button onClick={enviarResena} disabled={enviando} style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', padding: '0.8rem 1.8rem',
              background: 'var(--primary)', color: 'white', border: 'none', opacity: enviando ? 0.6 : 1,
            }}>
              {enviando ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </div>
        )}

        {/* Lista de reseñas */}
        {resenas.length === 0 ? (
          <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', color: 'var(--text)', opacity: 0.5, fontStyle: 'italic' }}>
            Todavía no hay reseñas. ¡Sé el primero!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resenas.map(r => (
              <div key={r._id} style={{ padding: '1.5rem', background: 'white', border: '1px solid rgba(143,10,28,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <div>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                      {typeof r.usuario === 'object' ? r.usuario.nombre : 'Usuario'}
                    </span>
                    {r.puntuacion && (
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)', marginLeft: '1rem' }}>
                        {r.puntuacion}/10
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Crimson Pro', serif", fontSize: '0.8rem', color: 'var(--text)', opacity: 0.4, fontStyle: 'italic' }}>
                      {new Date(r.createdAt).toLocaleDateString('es-ES')}
                    </span>
                    {/* Botón borrar: visible para el autor y para admin */}
                    {usuario && (typeof r.usuario === 'object' ? r.usuario._id === usuario._id : false || usuario.rol === 'admin') && (
                      <button onClick={() => eliminarResena(r._id)} style={{
                        fontFamily: "'Cinzel', serif", fontSize: '0.48rem', letterSpacing: '0.1em',
                        textTransform: 'uppercase', padding: '0.2rem 0.5rem',
                        background: 'transparent', border: '1px solid rgba(143,10,28,0.2)', color: 'var(--primary)',
                      }}>
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
                {r.comentario && (
                  <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '1rem', lineHeight: 1.7, color: 'var(--text)', fontStyle: 'italic' }}>
                    {r.comentario}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default DetalleAnime

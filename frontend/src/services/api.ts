// Todas las llamadas al backend en un solo lugar.
// Usa axios con interceptor para añadir el token JWT
// automáticamente en cada petición protegida.


import axios from 'axios'

// axios.create → instancia personalizada de axios
// baseURL: '/api' → vite.config.ts lo redirige a localhost:3000/api
const api = axios.create({
  baseURL: '/api',
})

// ── INTERCEPTOR DE PETICIÓN ───────────────────────
// Antes de CADA petición, este código se ejecuta.
// Si hay token en localStorage, lo añade al header.
// Así no tienes que escribir el token manualmente.
// Ejemplo: { Authorization: 'Bearer eyJhbGci...' }
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config  // devuelve la config modificada
})

// ════════════════════════════════════════════════
// AUTH  →  /api/auth/*
// ════════════════════════════════════════════════

// POST /api/auth/registro → { token, usuario }
export const registroApi = (datos: object) =>
  api.post('/auth/registro', datos)

// POST /api/auth/login → { token, usuario }
export const loginApi = (datos: object) =>
  api.post('/auth/login', datos)

// GET /api/auth/perfil → { usuario } (requiere token)
export const perfilApi = () =>
  api.get('/auth/perfil')

// PUT /api/auth/perfil → actualiza nombre/avatar
export const actualizarPerfilApi = (datos: object) =>
  api.put('/auth/perfil', datos)

// ════════════════════════════════════════════════
// ANIME  →  /api/anime/*
// ════════════════════════════════════════════════

// GET /api/anime?buscar=x&genero=x&pagina=x
// params es un objeto opcional con los filtros
export const getAnimesApi = (params?: object) =>
  api.get('/anime', { params })

// GET /api/anime/:id → un anime por su _id de MongoDB
export const getAnimeApi = (id: string) =>
  api.get(`/anime/${id}`)

// GET /api/anime/generos → lista de géneros únicos
export const getGenerosApi = () =>
  api.get('/anime/generos')

// POST /api/anime → solo admin
export const crearAnimeApi = (datos: object) =>
  api.post('/anime', datos)

// PUT /api/anime/:id → solo admin
export const editarAnimeApi = (id: string, datos: object) =>
  api.put(`/anime/${id}`, datos)

// DELETE /api/anime/:id → solo admin
export const borrarAnimeApi = (id: string) =>
  api.delete(`/anime/${id}`)

// ════════════════════════════════════════════════
// FAVORITOS  →  /api/favoritos/*
// ════════════════════════════════════════════════

// GET /api/favoritos → mis favoritos (con populate anime)
export const getFavoritosApi = () =>
  api.get('/favoritos')

// POST /api/favoritos/:animeId → añadir favorito
export const addFavoritoApi = (animeId: string) =>
  api.post(`/favoritos/${animeId}`)

// DELETE /api/favoritos/:animeId → quitar favorito
export const deleteFavoritoApi = (animeId: string) =>
  api.delete(`/favoritos/${animeId}`)

// ════════════════════════════════════════════════
// RESEÑAS  →  /api/resenas/*
// ════════════════════════════════════════════════

// GET /api/resenas/:animeId → reseñas de un anime (pública)
export const getResenasApi = (animeId: string) =>
  api.get(`/resenas/${animeId}`)

// POST /api/resenas/:animeId → crear reseña
export const crearResenaApi = (animeId: string, datos: object) =>
  api.post(`/resenas/${animeId}`, datos)

// PUT /api/resenas/:id → editar mi reseña
export const editarResenaApi = (id: string, datos: object) =>
  api.put(`/resenas/${id}`, datos)

// DELETE /api/resenas/:id → borrar reseña
export const borrarResenaApi = (id: string) =>
  api.delete(`/resenas/${id}`)

// ════════════════════════════════════════════════
// ADMIN  →  /api/admin/*  (solo rol admin)
// ════════════════════════════════════════════════

export const getEstadisticasApi = () =>
  api.get('/admin/estadisticas')

export const getUsuariosApi = () =>
  api.get('/admin/usuarios')

export const cambiarRolApi = (id: string, rol: string) =>
  api.put(`/admin/usuarios/${id}/rol`, { rol })

export const toggleActivarApi = (id: string) =>
  api.put(`/admin/usuarios/${id}/activar`)

export const eliminarUsuarioApi = (id: string) =>
  api.delete(`/admin/usuarios/${id}`)

export default api

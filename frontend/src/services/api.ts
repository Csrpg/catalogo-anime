import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// AUTH
export const registroApi = (datos: object) =>
  api.post('/auth/registro', datos)

export const loginApi = (datos: object) =>
  api.post('/auth/login', datos)

export const perfilApi = () =>
  api.get('/auth/perfil')

export const actualizarPerfilApi = (datos: object) =>
  api.put('/auth/perfil', datos)

// ANIME
export const getAnimesApi = (params?: object) =>
  api.get('/anime', { params })

export const getAnimeApi = (id: string) =>
  api.get(`/anime/${id}`)

export const getGenerosApi = () =>
  api.get('/anime/generos')

export const crearAnimeApi = (datos: object) =>
  api.post('/anime', datos)

export const editarAnimeApi = (id: string, datos: object) =>
  api.put(`/anime/${id}`, datos)

export const borrarAnimeApi = (id: string) =>
  api.delete(`/anime/${id}`)

// FAVORITOS
export const getFavoritosApi = () =>
  api.get('/favoritos')

export const addFavoritoApi = (animeId: string) =>
  api.post(`/favoritos/${animeId}`)

export const deleteFavoritoApi = (animeId: string) =>
  api.delete(`/favoritos/${animeId}`)

// RESEÑAS
export const getResenasApi = (animeId: string) =>
  api.get(`/resenas/${animeId}`)

export const crearResenaApi = (animeId: string, datos: object) =>
  api.post(`/resenas/${animeId}`, datos)

export const editarResenaApi = (id: string, datos: object) =>
  api.put(`/resenas/${id}`, datos)

export const borrarResenaApi = (id: string) =>
  api.delete(`/resenas/${id}`)

// ADMIN
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
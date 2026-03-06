export interface Usuario {
  _id: string
  nombre: string
  email: string
  rol: 'usuario' | 'admin'
  avatar: string
  activo: boolean
  createdAt: string
}

export interface Anime {
  _id: string
  malId?: number
  titulo: string
  sinopsis: string
  imagen: string
  trailer: {
    youtubeId: string
    url: string
  }
  generos: string[]
  estado: 'En emisión' | 'Finalizado' | 'Próximamente' | 'Desconocido'
  episodios: number | null
  puntuacion: number | null
  anyo: number | null
  destacado: boolean
  tipo: 'TV' | 'Película' | 'OVA' | 'ONA' | 'Especial' | 'Desconocido'
  fuente: 'jikan' | 'manual'
  createdAt: string
}

export interface Resena {
  _id: string
  usuario: Usuario
  anime: string | Anime
  puntuacion: number | null
  comentario: string
  createdAt: string
}

export interface Favorito {
  _id: string
  usuario: string
  anime: Anime
  createdAt: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
  mensaje: string
}

export interface AnimesResponse {
  animes: Anime[]
  total: number
  pagina: number
  totalPaginas: number
}

export interface Estadisticas {
  totalAnimes: number
  totalUsuarios: number
  totalResenas: number
  totalFavoritos: number
}
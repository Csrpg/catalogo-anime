// Todas las interfaces TypeScript del proyecto.
// .ts (no .tsx) porque este archivo NO tiene JSX,
// solo define tipos que otros archivos importan.


// ── Usuario ──────────────────────────────────────
export interface Usuario {
  _id: string
  nombre: string
  email: string
  rol: 'usuario' | 'admin'   // solo dos valores posibles
  avatar: string
  activo: boolean
  createdAt: string
}

// ── Anime ─────────────────────────────────────────
export interface Anime {
  _id: string
  malId?: number              // opcional: viene de Jikan, null si es manual
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
  destacado: boolean          // true = aparece en el carrusel
  tipo: 'TV' | 'Película' | 'OVA' | 'ONA' | 'Especial' | 'Desconocido'
  fuente: 'jikan' | 'manual'
  createdAt: string
}

// ── Reseña ────────────────────────────────────────
export interface Resena {
  _id: string
  usuario: Usuario            // populate() lo convierte en objeto
  anime: string | Anime       // puede ser ID o objeto según la ruta
  puntuacion: number | null   // opcional (1-10)
  comentario: string          // opcional (max 1000 chars)
  createdAt: string
}

// ── Favorito ──────────────────────────────────────
export interface Favorito {
  _id: string
  usuario: string
  anime: Anime                // populate() lo convierte en objeto
  createdAt: string
}

// ── Respuestas de la API ──────────────────────────

// POST /api/auth/registro  y  POST /api/auth/login
export interface AuthResponse {
  token: string
  usuario: Usuario
  mensaje: string
}

// GET /api/anime  (con paginación)
export interface AnimesResponse {
  animes: Anime[]
  total: number
  pagina: number
  totalPaginas: number
}

// GET /api/admin/estadisticas
export interface Estadisticas {
  totalAnimes: number
  totalUsuarios: number
  totalResenas: number
  totalFavoritos: number
}

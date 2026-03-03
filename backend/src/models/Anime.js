import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema(
  {
    malId: {
      type: Number,
      unique: true,
      sparse: true, // Permite null para animes creados manualmente
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    sinopsis: {
      type: String,
      default: 'Sin sinopsis disponible.',
    },
    imagen: {
      type: String,
      default: '',
    },
    trailer: {
      youtubeId: { type: String, default: '' },
      url: { type: String, default: '' },
    },
    generos: [
      {
        type: String,
        trim: true,
      },
    ],
    estado: {
      type: String,
      enum: ['En emisión', 'Finalizado', 'Próximamente', 'Desconocido'],
      default: 'Desconocido',
    },
    episodios: {
      type: Number,
      default: null,
    },
    puntuacion: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    anyo: {
      type: Number,
      default: null,
    },
    tipo: {
      type: String,
      enum: ['TV', 'Película', 'OVA', 'ONA', 'Especial', 'Desconocido'],
      default: 'TV',
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    fuente: {
      type: String,
      enum: ['jikan', 'manual'],
      default: 'jikan',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  } 
);

// Índice de búsqueda por texto
animeSchema.index({ titulo: 'text', sinopsis: 'text', generos: 'text' });

export default mongoose.model('Anime', animeSchema);
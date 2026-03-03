import mongoose from 'mongoose';

const favoritoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    anime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anime',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Un usuario no puede tener el mismo anime como favorito dos veces
favoritoSchema.index({ usuario: 1, anime: 1 }, { unique: true });

export default mongoose.model('Favorito', favoritoSchema);
import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    anime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anime",
      required: true,
    },

    puntuacion: {
      type: Number,
      min: [1, "La puntuación mínima es 1"],
      max: [10, "La puntuación máxima es 10"],
      default: null,
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [1000, "Maximo 1000 caracteres"],
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

resenaSchema.index({ usuario: 1, anime: 1 }, { unique: true });

export default mongoose.model("Resena", resenaSchema);

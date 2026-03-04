import Favorito from "../models/Favorito.js";

export const obtenerMisFavoritos = async (req, res, next) => {
  try {
    const favoritos = await Favorito.find({
      usuario: req.usuario._id,
    }).populate("anime");
    res.json({ favoritos });
  } catch (error) {
    next(error);
  }
};

export const agregarFavorito = async (req, res, next) => {
  try {
    const favorito = await Favorito.create({
      usuario: req.usuario._id,
      anime: req.params.animeId,
    });
    res.status(201).json({ mensaje: "Anime añadido a favoritos", favorito });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: "Este anime ya está en tus favoritos." });
    }
    next(error);
  }
};

export const eliminarFavorito = async (req, res, next) => {
  try {
    const favorito = await Favorito.findOneAndDelete({
      usuario: req.usuario._id,
      anime: req.params.animeId,
    });
    if (!favorito) {
      return res.status(404).json({ mensaje: "Favorito no encontrado." });
    }
    res.json({ mensaje: "Anime eliminado de favoritos." });
  } catch (error) {
    next(error);
  }
};

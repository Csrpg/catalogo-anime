import Resena from "../models/Resena.js";

export const obtenerResenasPorAnime = async (req, res, next) => {
  try {
    const resenas = await Resena.find({ anime: req.params.animeId })
      .populate("usuario", "nombre avatar")
      .sort({ createdAt: -1 });

    const puntuacionMedia =
      resenas.length > 0
        ? (
            resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length
          ).toFixed(1)
        : null;

    res.json({ resenas, puntuacionMedia, total: resenas.length });
  } catch (error) {
    next(error);
  }
};

export const crearResena = async (req, res, next) => {
  try {
    const { puntuacion, comentario } = req.body;

    // Validación: al menos uno de los dos campos debe tener valor
    if (!puntuacion && !comentario) {
      return res.status(400).json({
        mensaje: "Escribe al menos una puntuación o un comentario.",
      });
    }

    const resena = await Resena.create({
      usuario: req.usuario._id,
      anime: req.params.animeId,
      puntuacion,
      comentario,
    });

    await resena.populate("usuario", "nombre avatar");
    res
      .status(201)
      .json({ mensaje: "Reseña publicada correctamente.", resena });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ mensaje: "Ya has escrito una reseña para este anime." });
    }
    next(error);
  }
};

export const actualizarResena = async (req, res, next) => {
  try {
    const resena = await Resena.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!resena) {
      return res
        .status(404)
        .json({ mensaje: "Reseña no encontrada o no te pertenece." });
    }

    resena.puntuacion = req.body.puntuacion ?? resena.puntuacion;
    resena.comentario = req.body.comentario ?? resena.comentario;
    await resena.save();

    res.json({ mensaje: "Reseña actualizada.", resena });
  } catch (error) {
    next(error);
  }
};

export const eliminarResena = async (req, res, next) => {
  try {
    const filtro =
      req.usuario.rol === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, usuario: req.usuario._id };

    const resena = await Resena.findOneAndDelete(filtro);
    if (!resena) {
      return res
        .status(404)
        .json({ mensaje: "Reseña no encontrada o sin permisos." });
    }
    res.json({ mensaje: "Reseña eliminada." });
  } catch (error) {
    next(error);
  }
};

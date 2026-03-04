import Usuario from "../models/Usuario.js";
import Anime from "../models/Anime.js";
import Resena from "../models/Resena.js";
import Favorito from "../models/Favorito.js";

export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const [totalUsuarios, totalAnimes, totalResenas, totalFavoritos] =
      await Promise.all([
        Usuario.countDocuments(),
        Anime.countDocuments(),
        Resena.countDocuments(),
        Favorito.countDocuments(),
      ]);
    res.json({ totalUsuarios, totalAnimes, totalResenas, totalFavoritos });
  } catch (error) {
    next(error);
  }
};

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    res.json({ usuarios });
  } catch (error) {
    next(error);
  }
};

export const cambiarRolUsuario = async (req, res, next) => {
  try {
    const { rol } = req.body;
    if (!["usuario", "admin"].includes(rol)) {
      return res.status(400).json({ mensaje: "Rol no válido." });
    }
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true },
    );
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    res.json({ mensaje: `Rol actualizado a "${rol}".`, usuario });
  } catch (error) {
    next(error);
  }
};

export const toggleActivarUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    usuario.activo = !usuario.activo;
    await usuario.save();
    const estado = usuario.activo ? "activada" : "desactivada";
    res.json({ mensaje: `Cuenta ${estado}.`, usuario });
  } catch (error) {
    next(error);
  }
};

export const eliminarUsuario = async (req, res, next) => {
  try {
    if (req.params.id === req.usuario._id.toString()) {
      return res
        .status(400)
        .json({ mensaje: "No puedes eliminar tu propia cuenta." });
    }
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    await Resena.deleteMany({ usuario: req.params.id });
    await Favorito.deleteMany({ usuario: req.params.id });
    res.json({ mensaje: "Usuario y sus datos eliminados." });
  } catch (error) {
    next(error);
  }
};

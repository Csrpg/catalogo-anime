import Anime from "../models/Anime.js";

// ---- Función: obtener Animes

export const obtenerAnimes = async (req, res, next) => {
  try {
    const {
      buscar,
      genero,
      tipo,
      estado,
      pagina = 1,
      limite = 20,
      destacado,
    } = req.query;

    const filtro = {};
    if (buscar) filtro.$text = { $search: buscar };
    if (genero) filtro.generos = { $in: [genero] };
    if (tipo) filtro.tipo = tipo;
    if (estado) filtro.estado = estado;
    if (destacado === "true") filtro.destacado = true;

    const skip = (Number(pagina) - 1) * Number(limite);
    const total = await Anime.countDocuments(filtro);
    const animes = await Anime.find(filtro)
      .sort({ puntuacion: -1 })
      .skip(skip)
      .limit(Number(limite));

    res.json({
      animes,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / Number(limite)),
    });
  } catch (error) {
    next(error);
  }
};

//--- Función: obtenerGeneros

export const obtenerGeneros = async (req, res, next) => {
  try {
    const generos = await Anime.distinct("generos");
    res.json({ generos: generos.sort() });
  } catch (error) {
    next(error);
  }
};

//---- Función: obtenerAnimePorId

export const obtenerAnimePorId = async (req, res, next) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ mensaje: "Anime no encontrado." });
    }
    res.json({ anime });
  } catch (error) {
    next(error);
  }
};

// ---- Función: crearAnime

export const crearAnime = async (req, res, next) => {
  try {
    const anime = await Anime.create({ ...req.body, fuente: "manual" });
    res.status(201).json({ mensaje: "Anime creado correctamente.", anime });
  } catch (error) {
    next(error);
  }
};

// --- Función: actualizarAnime

export const actualizarAnime = async (req, res, next) => {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!anime)
      return res.status(404).json({ mensaje: "Anime no encontrado." });
    res.json({ mensaje: "Anime actualizado.", anime });
  } catch (error) {
    next(error);
  }
};

// --- Función: eliminarAnime

export const eliminarAnime = async (req, res, next) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    if (!anime)
      return res.status(404).json({ mensaje: "Anime no encontrado." });
    res.json({ mensaje: "Anime eliminado correctamente." });
  } catch (error) {
    next(error);
  }
};

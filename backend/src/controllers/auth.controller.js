import Usuario from '../models/Usuario.js';
import { generarToken } from '../middleware/auth.middleware.js';

// ---- POST /api/auth/registro 
export const registro = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'Ya existe una cuenta con ese email.' });
    }

    const usuario = await Usuario.create({ nombre, email, password });
    const token = generarToken(usuario._id);

    res.status(201).json({
      mensaje: '¡Registro exitoso!',
      token,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/login 
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Tu cuenta ha sido desactivada.' });
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: '¡Bienvenido de nuevo!',
      token,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

// ---- GET /api/auth/perfil 
export const obtenerPerfil = async (req, res, next) => {
  try {
    res.json({ usuario: req.usuario });
  } catch (error) {
    next(error);
  }
};

// ---- PUT /api/auth/perfil 
export const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre, avatar } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre, avatar },
      { new: true, runValidators: true }
    );

    res.json({ mensaje: 'Perfil actualizado.', usuario });
  } catch (error) {
    next(error);
  }
};
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// ─── Verificar token JWT 
export const proteger = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'No autorizado. Usuario no encontrado.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'No autorizado. Cuenta desactivada.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'No autorizado. Token inválido o expirado.' });
  }
};

// ─── Verificar rol de administrador 
export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

// ─── Generador de token JWT 
export const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
// ─── Ruta no encontrada 
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ─── Manejador global de errores 
export const errorHandler = (err, req, res, next) => {
  // Si el status sigue siendo 200 por alguna razón, lo ponemos a 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Error de ID de MongoDB mal formado
  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'ID no válido.' });
  }

  // Error de clave duplicada en MongoDB
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(400).json({ mensaje: `El valor del campo "${campo}" ya existe.` });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: mensajes.join('. ') });
  }

  res.status(statusCode).json({
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
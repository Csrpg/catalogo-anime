export const requestLogger = (req, res, next) => {
  const ahora = new Date().toLocaleString('es-ES');
  const metodo = req.method.padEnd(7);
  console.log(`[${ahora}]  ${metodo}  ${req.originalUrl}`);
  next();
};
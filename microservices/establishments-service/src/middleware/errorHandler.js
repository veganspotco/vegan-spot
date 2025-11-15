// ¿POR QUÉ un manejador de errores centralizado?
// - Logging consistente
// - Respuestas de error uniformes
// - Fácil debugging

// Asegúrate de que exportas la función correctamente
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      error: err.detail
    });
  }

  // Error de llave foránea
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      error: err.detail
    });
  }

  // Error de validación personalizado
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: err.details
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
};
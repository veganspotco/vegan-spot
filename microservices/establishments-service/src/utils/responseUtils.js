export class ApiResponse {
  static success(data, message = 'Operación exitosa') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message = 'Error en la operación', errors = []) {
    return {
      success: false,
      message,
      errors
    };
  }

  static paginated(data, pagination, message = 'Datos obtenidos exitosamente') {
    return {
      success: true,
      message,
      data,
      pagination
    };
  }
}
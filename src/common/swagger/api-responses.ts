import { ApiResponseOptions } from '@nestjs/swagger';

export const ApiResponses = {
  Unauthorized: {
    status: 401,
    description: 'No autorizado',
  } as ApiResponseOptions,

  Forbidden: {
    status: 403,
    description: 'Prohibido: el usuario no tiene permisos para esta acción',
  } as ApiResponseOptions,

  NotFound: {
    status: 404,
    description: 'Recurso no encontrado',
  } as ApiResponseOptions,

  BadRequest: {
    status: 400,
    description: 'Petición incorrecta: datos inválidos',
  } as ApiResponseOptions,

  ServerError: {
    status: 500,
    description: 'Error interno del servidor',
  } as ApiResponseOptions,
};

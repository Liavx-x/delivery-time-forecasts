
import { z } from 'zod';
// import { clinicNames } from '@/types'; // No longer used for enum validation here

export const predictionSchema = z.object({
  clinic: z.string({ required_error: "El nombre de la clínica es requerido." })
    .min(1, 'El nombre de la clínica es requerido.'),
  timeOfDay: z.coerce
    .number({ invalid_type_error: 'Debe ser un número', required_error: "La hora de salida es requerida." })
    .min(0, 'No puede ser menor que 0')
    .max(23.99, 'No puede ser 24 o más'),
  zone: z.enum(['1', '2', '3'], { errorMap: () => ({ message: 'Seleccione una localidad válida.' }) }),
  temperature: z.coerce
    .number({ invalid_type_error: 'Debe ser un número', required_error: "La temperatura es requerida." }),
  distance: z.coerce
    .number({ invalid_type_error: 'Debe ser un número', required_error: "La distancia es requerida." })
    .positive('La distancia debe ser un número positivo.'),
  trafficVolume: z.coerce
    .number({ invalid_type_error: 'Debe ser un número', required_error: "El volumen de tráfico es requerido." })
    .nonnegative('El volumen de tráfico no puede ser negativo.'),
});

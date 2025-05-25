
import type { z } from 'zod';
import type { predictionSchema } from '@/lib/validators';

// This list can be used for suggestions or future autocomplete features,
// but it's no longer a strict enum for form validation.
export const clinicNames = [
  "CLINICA DE LA MUJER CARTAGENA SAS",
  "CENTRO MEDICO CRECER LTDA",
  "CARTAGENA PLASTIC & RECONSTRUCTIVE SURGERY INSTITUTE S.A.S",
  "PROMOTORA NEUROCIENCIAS S.A.S",
  "CLINICA CARTAGENA DEL MAR S.A.S"
] as const;

// Type for clinic names if you still want to reference the known list
export type KnownClinicName = typeof clinicNames[number];

export type PredictionInput = z.infer<typeof predictionSchema>;

export interface PredictionRecord extends PredictionInput {
  id: string;
  predictedTime: number; // Store as raw minutes
  timestamp: string; // ISO string format
}

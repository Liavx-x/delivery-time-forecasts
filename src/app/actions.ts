
'use server';

import type { PredictionInput } from '@/types';

// La fórmula actual no utiliza la clínica, pero se incluye en los datos
// por si se necesita en el futuro para lógicas más complejas o ajustes.
export async function calculatePrediction(
  data: PredictionInput
): Promise<{ predictedTime: number | null; error?: string }> {
  try {
    const { clinic, timeOfDay, zone, temperature, distance, trafficVolume } = data;

    const zoneValue = parseInt(zone, 10);

    // Nota: 'clinic' no se usa en la fórmula actual.
    // Formula: 13.2784 + 0.171288*Hora del día - 5.80274*Zona (Localidad) + 0.189407*Clima (°C) + 0.6362*Distancia + 0.0077271*Volumen de tráfico
    const prediction =
      13.2784 +
      0.171288 * timeOfDay -
      5.80274 * zoneValue +
      0.189407 * temperature +
      0.6362 * distance +
      0.0077271 * trafficVolume;

    // Assuming the prediction is in minutes.
    // Ensure the prediction is not negative.
    const finalPrediction = Math.max(0, prediction);

    return { predictedTime: finalPrediction };
  } catch (error) {
    console.error('Error calculating prediction:', error);
    return { predictedTime: null, error: 'Failed to calculate prediction.' };
  }
}

export async function findBestDepartureTime(
  baseData: Omit<PredictionInput, 'timeOfDay'>
): Promise<{ bestTimeOfDay: number | null; bestPredictedTime: number | null; error?: string }> {
  const departureHours: number[] = [];
  // Iterar desde las 7:00 (7.0) hasta las 16:00 (4 PM) inclusive
  for (let hour = 7; hour <= 16; hour++) {
    departureHours.push(parseFloat(hour.toFixed(2)));
  }

  let bestTimeOfDay: number | null = null;
  let minPredictedTime: number | null = null;

  try {
    for (const timeOfDay of departureHours) {
      const currentInput: PredictionInput = { ...baseData, timeOfDay };
      const result = await calculatePrediction(currentInput);

      if (result.predictedTime !== null) {
        if (minPredictedTime === null || result.predictedTime < minPredictedTime) {
          minPredictedTime = result.predictedTime;
          bestTimeOfDay = timeOfDay;
        }
      }
    }

    if (bestTimeOfDay !== null && minPredictedTime !== null) {
      return { bestTimeOfDay, bestPredictedTime: minPredictedTime };
    } else {
      return { bestTimeOfDay: null, bestPredictedTime: null, error: 'No se pudo encontrar una hora óptima con los datos proporcionados. Intente con otros parámetros.' };
    }
  } catch (error) {
    console.error('Error finding best departure time:', error);
    return { bestTimeOfDay: null, bestPredictedTime: null, error: 'Error al calcular la mejor hora de salida.' };
  }
}

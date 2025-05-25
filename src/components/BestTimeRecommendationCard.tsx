
'use client';

import type * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { formatDuration } from './PredictionResultCard';
import { floatToTime } from './ui/time-picker'; // Importar floatToTime

interface BestTimeRecommendationCardProps {
  recommendation: {
    bestTimeOfDay: number;
    bestPredictedTime: number;
  };
}

// Helper para formatear timeOfDay (float) a HH:MM AM/PM string
const formatTimeOfDay = (timeOfDay: number | undefined): string => {
  if (timeOfDay === undefined || Number.isNaN(timeOfDay)) return 'N/D';
  const { hour, minute, period } = floatToTime(timeOfDay); // Usar floatToTime importado
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
};

export function BestTimeRecommendationCard({ recommendation }: BestTimeRecommendationCardProps) {
  const formattedBestTime = formatTimeOfDay(recommendation.bestTimeOfDay);
  const formattedDuration = formatDuration(recommendation.bestPredictedTime);

  return (
    <Card className="mt-6 shadow-xl bg-card border-accent">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-accent">
          <Lightbulb className="mr-2 h-6 w-6" />
          Recomendación de Horario Óptimo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-card-foreground">
          La mejor hora estimada para salir es a las <strong className="text-accent">{formattedBestTime}</strong>.
        </p>
        <p className="text-md mt-1 text-card-foreground">
          Con esta hora, el tiempo de entrega estimado sería de aproximadamente <strong className="text-accent">{formattedDuration}</strong>.
        </p>
        <CardDescription className="mt-3 text-sm">
          Esta recomendación se basa en probar diferentes horas de salida entre las 7 AM y las 4 PM (inclusive) con los datos que proporcionaste anteriormente.
        </CardDescription>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Timer } from 'lucide-react';

interface PredictionResultCardProps {
  predictedTime: number | null; // en minutos
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null || minutes < 0) return 'N/D';
  if (minutes === 0) return 'Casi de inmediato';

  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);

  let result = '';
  if (h > 0) {
    result += `${h} hora${h > 1 ? 's' : ''} `;
  }
  if (m > 0) {
    result += `${m} minuto${m > 1 ? 's' : ''}`;
  }
  
  return result.trim() || 'Menos de un minuto';
}


export function PredictionResultCard({ predictedTime }: PredictionResultCardProps) {
  if (predictedTime === null) {
    return null;
  }

  return (
    <Card className="shadow-xl bg-primary border-primary">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-primary-foreground">
          <Timer className="mr-2 h-7 w-7" />
          Tiempo de Entrega Estimado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-primary-foreground">
          {formatDuration(predictedTime)}
        </p>
        <CardDescription className="text-primary-foreground/80 mt-1">
          Basado en los datos proporcionados. Esta es una estimación y el tiempo real puede variar.
        </CardDescription>
      </CardContent>
    </Card>
  );
}


import type { PredictionRecord } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { formatDuration } from './PredictionResultCard';

interface PredictionHistoryTableProps {
  history: PredictionRecord[];
}

export function PredictionHistoryTable({ history }: PredictionHistoryTableProps) {
  if (history.length === 0) {
    return (
        <Card className="mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <History className="mr-2 h-6 w-6 text-primary" />
                    Historial de Predicciones
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Aún no se han realizado predicciones.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <History className="mr-2 h-7 w-7 text-primary" />
          Historial de Predicciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Una lista de tus predicciones recientes de tiempo de entrega.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Clínica</TableHead>
              <TableHead>Hora Salida</TableHead>
              <TableHead>Localidad</TableHead>
              <TableHead>Temp (°C)</TableHead>
              <TableHead>Distancia (km)</TableHead>
              <TableHead>Tráfico (veh/hr)</TableHead>
              <TableHead className="text-right">Tiempo Estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>{record.clinic}</TableCell>
                <TableCell>{record.timeOfDay.toFixed(2)}</TableCell>
                <TableCell>{`Localidad ${record.zone}`}</TableCell>
                <TableCell>{record.temperature}</TableCell>
                <TableCell>{record.distance}</TableCell>
                <TableCell>{record.trafficVolume}</TableCell>
                <TableCell className="text-right">{formatDuration(record.predictedTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

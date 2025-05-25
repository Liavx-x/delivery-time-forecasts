
'use client';

import * as React from 'react';
import { DeliveryPredictionForm } from '@/components/DeliveryPredictionForm';
import { PredictionResultCard } from '@/components/PredictionResultCard';
import { BestTimeRecommendationCard } from '@/components/BestTimeRecommendationCard';
import { PredictionHistoryTable } from '@/components/PredictionHistoryTable';
import { Header } from '@/components/Header';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react'; // Import an icon for the alert
import { useToast } from "@/hooks/use-toast";
import type { PredictionInput, PredictionRecord } from '@/types';
import { calculatePrediction, findBestDepartureTime } from './actions'; // Server Actions

export default function HomePage() {
  const [predictedTime, setPredictedTime] = React.useState<number | null>(null);
  const [history, setHistory] = React.useState<PredictionRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const [lastSubmittedData, setLastSubmittedData] = React.useState<PredictionInput | null>(null);
  const [bestTimeRecommendation, setBestTimeRecommendation] = React.useState<{ bestTimeOfDay: number; bestPredictedTime: number } | null>(null);
  const [isFindingBestTime, setIsFindingBestTime] = React.useState(false);
  const [trafficAlert, setTrafficAlert] = React.useState<string | null>(null);


  const handleFormSubmit = async (data: PredictionInput) => {
    setIsSubmitting(true);
    setPredictedTime(null); 
    setBestTimeRecommendation(null); 
    setLastSubmittedData(null); 
    setTrafficAlert(null); // Clear previous traffic alert

    const result = await calculatePrediction(data);

    if (result.error || result.predictedTime === null) {
      toast({
        title: "Error",
        description: result.error || "No se pudo calcular la predicción.",
        variant: "destructive",
      });
      setPredictedTime(null);
    } else {
      setPredictedTime(result.predictedTime);
      setLastSubmittedData(data); 
      const newRecord: PredictionRecord = {
        ...data,
        id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
        predictedTime: result.predictedTime,
        timestamp: new Date().toISOString(),
      };
      setHistory((prevHistory) => [newRecord, ...prevHistory].slice(0, 10));
      toast({
        title: "¡Éxito!",
        description: "Tiempo de entrega estimado con éxito.",
      });

      if (data.trafficVolume >= 500) {
        setTrafficAlert(`El volumen de tráfico ingresado (${data.trafficVolume} veh/hr) es considerablemente alto. Esto podría impactar significativamente el tiempo de entrega.`);
      }
    }
    setIsSubmitting(false);
  };

  const handleFindBestTime = async () => {
    if (!lastSubmittedData) {
      toast({
        title: "Información Faltante",
        description: "Primero calcula una predicción para obtener una recomendación.",
        variant: "destructive",
      });
      return;
    }

    setIsFindingBestTime(true);
    setBestTimeRecommendation(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { timeOfDay, ...baseDataForRecommendation } = lastSubmittedData;

    const recommendationResult = await findBestDepartureTime(baseDataForRecommendation);

    if (recommendationResult.error || recommendationResult.bestTimeOfDay === null || recommendationResult.bestPredictedTime === null) {
      toast({
        title: "Error en Recomendación",
        description: recommendationResult.error || "No se pudo obtener una recomendación.",
        variant: "destructive",
      });
      setBestTimeRecommendation(null);
    } else {
      setBestTimeRecommendation({
        bestTimeOfDay: recommendationResult.bestTimeOfDay,
        bestPredictedTime: recommendationResult.bestPredictedTime,
      });
      toast({
        title: "Recomendación Lista",
        description: "Se encontró la mejor hora de salida estimada.",
      });
    }
    setIsFindingBestTime(false);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="space-y-8 max-w-3xl mx-auto">
          <DeliveryPredictionForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
          
          {trafficAlert && (
            <Alert variant="accent" className="mt-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Aviso de Tráfico Alto</AlertTitle>
              <AlertDescription>{trafficAlert}</AlertDescription>
            </Alert>
          )}

          {predictedTime !== null && <PredictionResultCard predictedTime={predictedTime} />}
          
          {predictedTime !== null && !isSubmitting && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={handleFindBestTime} 
                disabled={isFindingBestTime || !lastSubmittedData}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isFindingBestTime ? 'Buscando Mejor Hora...' : 'Recomendar Mejor Hora de Salida'}
              </Button>
            </div>
          )}

          {bestTimeRecommendation && <BestTimeRecommendationCard recommendation={bestTimeRecommendation} />}
          
          <PredictionHistoryTable history={history} />
        </div>
      </main>
      <Toaster />
      <footer className="py-6 text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} As de los Tiempos de Entrega. Todos los derechos reservados.
      </footer>
    </div>
  );
}

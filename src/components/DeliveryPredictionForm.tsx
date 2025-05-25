
'use client';

import type * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, MapPin, Thermometer, Milestone, Users, Calculator, Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimePicker } from '@/components/ui/time-picker';
import type { PredictionInput } from '@/types';
import { predictionSchema } from '@/lib/validators';


interface DeliveryPredictionFormProps {
  onSubmit: (data: PredictionInput) => Promise<void>;
  isSubmitting: boolean;
}

export function DeliveryPredictionForm({ onSubmit, isSubmitting }: DeliveryPredictionFormProps) {
  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      clinic: '', 
      timeOfDay: undefined, // TimePicker handles initial display for undefined
      zone: undefined,      // For Select, undefined will show placeholder
      temperature: '',      // Initialize as empty string
      distance: '',         // Initialize as empty string
      trafficVolume: '',    // Initialize as empty string
    },
  });

  const handleFormSubmit = async (data: PredictionInput) => {
    await onSubmit(data);
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Calculator className="mr-2 h-7 w-7 text-primary" />
          Estimar Tiempo de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clinic"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      Clínica
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre de la clínica"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Ingrese el nombre de la clínica de destino.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      Hora de Salida
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Seleccione la hora de salida del pedido.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      Localidad
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una localidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex flex-col gap-1 py-1">
                            <span>Localidad 1</span>
                            <span className="text-xs text-muted-foreground whitespace-normal">Incluye el Centro Histórico, Bocagrande, Castillogrande, El Laguito, La Matuna, y barrios turísticos y comerciales.</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex flex-col gap-1 py-1">
                            <span>Localidad 2</span>
                            <span className="text-xs text-muted-foreground whitespace-normal">Incluye barrios residenciales y turísticos como Manga, Pie de la Popa, Crespo, Canapote, El Cabrero, entre otros.</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                           <div className="flex flex-col gap-1 py-1">
                            <span>Localidad 3</span>
                            <span className="text-xs text-muted-foreground whitespace-normal">Incluye zonas industriales, populares y rurales (Olaya Herrera, El Pozón, La María, Pasacaballos, Mamonal, etc.).</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Elija la localidad de entrega.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Thermometer className="mr-2 h-4 w-4 text-muted-foreground" />
                      Clima (°C)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ej., 25"
                        {...field}
                        value={field.value === undefined ? '' : field.value} // Ensure value is not undefined
                        disabled={isSubmitting}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '') {
                            field.onChange(''); // Allow empty string for clearing field
                          } else {
                            const num = parseFloat(val);
                            field.onChange(isNaN(num) ? '' : num); // Pass number or empty string if NaN
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Temperatura actual en Celsius.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Milestone className="mr-2 h-4 w-4 text-muted-foreground" />
                      Distancia (km)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ej., 10.5"
                        {...field}
                        value={field.value === undefined ? '' : field.value} // Ensure value is not undefined
                        step="0.1"
                        min="0.1"
                        disabled={isSubmitting}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '') {
                            field.onChange(''); 
                          } else {
                            const num = parseFloat(val);
                            field.onChange(isNaN(num) ? '' : num);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Distancia al destino en kilómetros.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="trafficVolume"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    Volumen de Tráfico (vehículos/hora)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ej., 300"
                      {...field}
                      value={field.value === undefined ? '' : field.value} // Ensure value is not undefined
                      disabled={isSubmitting}
                      onChange={e => {
                          const val = e.target.value;
                          if (val === '') {
                            field.onChange('');
                          } else {
                            const num = parseFloat(val);
                            field.onChange(isNaN(num) ? '' : num);
                          }
                        }}
                    />
                  </FormControl>
                  <FormDescription>Vehículos estimados por hora en la ruta.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'Calculando...' : 'Calcular Predicción'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

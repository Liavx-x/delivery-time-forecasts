
'use client';

import * as React from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: number; // timeOfDay: 0.0 to 23.99
  onChange?: (value: number) => void;
  disabled?: boolean;
}

// Helper to convert timeOfDay (float) to h, m, period
export const floatToTime = (timeOfDay: number | undefined) => {
  if (timeOfDay === undefined || Number.isNaN(timeOfDay)) return { hour: 12, minute: 0, period: 'PM' as 'AM' | 'PM' };
  const totalMinutes = Math.round(timeOfDay * 60);
  let h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h >= 12 && h < 24 ? 'PM' : 'AM';
  if (h === 0) h = 12; // Midnight case (00:xx) -> 12 AM
  if (h > 12) h -= 12; // Convert 13-23 to 1-11 PM
  return { hour: h, minute: m, period };
};

// Helper to convert h, m, period to timeOfDay (float)
const timeToFloat = (hour: number, minute: number, period: 'AM' | 'PM') => {
  let h24 = hour;
  if (period === 'PM' && hour !== 12) h24 = hour + 12;
  if (period === 'AM' && hour === 12) h24 = 0; // 12 AM is 00 hours
  return parseFloat((h24 + minute / 60).toFixed(2));
};

// Helper to format display time
const formatDisplayTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
};

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Initialize internal state from value prop or default
  const { hour: initialH, minute: initialM, period: initialP } = floatToTime(value);
  const [currentHour, setCurrentHour] = React.useState(initialH); // 1-12
  const [currentMinute, setCurrentMinute] = React.useState(initialM); // 0-59
  const [currentPeriod, setCurrentPeriod] = React.useState<'AM' | 'PM'>(initialP);

  // Effect to update internal state when 'value' prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      const { hour: newH, minute: newM, period: newP } = floatToTime(value);
      setCurrentHour(newH);
      setCurrentMinute(newM);
      setCurrentPeriod(newP);
    } else {
      // Reset to default if value becomes undefined
      const { hour: defaultH, minute: defaultM, period: defaultP } = floatToTime(undefined);
      setCurrentHour(defaultH);
      setCurrentMinute(defaultM);
      setCurrentPeriod(defaultP);
    }
  }, [value]);

  const handleHourChange = (val: number) => {
    let newHour = val;
    if (val < 1) newHour = 12;
    else if (val > 12) newHour = 1;
    setCurrentHour(newHour);
  };

  const handleMinuteChange = (val: number) => {
    let newMinute = val;
    if (val < 0) newMinute = 59;
    else if (val > 59) newMinute = 0;
    setCurrentMinute(newMinute);
  };

  const handleSetTime = () => {
    if (onChange) {
      onChange(timeToFloat(currentHour, currentMinute, currentPeriod));
    }
    setIsOpen(false);
  };

  const displayedTime = value !== undefined 
    ? formatDisplayTime(currentHour, currentMinute, currentPeriod) 
    : "HH:MM AM/PM";

  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    if (!isNaN(numValue)) {
      handleHourChange(numValue);
    } else if (e.target.value === "") {
       // Allow clearing for typing, but it might revert if blur or other action.
       // For simplicity, we might just clamp. Here, let's ensure it's always a number.
       setCurrentHour(currentHour); // Revert to current if input is invalid
    }
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
     if (!isNaN(numValue)) {
      handleMinuteChange(numValue);
    } else if (e.target.value === "") {
       setCurrentMinute(currentMinute);
    }
  };


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            (value === undefined || Number.isNaN(value)) && "text-muted-foreground"
          )}
          disabled={disabled}
          aria-label="Seleccionar hora"
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayedTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            {/* Hour */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleHourChange(currentHour + 1)} disabled={disabled} aria-label="Aumentar hora">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                value={String(currentHour).padStart(2, '0')}
                onFocus={(e) => e.target.select()}
                onChange={handleHourInputChange}
                onBlur={(e) => handleHourChange(parseInt(e.target.value,10) || currentHour)}
                className="w-16 h-12 text-center text-2xl tabular-nums"
                maxLength={2}
                disabled={disabled}
                aria-label="Hora"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleHourChange(currentHour - 1)} disabled={disabled} aria-label="Disminuir hora">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <span className="text-2xl pb-3 select-none">:</span>

            {/* Minute */}
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMinuteChange(currentMinute + 1)} disabled={disabled} aria-label="Aumentar minuto">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                value={String(currentMinute).padStart(2, '0')}
                onFocus={(e) => e.target.select()}
                onChange={handleMinuteInputChange}
                onBlur={(e) => handleMinuteChange(parseInt(e.target.value,10) || currentMinute)}
                className="w-16 h-12 text-center text-2xl tabular-nums"
                maxLength={2}
                disabled={disabled}
                aria-label="Minuto"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMinuteChange(currentMinute - 1)} disabled={disabled} aria-label="Disminuir minuto">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col space-y-1 ml-2 self-center">
              <Button
                variant={currentPeriod === 'AM' ? 'default' : 'outline'}
                size="sm"
                className="w-12 h-9"
                onClick={() => setCurrentPeriod('AM')}
                disabled={disabled}
              >
                AM
              </Button>
              <Button
                variant={currentPeriod === 'PM' ? 'default' : 'outline'}
                size="sm"
                className="w-12 h-9"
                onClick={() => setCurrentPeriod('PM')}
                disabled={disabled}
              >
                PM
              </Button>
            </div>
          </div>
          <Button onClick={handleSetTime} className="w-full" disabled={disabled}>Establecer Hora</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

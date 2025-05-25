
import { PackageCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 bg-card shadow-md">
      <div className="container mx-auto flex items-center space-x-3">
        <PackageCheck className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Tiempo de entrega estimado (DULCAR S.A.S)</h1>
      </div>
    </header>
  );
}

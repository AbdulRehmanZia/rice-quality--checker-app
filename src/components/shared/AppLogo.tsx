import Link from 'next/link';
import { Sprout } from 'lucide-react'; // Using Sprout as a generic 'growth/health' icon for rice

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
      <Sprout className="h-8 w-8" />
      <h1 className="text-2xl font-headline font-bold">SafeRice Analyzer</h1>
    </Link>
  );
}

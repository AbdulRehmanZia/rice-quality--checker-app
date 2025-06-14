// src/app/(auth)/layout.tsx
import { AppLogo } from '@/components/shared/AppLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mb-8">
        <AppLogo />
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}

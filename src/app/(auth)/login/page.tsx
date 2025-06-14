// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - SafeRice Analyzer',
  description: 'Login to your SafeRice Analyzer account.',
};

export default function LoginPage() {
  return <LoginForm />;
}

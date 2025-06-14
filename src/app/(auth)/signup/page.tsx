// src/app/(auth)/signup/page.tsx
import { SignupForm } from '@/components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - SafeRice Analyzer',
  description: 'Create a new SafeRice Analyzer account.',
};

export default function SignupPage() {
  return <SignupForm />;
}

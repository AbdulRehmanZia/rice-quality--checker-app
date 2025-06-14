
// src/app/(app)/dashboard/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Wheat, SearchCheck, HeartPulse, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
// import Image from 'next/image'; // Image component no longer needed here

// Cannot export metadata from client component. Move to parent or use generateMetadata.
// For now, removing. If needed, this page can be refactored or metadata moved.
// export const metadata: Metadata = {
//   title: 'Dashboard - SafeRice Analyzer',
// };


const featureCards = [
  {
    title: "Rice Classification",
    description: "Unlock the secrets of your rice! Instantly classify grains as long, short, or broken with our smart AI analysis.",
    href: "/rice-classification",
    icon: Wheat,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
  },
  {
    title: "Plant Disease Detection",
    description: "Is your rice crop under threat? Upload an image and let our AI quickly identify potential diseases, helping you act fast.",
    href: "/disease-detection",
    icon: SearchCheck,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-300",
  },
  {
    title: "Plant Health Check",
    description: "Curious about your rice plants' vitality? Get an instant AI-powered health score and insights with a single photo.",
    href: "/health-check",
    icon: HeartPulse,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-300",
  },
];


export default function DashboardPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // This should ideally be handled by the layout, but as a fallback:
    return <p>Loading user data or redirecting...</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-4xl font-headline text-primary">
            Welcome to SafeRice Analyzer, {currentUser.email.split('@')[0]}!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground font-body">
            Your AI-powered assistant for rice quality and plant health analysis. Get started by selecting a tool below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body">
            Utilize cutting-edge AI to gain insights into your rice crops. Whether you&apos;re classifying grains, detecting diseases, or checking plant health, SafeRice Analyzer provides quick and actionable information.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col border-2 ${feature.borderColor} hover:border-primary group`}>
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <feature.icon className={`h-10 w-10 p-2 rounded-lg ${feature.bgColor} ${feature.textColor}`} />
                  <CardTitle className={`text-2xl font-headline ${feature.textColor}`}>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-4 flex flex-col justify-center"> {/* Adjusted for better text centering if needed */}
                <CardDescription className="text-base text-muted-foreground font-body mb-4">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-end text-sm font-medium text-accent group-hover:text-primary transition-colors">
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-lg mt-8 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-accent" />
            <CardTitle className="text-2xl font-headline text-accent">Did You Know?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Rice is a staple food for over half of the world&apos;s population. Ensuring its quality and health is crucial for global food security. SafeRice Analyzer aims to empower farmers and researchers with accessible AI tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

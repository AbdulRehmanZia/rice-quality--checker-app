
// src/app/(app)/dashboard/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Wheat, SearchCheck, HeartPulse, Lightbulb } from 'lucide-react';

const featureCards = [
  {
    title: "Rice Classification",
    description: "Snap a pic, know your rice! Instantly ID long, short, or broken grains and unlock quality insights.",
    href: "/rice-classification",
    icon: Wheat,
  },
  {
    title: "Plant Disease Detection",
    description: "Crop concerns? Upload an image for an AI-driven disease scan. Catch issues early, protect your yield.",
    href: "/disease-detection",
    icon: SearchCheck,
  },
  {
    title: "Plant Health Check",
    description: "Your rice plant's personal wellness score! Get AI-powered health insights from a single photo.",
    href: "/health-check",
    icon: HeartPulse,
  },
];


export default function DashboardPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading user data or redirecting...</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="animate-fade-in-up border-primary/20">
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
        {featureCards.map((feature, index) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card 
              className="h-full flex flex-col border border-border hover:border-primary hover:shadow-lg animate-fade-in-up transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-10 w-10 p-2 rounded-lg bg-primary/10 text-primary" />
                  <CardTitle className="text-2xl font-headline text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-4 flex flex-col justify-center">
                <CardDescription className="text-base text-muted-foreground font-body mb-4">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-end text-sm font-medium text-accent group-hover:text-primary transition-colors duration-300">
                  Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 border-accent/20 animate-fade-in-up" style={{ animationDelay: `${featureCards.length * 100}ms` }}>
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

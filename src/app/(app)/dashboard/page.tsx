
// src/app/(app)/dashboard/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
      <Card className="animate-fade-in-up border-primary/20 shadow-lg">
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
          <Link href={feature.href} key={feature.title} className="group block">
            <Card 
              className="h-full flex flex-col border border-border group-hover:border-primary group-hover:shadow-xl group-hover:bg-primary/5 animate-fade-in-up transition-all duration-300 group-hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/5 group-hover:bg-primary/10 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-md font-semibold font-headline text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4 pt-2">
                <CardDescription className="text-sm text-muted-foreground font-body">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex w-full justify-end">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary-foreground border border-primary/20 bg-primary/5 group-hover:bg-primary group-hover:border-primary rounded-lg px-3 py-1.5 transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-none">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 border-accent/20 animate-fade-in-up shadow-lg" style={{ animationDelay: `${featureCards.length * 100}ms` }}>
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


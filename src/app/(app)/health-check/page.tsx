// src/app/(app)/health-check/page.tsx
"use client";

import { useState } from 'react';
import { ImageCapture } from '@/components/shared/ImageCapture';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { assessPlantHealth, type AssessPlantHealthOutput } from '@/ai/flows/assess-plant-health';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse, Zap, Info, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const getHealthStatus = (score: number): { text: string; color: string; icon: React.ElementType } => {
  if (score >= 80) return { text: "Excellent", color: "text-green-500", icon: ShieldCheck };
  if (score >= 60) return { text: "Good", color: "text-lime-500", icon: ShieldCheck };
  if (score >= 40) return { text: "Fair", color: "text-yellow-500", icon: ShieldQuestion };
  return { text: "Poor", color: "text-red-500", icon: ShieldAlert };
};

export default function HealthCheckPage() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [healthResult, setHealthResult] = useState<AssessPlantHealthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCapture = (dataUri: string) => {
    setImageDataUri(dataUri);
    setHealthResult(null);
  };

  const handleAssessHealth = async () => {
    if (!imageDataUri) {
      toast({ title: "No Image", description: "Please select an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setHealthResult(null);
    try {
      const result = await assessPlantHealth({ photoDataUri: imageDataUri });
      setHealthResult(result);
      toast({ title: "Health Assessment Complete", description: `Plant health score: ${result.healthScore}/100.` });
    } catch (error) {
      console.error("Error assessing plant health:", error);
      toast({ title: "Assessment Failed", description: "Could not assess plant health. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const healthStatus = healthResult ? getHealthStatus(healthResult.healthScore) : null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Plant Health Check</CardTitle>
          <CardDescription className="text-lg">
            Select an image of your rice plant, and our AI will provide an estimated health score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageCapture onCapture={handleCapture} label="Select Plant Image" />
          {imageDataUri && (
            <div className="text-center">
              <Button onClick={handleAssessHealth} disabled={isLoading} size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <HeartPulse className="mr-2 h-5 w-5" />}
                Assess Health
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && <LoadingSpinner message="Assessing plant health..." className="my-8" />}

      {healthResult && healthStatus && (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary-dark flex items-center gap-2">
              <Zap /> Health Score Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-6xl font-bold font-headline" style={{ color: healthStatus.color }}>
                {healthResult.healthScore}
                <span className="text-3xl text-muted-foreground">/100</span>
              </p>
              <div className={`flex items-center justify-center gap-2 text-2xl font-semibold ${healthStatus.color}`}>
                <healthStatus.icon className="h-7 w-7" />
                <span>{healthStatus.text}</span>
              </div>
            </div>
            
            <Progress value={healthResult.healthScore} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:via-yellow-500 [&>div]:to-green-500" />

            <div className={`p-4 border-l-4 rounded-md bg-opacity-10 ${
                healthResult.healthScore >= 80 ? 'border-green-500 bg-green-500' :
                healthResult.healthScore >= 60 ? 'border-lime-500 bg-lime-500' :
                healthResult.healthScore >= 40 ? 'border-yellow-500 bg-yellow-500' :
                'border-red-500 bg-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className={`h-5 w-5 ${healthStatus.color}`} />
                  <h4 className={`font-semibold ${healthStatus.color}`}>Note on Health Score</h4>
                </div>
              <p className="text-sm text-muted-foreground">
                This score is an AI-generated estimate based on the provided image. 
                {healthResult.healthScore < 60 ? 
                  " A lower score may indicate potential stress, nutrient deficiencies, or early signs of disease. Consider further investigation or consultation with an agricultural expert." :
                  " A higher score suggests good plant vitality. Continue to maintain optimal growing conditions and monitor your plants regularly."
                }
              </p>
            </div>
            {healthResult.healthScore < 70 && (
                <div className="p-3 bg-muted rounded-md text-center">
                    <p className="text-sm">
                        Consider using the <Button variant="link" asChild className="p-0 h-auto text-accent"><a href="/disease-detection">Disease Detection tool</a></Button> for a more specific analysis if you suspect any issues.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// src/app/(app)/rice-classification/page.tsx
"use client";

import { useState } from 'react';
import { ImageCapture } from '@/components/shared/ImageCapture';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { classifyRice, type ClassifyRiceOutput } from '@/ai/flows/classify-rice';
import { useToast } from '@/hooks/use-toast';
import { BarChart, ChefHat, Percent, Tag, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getCuisineIdeas } from '@/lib/data'; // CuisineIdea type no longer needed here
// Image import removed
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Label } from '@/components/ui/label';


export default function RiceClassificationPage() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassifyRiceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCapture = (dataUri: string) => {
    setImageDataUri(dataUri);
    setClassificationResult(null); // Reset previous results
  };

  const handleClassify = async () => {
    if (!imageDataUri) {
      toast({ title: "No Image", description: "Please select an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setClassificationResult(null);
    try {
      const result = await classifyRice({ photoDataUri: imageDataUri });
      setClassificationResult(result);
      toast({ title: "Classification Complete", description: `Rice classified as ${result.classification}.` });
    } catch (error) {
      console.error("Error classifying rice:", error);
      toast({ title: "Classification Failed", description: "Could not classify the rice image. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const currentCuisineIdeas = getCuisineIdeas(classificationResult?.classification);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Rice Grain Classification</CardTitle>
          <CardDescription className="text-lg">
            Select an image of rice grains, and our AI will classify them as long grain, short grain, or broken.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageCapture onCapture={handleCapture} label="Select Rice Image" />
          {imageDataUri && (
            <div className="text-center">
              <Button onClick={handleClassify} disabled={isLoading} size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <BarChart className="mr-2 h-5 w-5" />}
                Classify Rice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && <LoadingSpinner message="Analyzing rice grains..." className="my-8" />}

      {classificationResult && (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary-dark flex items-center gap-2">
              <Tag />Classification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <p className="text-xl font-semibold font-body">
                Type: <span className="text-accent font-bold capitalize">{classificationResult.classification}</span>
              </p>
              <div className="flex items-center gap-2">
                {classificationResult.classification === 'long grain' && <ThumbsUp className="h-6 w-6 text-green-500" />}
                {classificationResult.classification === 'short grain' && <ThumbsUp className="h-6 w-6 text-blue-500" />}
                {classificationResult.classification === 'broken' && <ThumbsDown className="h-6 w-6 text-red-500" />}
              </div>
            </div>
            
            <div>
              <Label htmlFor="confidence" className="text-sm font-medium flex items-center gap-1"><Percent /> Confidence Level</Label>
              <div className="flex items-center gap-2 mt-1">
                <Progress id="confidence" value={classificationResult.confidence * 100} className="w-full h-3" />
                <span className="text-sm font-semibold text-primary">{(classificationResult.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="p-4 border-l-4 border-accent bg-accent/10 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-accent" />
                <h4 className="font-semibold text-accent">Understanding Your Result</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                This classification is based on visual analysis by our AI model. {classificationResult.classification === 'broken' ? 'Broken grains can affect cooking properties and are often used differently.' : ` '${classificationResult.classification}' rice has distinct characteristics ideal for specific dishes.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {classificationResult && currentCuisineIdeas.length > 0 && (
         <Card className="shadow-lg animate-in fade-in-50 duration-700">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary-dark flex items-center gap-2">
              <ChefHat /> Cuisine Ideas for {classificationResult.classification} Rice
            </CardTitle>
             <CardDescription>
              Discover delicious dishes you can make with {classificationResult.classification} rice.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCuisineIdeas.map((idea, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {/* Image div removed */}
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{idea.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground font-body">{idea.description}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

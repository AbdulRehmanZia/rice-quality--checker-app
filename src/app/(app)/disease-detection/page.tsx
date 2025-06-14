// src/app/(app)/disease-detection/page.tsx
"use client";

import { useState } from 'react';
import { ImageCapture } from '@/components/shared/ImageCapture';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { detectPlantDisease, type DetectPlantDiseaseOutput } from '@/ai/flows/detect-plant-disease';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, ListChecks, Activity, HelpCircle, Pill } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { medicineInfo, getMedicineInfo, MedicineInfo } from '@/lib/data';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function DiseaseDetectionPage() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectPlantDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCapture = (dataUri: string) => {
    setImageDataUri(dataUri);
    setDetectionResult(null);
  };

  const handleDetect = async () => {
    if (!imageDataUri) {
      toast({ title: "No Image", description: "Please select an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setDetectionResult(null);
    try {
      const result = await detectPlantDisease({ photoDataUri: imageDataUri });
      setDetectionResult(result);
      if (result.diseaseDiagnosis.diseaseDetected) {
        toast({ title: "Disease Detection Complete", description: `Potential diseases identified. View details below.` });
      } else {
         toast({ title: "No Disease Detected", description: `The plant appears to be healthy based on the analysis.` });
      }
    } catch (error) {
      console.error("Error detecting disease:", error);
      toast({ title: "Detection Failed", description: "Could not analyze the plant image. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentMedicineInfo = getMedicineInfo(detectionResult?.diseaseDiagnosis.possibleDiseases);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Plant Disease Detection</CardTitle>
          <CardDescription className="text-lg">
            Select an image of a rice plant leaf, and our AI will help identify potential diseases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageCapture onCapture={handleCapture} label="Select Plant Image" />
          {imageDataUri && (
            <div className="text-center">
              <Button onClick={handleDetect} disabled={isLoading} size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <ShieldAlert className="mr-2 h-5 w-5" />}
                Detect Diseases
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && <LoadingSpinner message="Analyzing plant image..." className="my-8" />}

      {detectionResult && (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary-dark flex items-center gap-2">
              <ListChecks /> Diagnosis Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 rounded-lg ${detectionResult.diseaseDiagnosis.diseaseDetected ? 'bg-destructive/10 border-l-4 border-destructive' : 'bg-green-500/10 border-l-4 border-green-500'}`}>
              <p className="text-xl font-semibold font-body">
                Status: <span className={`font-bold ${detectionResult.diseaseDiagnosis.diseaseDetected ? 'text-destructive' : 'text-green-600'}`}>
                  {detectionResult.diseaseDiagnosis.diseaseDetected ? 'Disease Potentially Detected' : 'No Major Disease Detected'}
                </span>
              </p>
            </div>

            {detectionResult.diseaseDiagnosis.diseaseDetected && detectionResult.diseaseDiagnosis.possibleDiseases.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Activity />Possible Diseases:</h3>
                <ul className="space-y-2">
                  {detectionResult.diseaseDiagnosis.possibleDiseases.map((disease, index) => (
                    <li key={index} className="p-3 bg-secondary/50 rounded-md flex justify-between items-center">
                      <span className="font-medium">{disease}</span>
                      {detectionResult.diseaseDiagnosis.confidenceLevels && detectionResult.diseaseDiagnosis.confidenceLevels[index] && (
                        <Badge variant="outline" className="text-sm">
                          Confidence: {(detectionResult.diseaseDiagnosis.confidenceLevels[index] * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {detectionResult.diseaseDiagnosis.recommendations && (
               <div className="p-4 border-t border-border pt-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><HelpCircle />Recommendations:</h3>
                <p className="text-muted-foreground whitespace-pre-line">{detectionResult.diseaseDiagnosis.recommendations}</p>
              </div>
            )}
            
            {!detectionResult.diseaseDiagnosis.diseaseDetected && (
              <p className="text-green-700 font-medium">
                The plant appears healthy. Continue good agricultural practices and regular monitoring.
              </p>
            )}
          </CardContent>
        </Card>
      )}
      
      {detectionResult && detectionResult.diseaseDiagnosis.diseaseDetected && currentMedicineInfo.length > 0 && (
        <Card className="shadow-lg animate-in fade-in-50 duration-700">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary-dark flex items-center gap-2">
              <Pill /> Potential Treatment Information
            </CardTitle>
            <CardDescription>
              Below is some general information about products that might be used for the detected conditions. Always consult with an agricultural expert or local extension office before applying any treatment. This information is for educational purposes only and is not a specific prescription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {currentMedicineInfo.map((info, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                       <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 bg-muted">
                        <Image 
                          src={`https://placehold.co/100x100.png`} 
                          alt={info.name}
                          data-ai-hint={info.imageHint}
                          fill={true}
                          style={{objectFit: 'cover'}}
                        />
                       </div>
                       <div>
                        <h4 className="text-lg font-semibold text-left">{info.name}</h4>
                        <p className="text-sm text-muted-foreground text-left">Type: {info.type}</p>
                       </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-4 pt-2 pb-4 border-l-2 ml-[calc(1.5rem+8px)]"> {/* 1.5rem is approx width of icon container */}
                    <div>
                      <h5 className="font-semibold">Usage:</h5>
                      <p className="text-sm text-muted-foreground">{info.usage}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold">Precautions:</h5>
                      <p className="text-sm text-muted-foreground">{info.precautions}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

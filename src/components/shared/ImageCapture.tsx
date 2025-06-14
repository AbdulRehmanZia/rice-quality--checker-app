// src/components/shared/ImageCapture.tsx
"use client";

import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { UploadCloud, RefreshCcw, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';

interface ImageCaptureProps {
  onCapture: (dataUri: string) => void;
  label?: string;
}

export function ImageCapture({ onCapture, label = "Select Image" }: ImageCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        const errMessage = "Invalid file type. Please select an image (e.g., PNG, JPG).";
        setError(errMessage);
        toast({ title: "Upload Error", description: errMessage, variant: "destructive" });
        setSelectedImageDataUri(null);
        onCapture(""); 
        if(event.target) {
          event.target.value = ""; // Reset file input
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setSelectedImageDataUri(dataUri);
        onCapture(dataUri);
      };
      reader.onerror = () => {
        const errMessage = "Failed to read the image file.";
        setError(errMessage);
        toast({ title: "Upload Error", description: errMessage, variant: "destructive" });
        setSelectedImageDataUri(null);
        onCapture("");
      }
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again if user deselected then reselected, or after an error
    if(event.target) {
        event.target.value = "";
    }
  }, [onCapture, toast]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSelectAnother = () => {
    setSelectedImageDataUri(null);
    onCapture(""); 
    setError(null);
    triggerFileInput(); 
  };

  const clearSelection = () => {
    setSelectedImageDataUri(null);
    onCapture(""); 
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardContent className="p-4">
        {error && (
          <div className="p-3 mb-4 text-sm text-destructive-foreground bg-destructive rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload image"
        />
        <div
          className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={!selectedImageDataUri ? triggerFileInput : undefined}
          role="button"
          tabIndex={selectedImageDataUri ? -1 : 0}
          onKeyDown={(e) => { if (e.key === 'Enter' && !selectedImageDataUri) triggerFileInput()}}
          aria-label={selectedImageDataUri ? "Selected image preview" : "Click to upload an image"}
        >
          {selectedImageDataUri ? (
            <NextImage src={selectedImageDataUri} alt="Selected image" fill={true} style={{objectFit: 'contain'}} />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <ImageIcon className="h-16 w-16 mb-2 opacity-50" />
              <p className="font-medium">{label}</p>
              <p className="text-xs mt-1">Click here or use the button below</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 p-4">
        {!selectedImageDataUri ? (
          <Button onClick={triggerFileInput} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <UploadCloud className="mr-2 h-4 w-4" /> {label}
          </Button>
        ) : (
          <>
            <Button onClick={handleSelectAnother} variant="outline" className="w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" /> Select Another
            </Button>
            <Button onClick={clearSelection} variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-destructive">
              Clear Selection
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

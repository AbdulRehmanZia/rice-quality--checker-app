'use server';

/**
 * @fileOverview A plant disease detection AI agent.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 * - DetectPlantDiseaseInput - The input type for the detectPlantDisease function.
 * - DetectPlantDiseaseOutput - The return type for the detectPlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a rice plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPlantDiseaseInput = z.infer<typeof DetectPlantDiseaseInputSchema>;

const DetectPlantDiseaseOutputSchema = z.object({
  diseaseDiagnosis: z.object({
    diseaseDetected: z.boolean().describe('Whether or not a disease is detected.'),
    possibleDiseases: z.array(z.string()).describe('The possible diseases detected in the plant.'),
    confidenceLevels: z.array(z.number()).describe('The confidence levels for each possible disease.'),
    recommendations: z.string().describe('Recommendations for addressing the detected diseases.'),
  }),
});
export type DetectPlantDiseaseOutput = z.infer<typeof DetectPlantDiseaseOutputSchema>;

export async function detectPlantDisease(input: DetectPlantDiseaseInput): Promise<DetectPlantDiseaseOutput> {
  return detectPlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPlantDiseasePrompt',
  input: {schema: DetectPlantDiseaseInputSchema},
  output: {schema: DetectPlantDiseaseOutputSchema},
  prompt: `You are an expert in diagnosing rice plant diseases. Analyze the provided image and determine if any diseases are present.

  Based on the image, identify the possible diseases, provide confidence levels for each, and give recommendations for addressing them.

  Photo: {{media url=photoDataUri}}

  Output should be in JSON format.
`,
});

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
    inputSchema: DetectPlantDiseaseInputSchema,
    outputSchema: DetectPlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

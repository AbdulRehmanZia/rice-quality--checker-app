'use server';

/**
 * @fileOverview Provides a plant health score based on an image of a rice plant.
 *
 * - assessPlantHealth - A function that returns a plant health score.
 * - AssessPlantHealthInput - The input type for the assessPlantHealth function.
 * - AssessPlantHealthOutput - The return type for the assessPlantHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessPlantHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a rice plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AssessPlantHealthInput = z.infer<typeof AssessPlantHealthInputSchema>;

const AssessPlantHealthOutputSchema = z.object({
  healthScore: z
    .number()
    .describe('A number between 0 and 100 representing the health of the plant.'),
});
export type AssessPlantHealthOutput = z.infer<typeof AssessPlantHealthOutputSchema>;

export async function assessPlantHealth(input: AssessPlantHealthInput): Promise<AssessPlantHealthOutput> {
  return assessPlantHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessPlantHealthPrompt',
  input: {schema: AssessPlantHealthInputSchema},
  output: {schema: AssessPlantHealthOutputSchema},
  prompt: `You are an expert in rice plant health assessment.

  Based on the image of the rice plant provided, assess its overall health.
  Provide a health score between 0 and 100, where 0 indicates a completely unhealthy plant and 100 indicates a perfectly healthy plant.

  Image: {{media url=photoDataUri}}`,
});

const assessPlantHealthFlow = ai.defineFlow(
  {
    name: 'assessPlantHealthFlow',
    inputSchema: AssessPlantHealthInputSchema,
    outputSchema: AssessPlantHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

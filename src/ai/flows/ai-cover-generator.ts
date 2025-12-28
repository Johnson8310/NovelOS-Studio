'use server';

/**
 * @fileOverview An AI-powered book cover generator.
 *
 * - generateCover - A function that generates a book cover image from a text prompt.
 * - AICoverGeneratorInput - The input type for the generateCover function.
 * - AICoverGeneratorOutput - The return type for the generateCover function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AICoverGeneratorInputSchema = z.object({
  prompt: z
    .string()
    .describe('A detailed prompt to generate a book cover image.'),
});
export type AICoverGeneratorInput = z.infer<typeof AICoverGeneratorInputSchema>;

const AICoverGeneratorOutputSchema = z.object({
  coverImageUri: z
    .string()
    .describe('The generated book cover image as a data URI.'),
});
export type AICoverGeneratorOutput = z.infer<
  typeof AICoverGeneratorOutputSchema
>;

export async function generateCover(
  input: AICoverGeneratorInput
): Promise<AICoverGeneratorOutput> {
  return aiCoverGeneratorFlow(input);
}

const aiCoverGeneratorFlow = ai.defineFlow(
  {
    name: 'aiCoverGeneratorFlow',
    inputSchema: AICoverGeneratorInputSchema,
    outputSchema: AICoverGeneratorOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A professional, high-quality book cover for a novel with the following description: ${input.prompt}. The cover should be visually appealing, with no text.`,
    });
    
    if (!media.url) {
      throw new Error('Image generation failed to produce a URL.');
    }

    return { coverImageUri: media.url };
  }
);

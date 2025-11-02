'use server';

/**
 * @fileOverview An AI prompt generator flow.
 *
 * - generatePrompt - A function that generates a writing prompt.
 * - AIPromptGeneratorInput - The input type for the generatePrompt function.
 * - AIPromptGeneratorOutput - The return type for the generatePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPromptGeneratorInputSchema = z.object({
  genre: z.string().describe('The genre of the novel.'),
  theme: z.string().describe('The theme of the novel.'),
  keywords: z.string().describe('Keywords related to the novel.'),
});
export type AIPromptGeneratorInput = z.infer<typeof AIPromptGeneratorInputSchema>;

const AIPromptGeneratorOutputSchema = z.object({
  prompt: z.string().describe('A writing prompt to spark new ideas.'),
});
export type AIPromptGeneratorOutput = z.infer<typeof AIPromptGeneratorOutputSchema>;

export async function generatePrompt(input: AIPromptGeneratorInput): Promise<AIPromptGeneratorOutput> {
  return aiPromptGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPromptGeneratorPrompt',
  input: {schema: AIPromptGeneratorInputSchema},
  output: {schema: AIPromptGeneratorOutputSchema},
  prompt: `You are a creative writing assistant. Generate a writing prompt for a novel based on the following information:

Genre: {{{genre}}}
Theme: {{{theme}}}
Keywords: {{{keywords}}}

Prompt:`, // Removed exampleOutput parameter.
});

const aiPromptGeneratorFlow = ai.defineFlow(
  {
    name: 'aiPromptGeneratorFlow',
    inputSchema: AIPromptGeneratorInputSchema,
    outputSchema: AIPromptGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

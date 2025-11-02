'use server';

/**
 * @fileOverview Implements an AI-powered grammar and style check flow.
 *
 * - aiGrammarCheck - A function that performs grammar and style checking on the input text.
 * - AiGrammarCheckInput - The input type for the aiGrammarCheck function.
 * - AiGrammarCheckOutput - The return type for the aiGrammarCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGrammarCheckInputSchema = z.object({
  text: z
    .string()
    .describe('The text to be checked for grammar and style.'),
});
export type AiGrammarCheckInput = z.infer<typeof AiGrammarCheckInputSchema>;

const AiGrammarCheckOutputSchema = z.object({
  correctedText: z
    .string()
    .describe('The grammar and style checked version of the input text.'),
});
export type AiGrammarCheckOutput = z.infer<typeof AiGrammarCheckOutputSchema>;

export async function aiGrammarCheck(input: AiGrammarCheckInput): Promise<AiGrammarCheckOutput> {
  return aiGrammarCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGrammarCheckPrompt',
  input: {schema: AiGrammarCheckInputSchema},
  output: {schema: AiGrammarCheckOutputSchema},
  prompt: `You are a meticulous grammar and style editor. Review the following text and correct any grammar, spelling, punctuation, or style errors. Return the corrected text. Do not add any additional text or explanations.

Text: {{{text}}}`,
});

const aiGrammarCheckFlow = ai.defineFlow(
  {
    name: 'aiGrammarCheckFlow',
    inputSchema: AiGrammarCheckInputSchema,
    outputSchema: AiGrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

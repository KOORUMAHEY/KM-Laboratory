'use server';

/**
 * @fileOverview A code suggestion AI agent based on lab status.
 *
 * - suggestCodeSnippets - A function that handles the code suggestion process.
 * - SuggestCodeSnippetsInput - The input type for the suggestCodeSnippets function.
 * - SuggestCodeSnippetsOutput - The return type for the suggestCodeSnippets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeSnippetsInputSchema = z.object({
  labStatus: z.string().describe('The current status of the lab.'),
  relevantCodes: z.string().optional().describe('The codes available for the lab.'),
});
export type SuggestCodeSnippetsInput = z.infer<typeof SuggestCodeSnippetsInputSchema>;

const SuggestCodeSnippetsOutputSchema = z.object({
  suggestedCode: z.string().describe('The suggested code snippet based on the lab status.'),
  reasoning: z.string().describe('The reasoning behind the code suggestion.'),
  isRelevant: z.boolean().describe('Whether the suggested code is relevant to the lab status.'),
});
export type SuggestCodeSnippetsOutput = z.infer<typeof SuggestCodeSnippetsOutputSchema>;

export async function suggestCodeSnippets(input: SuggestCodeSnippetsInput): Promise<SuggestCodeSnippetsOutput> {
  return suggestCodeSnippetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeSnippetsPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: SuggestCodeSnippetsInputSchema},
  output: {schema: SuggestCodeSnippetsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant code snippets based on the current lab status.

  Here is the current lab status:
  {{labStatus}}

  You have access to the following existing codes:
  {{relevantCodes}}

  Based on the lab status, suggest a code snippet that could be helpful. Explain your reasoning for the suggestion and determine if the suggestion is relevant.
  Include the properties suggestedCode, reasoning, and isRelevant in the output.
  If no relevant codes are available, return a message indicating that no suitable code snippet could be found.
  `,
});

const suggestCodeSnippetsFlow = ai.defineFlow(
  {
    name: 'suggestCodeSnippetsFlow',
    inputSchema: SuggestCodeSnippetsInputSchema,
    outputSchema: SuggestCodeSnippetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

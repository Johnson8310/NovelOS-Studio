import { config } from 'dotenv';
config({ path: '.env.local' });

import '@/ai/flows/ai-grammar-check.ts';
import '@/ai/flows/ai-prompt-generator.ts';
import '@/ai/flows/ai-cover-generator.ts';

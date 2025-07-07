import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN);

export const generateContent = async (section: string, input: string) => {
  // ... existing code ...
} 
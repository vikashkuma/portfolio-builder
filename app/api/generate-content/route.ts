import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_TOKEN);

// REMOVED: Section-specific prompt templates moved from client-side
// const prompts: Record<string, (input: string) => string> = { ... };

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json(); // Expect the full prompt directly

    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiContent = chatCompletion.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content: aiContent }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: "Failed to generate AI content." }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
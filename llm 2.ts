import { OpenAI } from "openai";
import { decryptValue } from "./encryption";

/**
 * Create an OpenAI client with user's API credentials
 */
export function createLLMClient(
  encryptedApiKey: string,
  baseUrl: string = "https://api.openai.com/v1"
) {
  const apiKey = decryptValue(encryptedApiKey);
  return new OpenAI({
    apiKey,
    baseURL: baseUrl,
  });
}

/**
 * Generate code using the LLM
 */
export async function generateCode(
  client: OpenAI,
  prompt: string,
  context?: string,
  model: string = "gpt-4o"
) {
  const messages: { role: "system" | "user"; content: string }[] = [
    {
      role: "system",
      content:
        "You are an expert code generation assistant. Generate clean, well-documented, and production-ready code. Always include comments explaining the logic.",
    },
  ];

  if (context) {
    messages.push({
      role: "user",
      content: `Context:\n\`\`\`\n${context}\n\`\`\`\n\nRequest: ${prompt}`,
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.choices[0]?.message.content ?? "";
}

/**
 * Generate code with streaming support
 */
export async function generateCodeStream(
  client: OpenAI,
  prompt: string,
  context?: string,
  model: string = "gpt-4o"
) {
  const messages: { role: "system" | "user"; content: string }[] = [
    {
      role: "system",
      content:
        "You are an expert code generation assistant. Generate clean, well-documented, and production-ready code. Always include comments explaining the logic.",
    },
  ];

  if (context) {
    messages.push({
      role: "user",
      content: `Context:\n\`\`\`\n${context}\n\`\`\`\n\nRequest: ${prompt}`,
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  return client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
  });
}

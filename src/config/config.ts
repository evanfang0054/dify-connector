import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define the configuration schema using Zod for validation
const DifyConfigSchema = z.object({
  apiBaseUrl: z.string().url().default('https://api.dify.ai/v1'),
  apiKey: z.string().min(1, 'API key is required'),
});

// Define the configuration type
export type DifyConfig = z.infer<typeof DifyConfigSchema>;

/**
 * Get the Dify configuration from environment variables
 * @returns The validated Dify configuration
 * @throws {z.ZodError} If the configuration is invalid
 */
export function getConfig(): DifyConfig {
  const config = {
    apiBaseUrl: process.env.API_BASE_URL,
    apiKey: process.env.API_KEY,
  };

  // Validate and return the configuration
  return DifyConfigSchema.parse(config);
}
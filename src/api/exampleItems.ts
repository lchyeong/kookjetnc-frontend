import { z } from 'zod';

import { http } from '@/api/http';
import type { ExampleItemsResponse } from '@/types/exampleItems';

const exampleItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  tag: z.string().min(1),
});

const exampleItemsResponseSchema = z.object({
  items: z.array(exampleItemSchema),
});

const toZodErrorMessage = (error: z.ZodError): string => {
  const issues = error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  return issues ? `\n${issues}` : '';
};

export const fetchExampleItems = async (): Promise<ExampleItemsResponse> => {
  const responseData = await http.get<unknown>('/example-items');
  const parsed = exampleItemsResponseSchema.safeParse(responseData);

  if (!parsed.success) {
    throw new Error(`[exampleItems] Invalid response.${toZodErrorMessage(parsed.error)}`);
  }

  return parsed.data;
};

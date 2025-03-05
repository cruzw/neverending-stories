import { z } from 'zod';

export const ChapterSchema = z.object({
  text: z.string(),
  title: z.string(),
  actions: z.array(z.string()),
  imagePrompt: z.string(),
});

'use server';

import {
  generateObject,
  experimental_generateImage as generateImage,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { put } from '@vercel/blob';
import { v7 as uuidv7 } from 'uuid';
import { redirect } from 'next/navigation';

import { ChapterSchema } from '@/schemas';
import { getFirstChapterPrompt } from '@/prompts';
import type { StoryForm } from '@/types';

export async function createFirstChapter({
  story,
  openAiKey,
}: {
  story: StoryForm;
  openAiKey: string;
}) {
  const openai = createOpenAI({
    apiKey: openAiKey,
  });

  console.log('Generating chapter object...');
  console.time('Generated chapter object.');
  const { object: generatedChapter } = await generateObject({
    model: openai('gpt-4o'),
    schema: ChapterSchema,
    prompt: getFirstChapterPrompt(story),
    output: 'object',
  });
  console.timeEnd('Generated chapter object.');

  console.log('Generating chapter image...');
  console.time('Generated chapter image.');
  const { image } = await generateImage({
    model: openai.image('dall-e-3'),
    prompt: generatedChapter.imagePrompt,
    size: '1024x1024',
    aspectRatio: '1:1',
    providerOptions: {
      openai: {
        // style: 'vivid',
        quality: 'standard',
      },
    },
  });
  console.timeEnd('Generated chapter image.');

  const imageBuffer = Buffer.from(image.base64, 'base64');
  const storyId = uuidv7();

  await Promise.all([
    // save story prompt
    put(
      `/prompts/${storyId}.json`,
      JSON.stringify({
        ...story,
        id: storyId,
      }),
      {
        access: 'public',
        addRandomSuffix: false,
      }
    ),
    // save chapter 1 text content
    put(
      `/stories/${storyId}/1/content.json`,
      JSON.stringify(generatedChapter),
      {
        access: 'public',
        addRandomSuffix: false,
      }
    ),
    // save chapter 1 image
    put(`/stories/${storyId}/1/scene.png`, imageBuffer, {
      access: 'public',
      addRandomSuffix: false,
    }),
  ]);

  redirect(`/stories/${storyId}/1`);
}

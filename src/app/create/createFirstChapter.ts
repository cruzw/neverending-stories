'use server';

import {
  generateObject,
  experimental_generateImage as generateImage,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { put } from '@vercel/blob';

import type { StoryForm } from '@/types';
import { redirect } from 'next/navigation';

const ChapterSchema = z.object({
  text: z.string(),
  title: z.string(),
  actions: z.array(z.string()),
  imagePrompt: z.string(),
});

const getPrompt = ({
  character,
  plot,
  environment,
  imageStyle,
}: StoryForm) => `# Task
We're starting a choose-your-adventure style story. The user has given us: character(s), plot, environment. We must create an engaging story, chapter by chapter, for the user to progress through. Try to find the right balance between moving the plot forward but not so fast that it feels forced.

# Output
Your response will include the following:

*text**: This is the story text the user will read. It should capture some meaningful plot progression. It should roughly be 2-5 paragraphs - short enough to be a quick read, but impactful enough to move the plot forward.

**title**: This is the title of the chapter. It should be a single short sentence that captures the essence of the chapter.

**actions**: 4 actions that the user can take to drive the narrative forward. They should be roughly 3-8 words each, and be significantly different from each other.

**imagePrompt**: This is a prompt for a separate image-generation LLM to create an accompanying visual for the current chapter we're currently generating. Be overly descriptive so that we can bring the current chapter to life.

**# The Story
We've collected character(s), plot, and environment from the user to start this story.

## Character(s)
${character}

## Plot
${plot}

## Environment
${environment}

# Image style
We've collected the user's preferred image style to assist in **imagePrompt** generation. Make sure to use this style in the image generation. Make sure to specify that the image should take up the entire canvas.

## User's preferred image style
${imageStyle}.
`;

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
    prompt: getPrompt(story),
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

  // TODO: parallelize these requests

  await put(
    `/prompts/${storyId}.json`,
    JSON.stringify({
      ...story,
      id: storyId,
    }),
    {
      access: 'public',
      addRandomSuffix: false,
    }
  );

  await put(
    `/stories/${storyId}/1/content.json`,
    JSON.stringify(generatedChapter),
    {
      access: 'public',
      addRandomSuffix: false,
    }
  );

  await put(`/stories/${storyId}/1/scene.png`, imageBuffer, {
    access: 'public',
    addRandomSuffix: false,
  });

  redirect(`/stories/${storyId}/1`);
}

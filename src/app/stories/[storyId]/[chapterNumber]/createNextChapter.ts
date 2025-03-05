'use server';

import {
  generateObject,
  experimental_generateImage as generateImage,
} from 'ai';
import type { Chapter, StoryForm } from '@/types';
import { createOpenAI } from '@ai-sdk/openai';
import { cookies } from 'next/headers';
import { BLOB_BASE_URL } from '@/constants';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export type NextChapterState = {
  status: 'ERROR';
  message: string;
};

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
  previousText,
  actionText,
}: StoryForm & { previousText: string[]; actionText: string }) => `# Task
We're continuing a choose-your-adventure style story. The user has given us: character(s), plot, environment. We must continue creating an engaging story, chapter by chapter, for the user to progress through. Try to find the right balance between moving the plot forward but not so fast that it feels forced.

# Output
Your response will include the following:

*text**: This is the story text the user will read. It should capture some meaningful plot progression. It should roughly be 2-5 paragraphs - short enough to be a quick read, but impactful enough to move the plot forward. This should just be the chapter's contents, do not prefix it with a title, i.e. "## Chapter 2".

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

# Previous Chapters (The story so far)
${previousText
  .map((text, index) => `## Chapter ${index + 1}: ${text}`)
  .join('\n')}

# Next Action
The user has chosen to take the following action to progress the story: ${actionText}
`;

export async function createNextChapter({
  storyId,
  chapterNumber,
  actionText,
}: {
  storyId: string;
  chapterNumber: number;
  actionText: string;
}) {
  const nextChapterNumber = chapterNumber + 1;

  try {
    const cookieStore = await cookies();
    const openAiKey = cookieStore.get('openai_key');

    if (!openAiKey || typeof openAiKey.value !== 'string') {
      throw new Error('No OpenAI key found');
    }

    // Fetch the current chapter
    const currentChapter = await fetch(
      `${BLOB_BASE_URL}/stories/${storyId}/${chapterNumber}/content.json`
    );
    const currentChapterJson: Chapter = await currentChapter.json();

    // Fetch the original prompt
    const originalPrompt = await fetch(
      `${BLOB_BASE_URL}/prompts/${storyId}.json`
    );
    const originalPromptJson: StoryForm = await originalPrompt.json();


    const previousChaptersText = [
      ...(currentChapterJson.previousText || []),
      currentChapterJson.text,
    ].slice(-20);

    const openai = createOpenAI({
      apiKey: openAiKey.value,
    });

    console.log('Generating chapter object...');
    console.time('Generated chapter object.');
    const { object: generatedChapter } = await generateObject({
      model: openai('gpt-4o'),
      schema: ChapterSchema,
      prompt: getPrompt({
        ...originalPromptJson,
        previousText: previousChaptersText,
        actionText,
      }),
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

    // TODO: parallelize these requests

    await put(
      `/stories/${storyId}/${nextChapterNumber}/content.json`,
      JSON.stringify(generatedChapter),
      {
        access: 'public',
        addRandomSuffix: false,
      }
    );

    await put(
      `/stories/${storyId}/${nextChapterNumber}/scene.png`,
      imageBuffer,
      {
        access: 'public',
        addRandomSuffix: false,
      }
    );

  } catch (error) {
    console.error(error);
    return {
      status: 'ERROR',
      message: 'An error occurred',
    };
  }

  // purge cached data for existing page
  revalidatePath(`/stories/${storyId}/${chapterNumber}`);

  redirect(`/stories/${storyId}/${nextChapterNumber}`);
}

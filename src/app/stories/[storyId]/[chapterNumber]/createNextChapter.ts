'use server';

import {
  generateObject,
  experimental_generateImage as generateImage,
} from 'ai';
import type { Chapter, StoryForm } from '@/types';
import { createOpenAI } from '@ai-sdk/openai';
import { cookies } from 'next/headers';
import { BLOB_BASE_URL } from '@/constants';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { ChapterSchema } from '@/schemas';
import { getNextChapterPrompt } from '@/prompts';

export type NextChapterState = {
  status: 'ERROR';
  message: string;
};

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
      prompt: getNextChapterPrompt({
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

    await Promise.all([
      put(
        `/stories/${storyId}/${nextChapterNumber}/content.json`,
        JSON.stringify(generatedChapter),
        {
          access: 'public',
          addRandomSuffix: false,
        }
      ),
      put(`/stories/${storyId}/${nextChapterNumber}/scene.png`, imageBuffer, {
        access: 'public',
        addRandomSuffix: false,
      }),
    ]);
  } catch (error) {
    console.error(error);
    return {
      status: 'ERROR',
      message: 'An error occurred',
    };
  }

  redirect(`/stories/${storyId}/${nextChapterNumber}`);
}

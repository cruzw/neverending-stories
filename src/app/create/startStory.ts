'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createFirstChapter } from './createFirstChapter';

import type { StoryForm } from '@/types';

export type StoryFormState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fields: StoryForm;
};

export async function startStory(
  _prevState: StoryFormState,
  formData: FormData
): Promise<StoryFormState> {
  const cookieStore = await cookies();
  const openAiKey = cookieStore.get('openai_key');

  if (!openAiKey) {
    redirect('/account');
  }

  const character = formData.get('character')?.toString() || '';
  const plot = formData.get('plot')?.toString() || '';
  const environment = formData.get('environment')?.toString() || '';
  const imageStyle = formData.get('imageStyle')?.toString() || '';

  // Create fields object to preserve user input regardless of outcome
  const fields = {
    character,
    plot,
    environment,
    imageStyle,
  };

  // Validate all required fields
  if (!character || character.trim() === '') {
    return {
      status: 'error',
      message: 'Character field is required',
      fields,
    };
  }

  if (!plot || plot.trim() === '') {
    return {
      status: 'error',
      message: 'Plot field is required',
      fields,
    };
  }

  if (!environment || environment.trim() === '') {
    return {
      status: 'error',
      message: 'Environment field is required',
      fields,
    };
  }

  if (!imageStyle || imageStyle.trim() === '') {
    return {
      status: 'error',
      message: 'Image style field is required',
      fields,
    };
  }

  await createFirstChapter({
    story: fields,
    openAiKey: openAiKey.value,
  });

  return {
    status: 'success',
    message: 'Story created successfully',
    fields,
  };
}

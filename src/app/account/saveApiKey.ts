'use server';

import { cookies } from 'next/headers';

const OPENAI_API_URL = 'https://api.openai.com/v1/models';

export type ApiKeyState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
  apiKey?: string;
};

export async function saveApiKey(
  _prevState: ApiKeyState,
  formData: FormData
): Promise<ApiKeyState> {
  const apiKey = formData.get('openai_key')?.toString() || '';

  // handle empty key
  if (!apiKey.trim()) {
    return {
      status: 'error',
      message: 'Please enter an OpenAI API key',
      apiKey
    };
  }

  // test key given by requesting available models
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: 'Invalid API key.',
        apiKey
      };
    }

    // if valid key, set cookie
    const cookieStore = await cookies();
    cookieStore.set('openai_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return {
      status: 'success',
      message: 'API key saved successfully',
      apiKey,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      apiKey
    };
  }
}

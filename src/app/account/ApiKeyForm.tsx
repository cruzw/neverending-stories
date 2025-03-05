'use client';

import { useActionState } from 'react';
import { saveApiKey, type ApiKeyState } from './saveApiKey';
import Link from 'next/link';

type ApiKeyFormProps = {
  initialApiKey?: string;
};

export default function ApiKeyForm({ initialApiKey }: ApiKeyFormProps) {
  const initialState: ApiKeyState = {
    status: 'idle',
    apiKey: initialApiKey || '',
  };

  const [state, formAction, pending] = useActionState<ApiKeyState, FormData>(
    saveApiKey,
    initialState
  );

  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';

  const currentApiKey =
    state.apiKey !== undefined ? state.apiKey : initialApiKey || '';

  return (
    <form action={formAction}>
      <div className="nes-field mb-8">
        <label htmlFor="openai_key">OpenAI API Key</label>
        <input
          defaultValue={currentApiKey}
          type="text"
          id="openai_key"
          className="nes-input"
          name="openai_key"
          disabled={pending}
        />
      </div>

      {isError && (
        <div className="text-red-500 text-sm mb-4">{state.message || "An error occurred"}</div>
      )}

      {isSuccess && (
        <div className="text-green-500 text-sm mb-4">{state.message}</div>
      )}

      {isSuccess ? (
        <Link href="/create" className="nes-btn is-success">
          Create Story
        </Link>
      ) : (
        <button
          type="submit"
          className="nes-btn is-primary w-full"
          disabled={pending}
        >
          {pending ? 'Saving...' : 'Save'}
        </button>
      )}
    </form>
  );
}

'use client';
import { useState } from 'react';

import { createNextChapter } from './createNextChapter';
import { Chapter } from '@/types';

type ChapterActionFormsProps = {
  chapter: Chapter;
  storyId: string;
  chapterNumber: number;
};

type FormState =
  | {
      status: 'IDLE';
    }
  | {
      status: 'PENDING';
    }
  | {
      status: 'ERROR';
      message: string;
    };

export default function ChapterActionForms({
  chapter,
  storyId,
  chapterNumber,
}: ChapterActionFormsProps) {
  const [actionState, setActionState] = useState<FormState>({ status: 'IDLE' });

  async function handleAction(actionText: string) {
    setActionState({ status: 'PENDING' });
    const { status, message } = await createNextChapter({
      storyId,
      chapterNumber,
      actionText,
    });

    if (status === 'ERROR') {
      setActionState({
        status: 'ERROR',
        message: message || 'An error occurred',
      });
    } else {
      setActionState({ status: 'IDLE' });
    }
  }

  const isPending = actionState.status === 'PENDING';

  return (
    <>
      <h3 className="text-lg text-center">What&apos;s next?</h3>
      {isPending ? (
        <div className="nes-container is-rounded is-dark is-centered">
          <p>Loading...</p>
          <p>new chapters can take up to 1 minute to generate.</p>
        </div>
      ) : (
        chapter.actions.map((actionText, index) => (
          <button
            key={`${actionText}-${index}`}
            className="nes-btn is-primary"
            disabled={isPending}
            onClick={() => handleAction(actionText)}
          >
            {actionText}
          </button>
        ))
      )}
    </>
  );
}

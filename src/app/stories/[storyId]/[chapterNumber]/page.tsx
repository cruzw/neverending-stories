import Image from 'next/image';

import type { Chapter } from '@/types';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { BLOB_BASE_URL } from '@/constants';
import ChapterActionForms from './ChapterActionForms';

type ChapterPageProps = {
  params: Promise<{
    storyId: string;
    chapterNumber: string;
  }>;
};

function getStoryUrls(storyId: string, chapterNumber: number) {
  return {
    contentUrl: `${BLOB_BASE_URL}/stories/${storyId}/${chapterNumber}/content.json`,
    sceneUrl: `${BLOB_BASE_URL}/stories/${storyId}/${chapterNumber}/scene.png`,
  };
}

async function checkifNextChapterExists(
  storyId: string,
  chapterNumber: number
) {
  const nextChapterNumber = chapterNumber + 1;
  const nextChapterUrl = `${BLOB_BASE_URL}/stories/${storyId}/${nextChapterNumber}/content.json`;
  const nextChapterRes = await fetch(nextChapterUrl);
  return nextChapterRes.ok;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const cookieStore = await cookies();
  const openAiKey = cookieStore.get('openai_key');

  const { storyId, chapterNumber: chapterNumberString } = await params;
  const chapterNumber = parseInt(chapterNumberString);

  const { contentUrl, sceneUrl } = getStoryUrls(storyId, chapterNumber);

  const [chapter, nextChapterExists] = await Promise.all([
    fetch(contentUrl).then(res => res.json() as Promise<Chapter>),
    checkifNextChapterExists(storyId, chapterNumber)
  ]);

  const previousChapterExists = chapterNumber > 1;

  const showTopNav = nextChapterExists || previousChapterExists;

  return (
    <div>
      {showTopNav && (
        <div className="flex flex-col gap-4 mb-8">
          {nextChapterExists && (
            <Link
              className="nes-btn is-success"
              href={`/stories/${storyId}/${chapterNumber + 1}`}
            >
              Next Chapter
            </Link>
          )}
          {chapterNumber > 1 && (
            <Link
              className="nes-btn is-warning"
              href={`/stories/${storyId}/${chapterNumber - 1}`}
            >
              Previous Chapter
            </Link>
          )}
        </div>
      )}
      <Image
        src={sceneUrl}
        alt={chapter.imagePrompt}
        width={1024}
        height={1792}
        className="w-full mb-12"
        priority
      />
      <h1 className="text-lg font-bold">Chapter {chapterNumber}</h1>
      <h2 className="text-2xl font-bold ">{chapter.title}</h2>
      <div className="font-sans mt-8">
        {chapter.text.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-8">
        {!nextChapterExists ? (
          openAiKey ? (
            <ChapterActionForms
              storyId={storyId}
              chapterNumber={chapterNumber}
              chapter={chapter}
            />
          ) : (
            <Link href="/account" className="nes-btn is-primary">
              Add a Token to Continue
            </Link>
          )
        ) : null}
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <Link href="/" className="nes-btn">
          Home
        </Link>
      </div>
    </div>
  );
}

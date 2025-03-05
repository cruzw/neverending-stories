'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
  const { storyId, chapterNumber: chapterNumberString } = useParams();

  const hasStoryId = typeof storyId === 'string';

  const chapterNumber = Number(chapterNumberString);

  const showPreviousChapterLink =
    typeof chapterNumberString === 'string' &&
    !isNaN(chapterNumber) &&
    chapterNumber > 1;

  return (
    <div className="nes-container is-centered">
      <h1 className="mb-4!">Page Not Found</h1>
      <div className="flex flex-col gap-4">
        {showPreviousChapterLink && (
          <Link
            href={`/stories/${storyId}/${chapterNumber - 1}`}
            className="nes-btn is-primary"
          >
            Previous Chapter
          </Link>
        )}
        {hasStoryId && (
          <Link href={`/stories/${storyId}/1`} className="nes-btn is-primary">
            First Chapter
          </Link>
        )}
        <Link href="/" className="nes-btn">
          Home
        </Link>
      </div>
    </div>
  );
}

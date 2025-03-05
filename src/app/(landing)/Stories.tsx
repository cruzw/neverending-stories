import type { ReactNode } from 'react';
import { list } from '@vercel/blob';
import Link from 'next/link';
import Image from 'next/image';

import { BLOB_BASE_URL } from '@/constants';

export default async function Stories() {
  const { blobs } = await list({
    prefix: 'prompts/',
  });

  const storyImagePreviews = blobs.reduceRight((acc, blob) => {
    const storyId = blob.pathname.split('/')[1].replace('.json', '');
    const previewUrl = `${BLOB_BASE_URL}/stories/${storyId}/1/scene.png`;
    const storyPath = `/stories/${storyId}/1`;

    acc.push(
      <Link href={storyPath} key={storyId} className="flex justify-center">
        <Image
          // TODO: find a way pass in meaningful alt text
          alt="Story Preview Image"
          className="rounded-lg hover:opacity-80 transition-opacity"
          src={previewUrl}
          width={200}
          height={200}
        />
      </Link>
    );
    return acc;
  }, [] as ReactNode[]);

  return (
    <div className="nes-container with-title is-centered bg-white mb-4">
      <p className="title">Recent Stories</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {storyImagePreviews}
      </div>
    </div>
  );
}

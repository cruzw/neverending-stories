import Link from 'next/link';
import { cookies } from 'next/headers';
import Stories from './Stories';

export default async function Home() {
  const cookieStore = await cookies();
  const openAiKey = cookieStore.get('openai_key');

  return (
    <>
      <div className="nes-container is-centered bg-white mb-4">
        <h2 className="text-base sm:text-2xl lg:text-3xl font-bold mb-12">
          Neverending <br /> Stories
        </h2>
        <h3 className="text-sm sm:text-base italic">
          Choose-Your-Own-Adventure
        </h3>
        <div className="flex flex-col gap-4 mt-8">
          {openAiKey && (
            <Link href="/create" className="nes-btn is-primary">
              Create Story
            </Link>
          )}
          <Link href="/account" className="nes-btn">
            {openAiKey ? 'Manage Token' : 'Get Started'}
          </Link>
        </div>
      </div>
      <Stories />
      <a
        href="https://github.com/cruzw/neverending-stories"
        target="_blank"
        rel="noopener"
        aria-label="github"
        className="flex justify-center"
      >
        <i className="nes-icon github is-large" />
      </a>
    </>
  );
}

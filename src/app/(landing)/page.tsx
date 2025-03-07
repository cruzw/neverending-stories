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
        href="https://www.producthunt.com/posts/neverending-stories?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-neverending&#0045;stories"
        target="_blank"
        className="flex justify-center mt-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=939212&theme=light&t=1741327972853"
          alt="Neverending&#0032;Stories - AI&#0045;generated&#0032;choose&#0045;your&#0045;own&#0045;adventure&#0032;stories&#0046; | Product Hunt"
          style={{ width: '250px', height: '54px' }}
          width="250"
          height="54"
        />
      </a>
      <a
        href="https://github.com/cruzw/neverending-stories"
        target="_blank"
        rel="noopener"
        aria-label="github"
        className="flex justify-center"
      >
        <i className="nes-icon github is-large mt-4" />
      </a>
    </>
  );
}

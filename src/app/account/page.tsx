import { cookies } from 'next/headers';
import ApiKeyForm from './ApiKeyForm';

export default async function Account() {
  const cookieStore = await cookies();
  const openAiKey = cookieStore.get('openai_key');

  return (
    <>
      <div className="nes-container is-centered bg-white mb-4">
        <h2 className="text-base sm:text-2xl lg:text-3xl font-bold mb-12">
          Neverending <br /> Stories
        </h2>
        <p className="text-sm sm:text-base mb-24 italic">
          Your API key is set as a cookie <u>within your browser only</u> and is
          used to generate stories as you interact with the site.
        </p>
      </div>
      <div className="nes-container is-centered bg-white mb-4">
        <ApiKeyForm initialApiKey={openAiKey?.value} />
      </div>
    </>
  );
}

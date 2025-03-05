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
        <p className="text-sm sm:text-base mb-24 italic font-sans">
          Your API key is set as a cookie <u>within your browser only</u> and is
          used to generate each chapter as you interact with the story.
        </p>
        <p className="text-sm sm:text-base mb-24 italic font-sans">
          Each chapter makes 2 requests to OpenAI: one for the text (using <i>gpt-4o</i>) and one for the image (using <i>dall-e-3</i>). The total cost per chapter varies based on the size of your prompt and the story&apos;s progression. Each chapter typically costs between <b>$0.06-$0.20</b>. DALL-E 3 charges a flat $0.04 per image, while gpt-4o pricing depends on the prompt length and complexity.
        </p>
      </div>
      <div className="nes-container is-centered bg-white mb-4">
        <ApiKeyForm initialApiKey={openAiKey?.value} />
      </div>
    </>
  );
}

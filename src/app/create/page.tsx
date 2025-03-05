import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StoryForm from './StoryForm';

export default async function CreatePage() {
  // Check if the user has an API key set
  const cookieStore = await cookies();
  const openAiKey = cookieStore.get('openai_key');

  // Redirect to account page if no API key is found
  if (!openAiKey) {
    redirect('/account');
  }

  return (
    <>
      <div className="nes-container is-centered bg-white mb-4">
        <h2 className="text-base sm:text-2xl lg:text-3xl font-bold mb-12">
          Neverending <br /> Stories
        </h2>
        <p className="text-sm sm:text-base mb-24 italic">
          Create a new story with AI by describing the characters, plot, and setting.
        </p>
      </div>
      <StoryForm />
    </>
  );
}

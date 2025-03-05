'use client';

import { useActionState } from 'react';
import { startStory, type StoryFormState } from './startStory';

const defaultFields = {
  character: '',
  plot: '',
  environment: '',
  imageStyle: '',
};

const initialState: StoryFormState = {
  status: 'idle',
  fields: defaultFields,
};

export default function StoryForm() {
  const [state, formAction, pending] = useActionState<StoryFormState, FormData>(
    startStory,
    initialState
  );

  const isError = state.status === 'error';
  const fields = state.fields || defaultFields;

  return (
    <form
      action={formAction}
      className="nes-container is-centered bg-white mb-4"
    >
      <div className="nes-field mb-8">
        <label htmlFor="character">Character(s)</label>
        <textarea
          id="character"
          name="character"
          className="nes-textarea"
          placeholder="A knight in shining armor..."
          rows={3}
          disabled={pending}
          defaultValue={fields.character}
        />
      </div>
      <div className="nes-field mb-8">
        <label htmlFor="plot">Plot</label>
        <textarea
          id="plot"
          name="plot"
          className="nes-textarea"
          placeholder="He must rescue the princess from the dragon..."
          rows={3}
          disabled={pending}
          defaultValue={fields.plot}
        />
      </div>
      <div className="nes-field mb-8">
        <label htmlFor="environment">Environment</label>
        <textarea
          id="environment"
          name="environment"
          className="nes-textarea"
          placeholder="The dark ages, medieval europe..."
          rows={3}
          disabled={pending}
          defaultValue={fields.environment}
        />
      </div>
      <div className="nes-field mb-8">
        <label htmlFor="imageStyle">Image Style</label>
        <textarea
          id="imageStyle"
          name="imageStyle"
          className="nes-textarea"
          placeholder="watercolor painting"
          rows={1}
          disabled={pending}
          defaultValue={fields.imageStyle}
        />
      </div>
      {isError && (
          <div className="text-red-500 text-sm mb-4">{state.message || "An error occurred"}</div>
      )}
      {pending ? (
        <div className="nes-container is-rounded is-dark is-centered">
          <p>Loading...</p>
          <p>new stories can take up to 1 minute to generate.</p>
        </div>
      ) : (
        <button className="nes-btn is-primary" type="submit" disabled={pending}>
          Create
        </button>
      )}
    </form>
  );
}

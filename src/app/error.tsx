'use client';

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <div className="nes-container is-centered bg-white mb-4">
      <h1>Something went wrong!</h1>
      <p>We apologize for the inconvenience</p>
      <button
        className="nes-btn is-primary mt-4"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}

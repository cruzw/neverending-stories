'use client';

import { useState, useEffect } from "react";

const PROGRESS_BAR_INCREMENT = 5; // percent
const PROGRESS_INTERVAL = 50 // ms

export default function LoadingView() {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(function handleLoadingAnimation() {
    const interval = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        return prevProgress >= 100 ? 0 : prevProgress + PROGRESS_BAR_INCREMENT;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <progress className="nes-progress is-primary" value={loadingProgress} max="100" />
  );

}

# Neverending Stories
This is an experimental webapp in creating AI-generated stories, chapter by chapter, influenced by the user.

## Architecture
It uses next.js app router, is styled with [nes.css](https://nostalgic-css.github.io/NES.css/), and hosted on Vercel. For story persistence (prompt, chapters, images) we use Vercel's blob storage. For the AI generated content we use openAI gpt-4o & dall-e-3. Users bring their own API keys, which get persisted as cookies and are used for OpenAI API requests.

## Todos
- error handling, focus so far has been on happy-paths.
- add custom actions, so that users can specify exactly how they want the story to progress.
- strongly considering migrating to [Tufte CSS](https://edwardtufte.github.io/tufte-css/) or another CSS framework, [nes.css](https://nostalgic-css.github.io/NES.css/) is unique & nostalgia-inducing but perhaps not the best long-term.
- switch to storing Stories/Chapters within postgres. Would like to support home-page indexes like "Most recent" or "Longest".
- support different openAI models for story generation, as well as customizing DALL-E generation (image size, dimensions, style & quality).
- add a favicon.
- generate metadata per chapter.

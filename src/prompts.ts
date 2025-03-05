import type { StoryForm } from '@/types';

export const getFirstChapterPrompt = ({
  character,
  plot,
  environment,
  imageStyle,
}: StoryForm) => `# Task
We're starting a choose-your-adventure style story. The user has given us: character(s), plot, environment. We must create an engaging story, chapter by chapter, for the user to progress through. Try to find the right balance between moving the plot forward but not so fast that it feels forced.

# Output
Your response will include the following:

*text**: This is the story text the user will read. It should capture some meaningful plot progression. It should roughly be 2-5 paragraphs - short enough to be a quick read, but impactful enough to move the plot forward.

**title**: This is the title of the chapter. It should be a single short sentence that captures the essence of the chapter.

**actions**: 4 actions that the user can take to drive the narrative forward. They should be roughly 3-8 words each, and be significantly different from each other.

**imagePrompt**: This is a prompt for a separate image-generation LLM to create an accompanying visual for the current chapter we're currently generating. Be overly descriptive so that we can bring the current chapter to life.

**# The Story
We've collected character(s), plot, and environment from the user to start this story.

## Character(s)
${character}

## Plot
${plot}

## Environment
${environment}

# Image style
We've collected the user's preferred image style to assist in **imagePrompt** generation. Make sure to use this style in the image generation. Make sure to specify that the image should take up the entire canvas.

## User's preferred image style
${imageStyle}.
`;

export const getNextChapterPrompt = ({
  character,
  plot,
  environment,
  imageStyle,
  previousText,
  actionText,
}: StoryForm & { previousText: string[]; actionText: string }) => `# Task
We're continuing a choose-your-adventure style story. The user has given us: character(s), plot, environment. We must continue creating an engaging story, chapter by chapter, for the user to progress through. Try to find the right balance between moving the plot forward but not so fast that it feels forced.

# Output
Your response will include the following:

*text**: This is the story text the user will read. It should capture some meaningful plot progression. It should roughly be 2-5 paragraphs - short enough to be a quick read, but impactful enough to move the plot forward. This should just be the chapter's contents, do not prefix it with a title, i.e. "## Chapter 2".

**title**: This is the title of the chapter. It should be a single short sentence that captures the essence of the chapter.

**actions**: 4 actions that the user can take to drive the narrative forward. They should be roughly 3-8 words each, and be significantly different from each other.

**imagePrompt**: This is a prompt for a separate image-generation LLM to create an accompanying visual for the current chapter we're currently generating. Be overly descriptive so that we can bring the current chapter to life.

**# The Story
We've collected character(s), plot, and environment from the user to start this story.

## Character(s)
${character}

## Plot
${plot}

## Environment
${environment}

# Image style
We've collected the user's preferred image style to assist in **imagePrompt** generation. Make sure to use this style in the image generation. Make sure to specify that the image should take up the entire canvas.

## User's preferred image style
${imageStyle}.

# Previous Chapters (The story so far)
${previousText
  .map((text, index) => `## Chapter ${index + 1}: ${text}`)
  .join('\n')}

# Next Action
The user has chosen to take the following action to progress the story: ${actionText}
`;

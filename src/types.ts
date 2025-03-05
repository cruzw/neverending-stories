export type Chapter = {
  text: string;
  title: string;
  actions: string[];
  imagePrompt: string;
  previousText?: string[];
};

export type StoryForm = {
  character: string;
  plot: string;
  environment: string;
  imageStyle: string;
  id?: string;
};

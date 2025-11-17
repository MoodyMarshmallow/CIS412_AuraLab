export type Campaign = {
  id: string;
  title: string;
  prompt: string;
  guidelines: string;
  references: string[];
};

export type PostStatus = 'DRAFT' | 'READY';

export type Post = {
  id: string;
  campaignId: string;
  title: string;
  text: string;
  mediaPaths: string[];
  status: PostStatus;
  analysis: {
    summary: string;
    improvements: string[];
    mediaNotes?: string;
  };
};

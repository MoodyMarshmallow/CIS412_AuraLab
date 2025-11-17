import { Campaign, Post } from '@/types/campaign';

const placeholderImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
];

export const campaign: Campaign = {
  id: 'campaign-1',
  title: 'Scenery Campaign',
  prompt:
    'This campaign is marketing a series of seaside scenery paintings. Please ensure you highlight the beauty of the paintings and the hand-made quality. Do not mention the price in the posts.',
  guidelines:
    'Use warm, artisanal language. Mention the painter\'s inspiration from dawn and dusk lighting. Keep captions concise and always close with an inviting question.',
  references: placeholderImages
};

export const posts: Post[] = [
  {
    id: 'post-1',
    campaignId: campaign.id,
    title: 'Post 1',
    text: 'FriendName: La description du post, lorem ipsum dolor sit amet. FriendName: La réponse au commentaire.',
    mediaPaths: [placeholderImages[0]],
    status: 'READY',
    analysis: {
      summary: 'Overall sentiment is calming and positive. Tone aligns with the seaside brief.',
      improvements: ['Add a CTA to invite followers to visit the gallery.', 'Mention the artisan brushwork.', 'Highlight the limited collection.'],
      mediaNotes: 'Images could be clearer. Consider adding a close-up of the texture.'
    }
  },
  {
    id: 'post-2',
    campaignId: campaign.id,
    title: 'Post 2',
    text: 'Soft skies meeting the horizon with hand-blended pastels.',
    mediaPaths: [placeholderImages[1]],
    status: 'DRAFT',
    analysis: {
      summary: 'Good mention of colors, but lacks a clear hook.',
      improvements: ['Shorten the first sentence.', 'Add a question to drive comments.', 'Tag the artisan collective.'],
      mediaNotes: 'Focus on the lighthouse focal point.'
    }
  },
  {
    id: 'post-3',
    campaignId: campaign.id,
    title: 'Post 3',
    text: 'Waves painted with gentle knives to capture shimmering reflections.',
    mediaPaths: [placeholderImages[2]],
    status: 'DRAFT',
    analysis: {
      summary: 'Captures the technique but needs clearer CTA.',
      improvements: ['Mention the handmade frames.', 'Add emotive adjectives describing the waves.'],
      mediaNotes: 'Consider a carousel to show details.'
    }
  }
];

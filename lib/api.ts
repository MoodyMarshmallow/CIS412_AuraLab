import { campaign, posts } from './mockData';
import { Campaign, Post } from '@/types/campaign';

export async function fetchCampaign(): Promise<Campaign> {
  return new Promise((resolve) => setTimeout(() => resolve(campaign), 250));
}

export async function fetchPosts(): Promise<Post[]> {
  return new Promise((resolve) => setTimeout(() => resolve(posts), 300));
}

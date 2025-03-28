import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRSSFeed } from '../../lib/rss';
import { FeedItem } from '../../types/feed';

let cachedFeed: FeedItem[] | null = null;
let lastFetched = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedItem[] | { error: string }>
) {
  const feedUrl = req.query.url as string;

  if (!feedUrl) {
    return res.status(400).json({ error: 'Feed URL is required' });
  }

  const now = Date.now();

  // If cache is valid, return cached data
  if (cachedFeed && now - lastFetched < CACHE_TTL) {
    return res.status(200).json(cachedFeed);
  }

  try {
    const data = await fetchRSSFeed(feedUrl);
    cachedFeed = data;
    lastFetched = now;
    return res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error in /api/feed:', (err as Error).message);
    return res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}
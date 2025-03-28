import Parser from 'rss-parser';
import { FeedItem } from '../types/feed';
import fetch from 'node-fetch';

// @ts-ignore
const parser = new Parser({
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  },
  // @ts-ignore
  customFetch: fetch,
});

export async function fetchRSSFeed(url: string): Promise<FeedItem[]> {
  try {
    console.log('📡 Attempting to fetch RSS feed:', url);

    const feed = await parser.parseURL(url);
    console.log('✅ Successfully parsed RSS feed');

    return feed.items.map((item): FeedItem => ({
      title: item.title ?? 'Untitled',
      link: item.link ?? '#',
      content: item.contentSnippet ?? '',
      category: item.categories?.[0] ?? 'Uncategorized',
      pubDate: item.pubDate ?? '',
    }));
  } catch (err: any) {
    console.error('❌ Error in fetchRSSFeed:', err?.message || err);
    throw err;
  }
}
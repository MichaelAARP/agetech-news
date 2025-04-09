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
  const timeoutDuration = parseInt(process.env.RSS_TIMEOUT_MS || '20000', 10);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

  try {
    console.log('📡 Attempting to fetch RSS feed:', url, `(timeout: ${timeoutDuration}ms)`);

    const feed = await Promise.race([
      parser.parseURL(url),
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener('abort', () =>
          reject(new Error('Request timed out'))
        )
      ),
    ]) as Parser.Output<{}>;
    console.log('✅ Successfully parsed RSS feed');
    console.log(`🧾 Feed contains ${feed.items.length} items`);

    const mappedItems = feed.items.map((item, index): FeedItem => {
      const mapped = {
        title: item.title ?? 'Untitled',
        link: item.link ?? '#',
        content: item.contentSnippet ?? '',
        category: item.categories?.[0] ?? 'Uncategorized',
        pubDate: item.pubDate ?? '',
      };
      console.log(`🔹 Item ${index + 1}:`, mapped.title);
      return mapped;
    });

    return mappedItems;
  } catch (err: any) {
    console.error('❌ Error in fetchRSSFeed:', err?.message || err);
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
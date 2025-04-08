import { fetchRSSFeed } from '../../../../lib/rss';
import path from 'path';

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/5000';

  try {
    const feed = await fetchRSSFeed(feedUrl);
    console.log('✅ Feed fetched and parsed successfully');
    return new Response(JSON.stringify({ success: true, items: feed.length }));
  } catch (err) {
    console.error('❌ Failed to update feed:', err);
    return new Response(JSON.stringify({ error: 'Failed to update feed' }), { status: 500 });
  }
}
import { fetchRSSFeed } from '../../../../lib/rss';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/5000';

  try {
    const data = await fetchRSSFeed(feedUrl);
    const jsonPath = path.join(process.cwd(), 'public', 'feed.json');

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ status: 'success', items: data.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update feed' }), { status: 500 });
  }
}
import { fetchRSSFeed } from '../../../../lib/rss';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/5000';

  try {
    const feed = await fetchRSSFeed(feedUrl);
    const outputPath = path.join(process.cwd(), 'public', 'feed.json');
    console.log('📝 Writing to', outputPath);
    await fs.writeFile(outputPath, JSON.stringify(feed, null, 2));
    console.log('✅ Successfully wrote feed.json');
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('❌ Failed to write feed:', err);
    return new Response(JSON.stringify({ error: 'Failed to write feed' }), { status: 500 });
  }
}
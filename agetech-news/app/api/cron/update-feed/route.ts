import { fetchRSSFeed } from '../../../../lib/rss';
import { db } from '../../../../lib/firebaseAdmin';

export async function GET(req: Request) {
  console.log('📨 update-feed route triggered');

  const authHeader = req.headers.get('Authorization');
  console.log('🔐 Received Authorization header:', authHeader);

  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== expected) {
    console.log('❌ Authorization failed');
    return new Response('Unauthorized', { status: 401 });
  }

  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/5000';
  console.log(`🌐 Fetching feed from: ${feedUrl}`);

  fetchRSSFeed(feedUrl)
    .then(async (feed) => {
      console.log(`📦 Feed fetched with ${feed.length} items`);
      console.log('🧪 Sample item:', JSON.stringify(feed[0], null, 2));
      console.log('📤 Preparing to write feed to Firestore');
      await db.collection('rssCache').doc('latest').set({
        data: feed,
        updatedAt: new Date(),
      });
      console.log('✅ Feed saved to Firestore');
      console.log('📝 Firestore write complete');

      await db.collection('rssCache').doc('status').set({
        status: 'success',
        updatedAt: new Date(),
      });
    })
    .catch(async (err) => {
      console.error('❌ Error during feed fetch or Firestore write:', err);

      await db.collection('rssCache').doc('status').set({
        status: 'error',
        error: err.message,
        updatedAt: new Date(),
      });
    });

  console.log('🚀 update-feed function completed and response sent');
  return new Response(JSON.stringify({ success: true, message: 'Feed update started' }));
}
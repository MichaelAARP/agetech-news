import { fetchRSSFeed } from '../../../../lib/rss';
import { db } from '../../../../lib/firebaseAdmin';

export async function GET(req: Request) {
  console.log('📨 update-feed route triggered');

  // const authHeader = req.headers.get('Authorization');
  // console.log('🔐 Received Authorization header:', authHeader);

  // const expected = `Bearer ${process.env.CRON_SECRET}`;
  // if (authHeader !== expected) {
  //   console.log('❌ Authorization failed');
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const feedUrl = 'http://aarpagetechcollaborative.shiftportal.com/rss/1/-/-/5000';

  fetchRSSFeed(feedUrl)
    .then(async (feed) => {
      console.log(`📦 Feed fetched with ${feed.length} items`);
      console.log('📤 Preparing to write feed to Firestore');
      await db.collection('rssCache').doc('latest').set({
        data: feed,
        updatedAt: new Date(),
      });
      console.log('✅ Feed saved to Firestore');
    })
    .catch((err) => {
      console.error('❌ Failed to update feed:', err);
    });

  return new Response(JSON.stringify({ success: true, message: 'Feed update started' }));
}
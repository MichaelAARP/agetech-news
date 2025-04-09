import { db } from '../../../lib/firebaseAdmin';

export async function GET() {
    console.log('🕓 CRON route invoked');
  try {
    const doc = await db.collection('rssCache').doc('latest').get();

    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Feed not found' }), { status: 404 });
    }

    const { data } = doc.data()!;
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Failed to fetch feed:', err);
    return new Response(JSON.stringify({ error: 'Failed to load feed' }), { status: 500 });
  }
}
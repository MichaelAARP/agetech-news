import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('✅ hello.ts route hit');
  res.status(200).json({ message: 'API is working!' });
}
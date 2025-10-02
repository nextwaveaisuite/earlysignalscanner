import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (!process.env.EMAIL_SVC_API_KEY || !process.env.EMAIL_TO) return res.status(400).json({error:'Email service env not set'});
  res.json({ ok:true, note:'Email stub — integrate your provider here.' });
}

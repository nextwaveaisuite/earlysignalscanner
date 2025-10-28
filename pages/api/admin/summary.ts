import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: openPos } = await supa.from('positions').select('id').is('closed_at', null);
    const { data: closedPos } = await supa.from('positions').select('pnl_usd').not('closed_at', 'is', null);
    const { data: orders } = await supa.from('orders').select('status').gte('created_at', new Date(Date.now()-24*60*60*1000).toISOString());

    const realized = (closedPos||[]).reduce((a:any, b:any)=> a + Number(b.pnl_usd||0), 0);
    const openCount = openPos?.length || 0;
    const placedToday = (orders||[]).length || 0;

    res.status(200).json({
      ok: true,
      open_positions: openCount,
      realized_pnl_usd: Number(realized.toFixed(2)),
      orders_last_24h: placedToday
    });
  } catch (e:any) {
    res.status(500).json({ ok:false, error:e.message });
  }
}

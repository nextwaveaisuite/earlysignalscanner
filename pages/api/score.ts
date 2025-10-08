import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse){
  const items = [
    { token: "0xabc", symbol: "NOVA", name:"Nova", score: 72, confidence: 82, risk:"LOW", sparkline:[1,2,3,4,5] },
    { token: "0xdef", symbol: "FLUX", name:"Flux", score: 55, confidence: 64, risk:"MEDIUM", sparkline:[5,4,3,2,1] }
  ];
  res.status(200).json(req.query.withTokens ? { items } : items);
}

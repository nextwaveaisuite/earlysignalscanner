import type { NextApiRequest, NextApiResponse } from "next";
import { getAlerts } from "@/lib/serverData";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const alerts = await getAlerts();
  return res.status(200).json(alerts);
}

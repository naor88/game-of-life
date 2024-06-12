import type { NextApiRequest, NextApiResponse } from "next";
import { getAllGamesTS } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const savedGames = getAllGamesTS();
  res.status(200).json({ savedGames });
}

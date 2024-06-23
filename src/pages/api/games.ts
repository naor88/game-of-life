import type { NextApiRequest, NextApiResponse } from "next";
import { getAllGamesTS } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const savedGames = await getAllGamesTS();
    res.status(200).json({ savedGames });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

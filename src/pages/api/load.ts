import type { NextApiRequest, NextApiResponse } from "next";
import { getGameInfo, has } from "@/lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { savedTS } = req.body;

    if (!savedTS) {
      return res.status(400).json({ error: "savedTS are required" });
    }

    if (!has(savedTS)) {
      return res.status(404).json({ error: "savedTS not Found!" });
    }

    const gameInfo = getGameInfo(savedTS);
    res.status(200).json(gameInfo);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

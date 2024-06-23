import type { NextApiRequest, NextApiResponse } from "next";
import { saveGameInfo } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { livingCells, rows, cols } = req.body;
    if (!rows) {
      return res.status(400).json({ error: "rows is required" });
    }
    if (!cols) {
      return res.status(400).json({ error: "cols is required" });
    }
    if (!livingCells) {
      return res.status(400).json({ error: "livingCells is required" });
    }
    const nowTS = Date.now().toString();
    await saveGameInfo(nowTS, { livingCells, rows, cols });
    res.status(201).json({ message: "Game state saved successfully" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

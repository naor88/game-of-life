import type { NextApiRequest, NextApiResponse } from "next";
import { calcEvolveBoard } from "@/utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const livingCellsSet = new Set<string>(livingCells);

    const nextLivingCells = calcEvolveBoard(rows, cols, livingCellsSet);

    res.status(200).json({ nextLivingCells: Array.from(nextLivingCells) });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

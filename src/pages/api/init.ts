import type { NextApiRequest, NextApiResponse } from "next";
import { generateLivingCells } from "@/utils";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { rows, cols, useRandom } = req.body;

  if (!rows || !cols) {
    return res.status(400).json({ error: "Rows and cols are required" });
  }

  if (typeof useRandom !== "boolean") {
    return res
      .status(400)
      .json({ error: "useRandom are required and need to be boolean type" });
  }

  const rowsNumber = parseInt(rows as string, 10);
  const colsNumber = parseInt(cols as string, 10);

  if (isNaN(rowsNumber) || isNaN(colsNumber)) {
    return res.status(400).json({ error: "Rows and cols must be numbers" });
  }

  const livingCells = generateLivingCells(rowsNumber, colsNumber, useRandom);

  res.status(200).json({ livingCells: Array.from(livingCells) });
}

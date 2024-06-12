import React, { useEffect, useRef } from "react";
import { generateMatrixKey } from "../../utiles";

interface MatrixProps {
  livingCells: Set<string>;
  rows: number;
  cols: number;
}
const cellSize = 2;
const cellGap = 1;

const cellHeight = cellSize + cellGap;
const cellWeight = cellSize + cellGap;

export const Matrix: React.FC<MatrixProps> = ({ livingCells, rows, cols }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    livingCells.forEach((key) => {
      const [row, col] = key.split(",").map(Number);
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        col * (cellSize + cellGap),
        row * (cellSize + cellGap),
        cellSize,
        cellSize
      );
    });

    // Fill non-living cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = generateMatrixKey(row, col);
        if (!livingCells.has(key)) {
          ctx.fillStyle = "black";
          ctx.fillRect(
            col * (cellSize + cellGap),
            row * (cellSize + cellGap),
            cellSize,
            cellSize
          );
        }
      }
    }
  }, [livingCells, rows, cols]);

  return (
    <canvas
      className="flex flex-row justify-center"
      ref={canvasRef}
      width={cols * cellHeight}
      height={rows * cellWeight}
      style={{ border: "1px solid black" }}
    />
  );
};

export default Matrix;

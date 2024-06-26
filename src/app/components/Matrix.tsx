import React, { useEffect, useRef } from "react";
import { generateMatrixKey } from "../../utils";

interface MatrixProps {
  livingCells: Set<string>;
  handleCellClick: (row: number, col: number) => void;
  rows: number;
  cols: number;
}
const cellSize = 5;
const cellGap = 1;

const cellHeight = cellSize + cellGap;
const cellWeight = cellSize + cellGap;

function drawCell(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(
    col * (cellSize + cellGap),
    row * (cellSize + cellGap),
    cellSize,
    cellSize
  );
}

export const Matrix: React.FC<MatrixProps> = ({
  livingCells,
  handleCellClick,
  rows,
  cols,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw living cells
    livingCells.forEach((key) => {
      const [row, col] = key.split(",").map(Number);
      drawCell(ctx, row, col, "yellow");
    });

    // Draw non-living cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = generateMatrixKey(row, col);
        if (!livingCells.has(key)) {
          drawCell(ctx, row, col, "black");
        }
      }
    }
  }, [livingCells, rows, cols]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / (cellSize + cellGap));
    const row = Math.floor(y / (cellSize + cellGap));

    handleCellClick(row, col);
  };

  return (
    <canvas
      className="flex flex-row justify-center my-5 cursor-pointer"
      ref={canvasRef}
      width={cols * cellHeight}
      height={rows * cellWeight}
      onClick={handleCanvasClick}
    />
  );
};

export default Matrix;

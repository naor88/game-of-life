import React, { useEffect, useRef } from "react";
import { generateMatrixKey } from "../../utils";

interface MatrixProps {
  livingCells: Set<string>;
  handleCellClick: (row: number, col: number) => void;
  rows: number;
  cols: number;
}
const cellSize = 10;
const cellGap = 2;

const cellHeight = cellSize + cellGap;
const cellWeight = cellSize + cellGap;

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
      className="flex flex-row justify-center my-5"
      ref={canvasRef}
      width={cols * cellHeight}
      height={rows * cellWeight}
      onClick={handleCanvasClick}
    />
  );
};

export default Matrix;

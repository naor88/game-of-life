import { calcLivingNeighbors, generateMatrixKey, generateRandomLivingCells } from '@/utiles';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Matrix } from '../components/Matrix';

const speedMs = 200;

export default function Home() {
  const [error, setError] = useState("");
  const [isAuto, setIsAuto] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const rowInputRef = useRef<HTMLInputElement>(null);
  const columnsInputRef = useRef<HTMLInputElement>(null);
  const [livingCells, setLivingCells] = useState<Set<string>>(new Set());

  const initiateGame = () => {
    if (!rowInputRef?.current?.value || +rowInputRef.current.value < 1) {
      return setError("Rows must be integer value bigger than 0");
    }
    if (!columnsInputRef?.current?.value || +columnsInputRef.current.value < 1) {
      return setError("Columns must be integer value bigger than 0");
    }

    const rows = +rowInputRef.current.value;
    const cols = +columnsInputRef.current.value;
    const livingCells = generateRandomLivingCells(rows, cols);

    setRows(rows);
    setCols(cols);
    setLivingCells(livingCells);
  };

  const evolveBoard = useCallback(() => {
    const newLivingCells = new Set<string>();

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const livingNeighbors = calcLivingNeighbors(livingCells, i, j, rows, cols);
        const key = generateMatrixKey(i, j);

        if (livingCells.has(key)) {
          if (livingNeighbors === 2 || livingNeighbors === 3) {
            newLivingCells.add(key);
          }
        } else if (livingNeighbors === 3) {
          newLivingCells.add(key);
        }
      }
    }

    setLivingCells(newLivingCells);
  }, [rows, cols, livingCells]);

  useEffect(() => {
    if (!isAuto) return;

    const timeoutId = setTimeout(() => evolveBoard(), speedMs);
    return () => clearTimeout(timeoutId);
  }, [isAuto, evolveBoard]);

  return (
    <div className="flex flex-col items-center h-screen w-screen">
      <div>
        <h1 className="flex justify-center">Game Of Life</h1>
        <div className="my-3 flex flex-row gap-6 justify-center leading-10">
          <div className="flex flex-row gap-3">
            <label>Rows</label>
            <input type="number" ref={rowInputRef} />
          </div>
          <div className="flex flex-row gap-3">
            <label>Columns</label>
            <input type="number" ref={columnsInputRef} />
          </div>
          <button className="btn btn-primary" onClick={initiateGame}>
            Start
          </button>
          <button className="btn btn-outline" onClick={evolveBoard}>
            Next Gen
          </button>
          <button className="btn btn-outline" onClick={() => setIsAuto((prevState) => !prevState)}>
            {isAuto ? "Stop" : "Play"}
          </button>
        </div>
      </div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <Matrix livingCells={livingCells} rows={rows} cols={cols} />
      )}
    </div>
  );
}

"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Matrix from "./components/Matrix";

const calcLivingNeighbors = (
  board: boolean[][],
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
) => {
  let liveNeighbors = 0;
  // check for the row before
  if (row > 0) {
    if (col > 0) {
      if (board[row - 1][col - 1]) liveNeighbors++;
    }
    if (board[row - 1][col]) liveNeighbors++;
    if (col < totalCols - 1) {
      if (board[row - 1][col + 1]) liveNeighbors++;
    }
  }
  //check at the same row
  if (col > 0) {
    if (board[row][col - 1]) liveNeighbors++;
  }
  if (col < totalCols - 1) {
    if (board[row][col + 1]) liveNeighbors++;
  }
  // check for the row after
  if (row < totalRows - 1) {
    if (col > 0) {
      if (board[row + 1][col - 1]) liveNeighbors++;
    }
    if (board[row + 1][col]) liveNeighbors++;
    if (col < totalCols - 1) {
      if (board[row + 1][col + 1]) liveNeighbors++;
    }
  }

  return liveNeighbors;
};

export default function Home() {
  const [error, setError] = useState("");
  const [isAuto, setIsAuto] = useState(false);
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);

  const rowInputRef = useRef<HTMLInputElement>(null);
  const columnsInputRef = useRef<HTMLInputElement>(null);

  const [board, setBoard] = useState<Array<Array<boolean>>>([]);

  const generateRandomMatrix = (rows: number, cols: number): boolean[][] => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() > 0.5 ? true : false);
      }
      matrix.push(row);
    }
    return matrix;
  };

  const generateMatrix = <T,>(
    rows: number,
    cols: number,
    initValue: T
  ): T[][] => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(initValue);
      }
      matrix.push(row);
    }
    return matrix;
  };

  const initiateGame = () => {
    if (!rowInputRef?.current?.value || +rowInputRef.current.value < 1) {
      return setError("Rows must be integer value bigger than 0");
    }
    if (
      !columnsInputRef?.current?.value ||
      +columnsInputRef.current.value < 1
    ) {
      return setError("Columns must be integer value bigger than 0");
    }
    const rows = +rowInputRef.current.value;
    const cols = +columnsInputRef.current.value;
    const newBoard = generateRandomMatrix(rows, cols);
    setRows(rows);
    setCols(cols);
    setBoard(newBoard);
  };

  const evolveBoard = useCallback(() => {
    const evolveBoard = generateMatrix(rows, cols, false);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const livingNeighbors = calcLivingNeighbors(board, i, j, rows, cols);
        if (board[i][j] && livingNeighbors < 2) {
          //check for Rule 1
          evolveBoard[i][j] = false; // under-population cause dies
        } else if (board[i][j] && [2, 3].includes(livingNeighbors)) {
          // check for Rule 2
          evolveBoard[i][j] = true; // regular-population keep living
        } else if (board[i][j] && livingNeighbors > 3) {
          // check for Rule 3
          evolveBoard[i][j] = false; // over-population cause dies
        } else if (board[i][j] == false && livingNeighbors == 3) {
          // check for Rule 4
          evolveBoard[i][j] = true; // reproducing cause live
        } else {
          evolveBoard[i][j] = board[i][j];
        }
      }
    }
    setBoard(evolveBoard);
  }, [rows, cols, board]);

  useEffect(() => {
    if (!isAuto) return;

    const timeoutId = setTimeout(() => evolveBoard(), 1000);

    return () => clearTimeout(timeoutId);
  }, [isAuto, evolveBoard]);


  return (
    <div className="flex flex-col items-center h-screen w-screen">
      <div>
        <h1 className="flex justify-center">Game Of Life</h1>
        {/* inputs */}
        <div className="my-3 flex flex-row gap-6 justify-center leading-10">
          <div className="flex flex-row gap-3">
            <label htmlFor="">Rows</label>
            <input type="number" ref={rowInputRef} />
          </div>
          <div className="flex flex-row gap-3">
            <label htmlFor="">Columns</label>
            <input type="number" ref={columnsInputRef} />
          </div>
          <button className="btn btn-primary" onClick={initiateGame}>
            Start
          </button>
          <button className="btn btn-outline" onClick={evolveBoard}>
            Next Gen
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setIsAuto((prevState) => !prevState)}
          >
            {isAuto ? "Stop" : "Play"}
          </button>
        </div>
      </div>
      {/* board */}
      {error ? <div>Error: {error}</div> : <Matrix data={board} />}
    </div>
  );
}

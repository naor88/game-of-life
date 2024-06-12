import React, { useState, useEffect, useCallback } from "react";
import { generateMatrixKey } from "@/utils";
import { Matrix } from "@/app/components/Matrix";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import {
  getAllSavedGames,
  saveGame,
  loadGameInfo,
  getEvolveBoard,
  initGame,
} from "@/app/api";

const speedMs = 200;
const initMatrixSize = 50;
const successMsgTimeout = 5000;

export default function Home() {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuto, setIsAuto] = useState(false);
  const [rows, setRows] = useState(initMatrixSize);
  const [cols, setCols] = useState(initMatrixSize);
  const [savedGames, setSavedGames] = useState<string[]>([]);

  const [livingCells, setLivingCells] = useState<Set<string>>(new Set());

  const initGameWithRandom = () => initiateGame(true);
  const initGameWithEmpty = () => initiateGame(false);


  const initiateGame = async (useRandomCells = false) => {
    const { livingCells } = await initGame(rows, cols, useRandomCells);
    const livingCellsSet = new Set<string>(livingCells);
    setErrorMsg("");
    setLivingCells(livingCellsSet);
  };

  const evolveBoard = useCallback(async () => {
    try {
      const { nextLivingCells } = await getEvolveBoard(rows, cols, livingCells);
      const nextLivingCellsSet = new Set<string>(nextLivingCells);
      setLivingCells(nextLivingCellsSet);
    } catch (error) {
      setErrorMsg("Error calculate evolve board" + error);
    }
  }, [rows, cols, livingCells]);

  const handleCellClick = (row: number, col: number) => {
    const key = generateMatrixKey(row, col);
    setLivingCells((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key); // Remove the cell from the set if it exists
      } else {
        newSet.add(key); // Add the cell to the set if it doesn't exist
      }
      return newSet;
    });
  };

  const handleRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRows(parseInt(event.target.value, 10));
  };

  const handleColChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCols(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    initGameWithEmpty();
  };

  const fetchAllSavedGames = async () => {
    try {
      const { savedGames } = await getAllSavedGames();
      setSavedGames(savedGames);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name !== "AbortError") {
          // Check if the error is not due to the abort
          setErrorMsg("Error fetching data: " + error.message);
        }
      } else {
        setErrorMsg("An unknown error occurred" + error);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllSavedGames();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!isAuto) return;

    const timeoutId = setTimeout(() => evolveBoard(), speedMs);
    return () => clearTimeout(timeoutId);
  }, [isAuto, evolveBoard]);

  useEffect(() => {
    if (!successMsg) return;
    const timeoutId = setTimeout(() => setSuccessMsg(""), successMsgTimeout);
    return () => clearTimeout(timeoutId);
  }, [successMsg]);

  return (
    <div className="flex flex-col items-center h-screen w-screen">
      <div>
        <div className="bg-orange-500 w-screen">
          <h1 className="flex justify-center text-black font-bold text-xl">
            Game Of Life
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="my-3 mx-auto p-3 flex flex-row gap-6 justify-center leading-10 border border-white rounded-xl max-w-fit">
            <div className="flex flex-row gap-3 items-center">
              <label htmlFor="rows">Number of Board Rows</label>
              <input
                id="rows"
                className="rounded-lg border border-white px-3 w-24"
                type="number"
                value={rows}
                onChange={handleRowChange}
                min="1"
              />
            </div>
            <div className="flex flex-row gap-3 items-center">
              <label htmlFor="cols">Number of Board Columns</label>
              <input
                id="cols"
                className="rounded-lg border border-white px-3 w-24"
                type="number"
                value={cols}
                onChange={handleColChange}
                min="1"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Board
            </button>
          </div>
        </form>

        <div className="flex flex-row justify-around max-w-fit mx-auto">
          <button
            className="btn btn-outline btn-success"
            onClick={initGameWithRandom}
          >
            Random Initiate
          </button>
          <button
            className="btn btn-outline btn-success"
            onClick={initGameWithEmpty}
          >
            Empty Board
          </button>
          <button className="btn btn-outline btn-success" onClick={evolveBoard}>
            Next Gen
          </button>
          <button
            className="btn btn-outline btn-success"
            onClick={() => setIsAuto((prevState) => !prevState)}
          >
            {isAuto ? "Stop" : "Play"} Auto Run
          </button>
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label
                htmlFor="my-drawer"
                className="btn btn-primary drawer-button"
              >
                Games States
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <button
                  className="btn btn-outline"
                  onClick={async () => {
                    try {
                      await saveGame(rows, cols, livingCells);
                      setSuccessMsg("Game State Saved Successfully!");
                      await fetchAllSavedGames();
                    } catch (error) {
                      setErrorMsg("error: " + error);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCirclePlus} className="m-0" />
                  Save Game State
                </button>

                <div className="flex flex-col mt-6">
                  {savedGames.map((item: string) => (
                    <button
                      onClick={async () => {
                        const { livingCells, rows, cols } = await loadGameInfo(
                          item
                        );
                        setCols(cols);
                        setRows(rows);
                        setLivingCells(new Set(livingCells));
                      }}
                      key={item}
                      className="btn btn-outline"
                    >
                      {new Date(+item).toLocaleTimeString()}
                    </button>
                  ))}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {errorMsg ? (
        <div className="alert alert-error max-w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span>Error! {errorMsg}</span>
        </div>
      ) : rows > 0 && cols > 0 ? (
        <>
          <div className="my-3 flex flex-row gap-6 justify-center">
            <div className="alert alert-info max-w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <span>Click on the board cells for set the initiate state</span>
            </div>
          </div>
          {successMsg && (
            <div className="alert alert-success max-w-fit">{successMsg}</div>
          )}
          <Matrix
            livingCells={livingCells}
            rows={rows}
            cols={cols}
            handleCellClick={handleCellClick}
          />
        </>
      ) : null}
    </div>
  );
}

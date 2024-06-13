import Database from "better-sqlite3";

let db: Database.Database;

interface GameInfo {
  livingCells: string[];
  rows: number;
  cols: number;
}

interface DBGameInfo {
  gameTS: string;
  rows: number;
  cols: number;
  livingCells: string;
}

const initDb = () => {
  if (!db) {
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        gameTS TEXT PRIMARY KEY,
        rows INTEGER,
        cols INTEGER,
        livingCells TEXT
      );
    `);
  }
  return db;
};

const insertGameState = (
  gameTS: string,
  rows: number,
  cols: number,
  livingCells: string[]
) => {
  const db = initDb();
  const insert = db.prepare(
    "INSERT INTO games (gameTS, rows, cols, livingCells) VALUES (?, ?, ?, ?)"
  );
  insert.run(gameTS, rows, cols, JSON.stringify(livingCells));
};

const getGameState = (gameTS: string) => {
  const db = initDb();
  const select = db.prepare("SELECT * FROM games WHERE gameTS = ?");
  const game = select.get(gameTS) as DBGameInfo;
  if (game) {
    return {
      gameTS: game.gameTS,
      rows: game.rows,
      cols: game.cols,
      livingCells: JSON.parse(game.livingCells),
    };
  }
  return null;
};

export const getAllDBGamesTS = () => {
  const db = initDb();
  const select = db.prepare("SELECT gameTS FROM games");
  const rows = select.all() as { gameTS: string }[];
  return rows.map((row) => row.gameTS);
};

export const getGameInfo = (gameTS: string): DBGameInfo | null => {
  return getGameState(gameTS);
};

export const saveGameInfo = (gameTS: string, gameInfo: GameInfo): void => {
  insertGameState(gameTS, gameInfo.rows, gameInfo.cols, gameInfo.livingCells);
};

export const getAllGamesTS = () => {
  return getAllDBGamesTS();
};

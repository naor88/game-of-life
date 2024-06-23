import sqlite3 from 'sqlite3';

let db: sqlite3.Database;

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

const initDb = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          console.error('Error opening database', err);
          reject(err);
        } else {
          db.run(`
            CREATE TABLE IF NOT EXISTS games (
              gameTS TEXT PRIMARY KEY,
              rows INTEGER,
              cols INTEGER,
              livingCells TEXT
            )
          `, (err) => {
            if (err) {
              console.error('Error creating table', err);
              reject(err);
            } else {
              resolve(db);
            }
          });
        }
      });
    } else {
      resolve(db);
    }
  });
};

const insertGameState = async (
  gameTS: string,
  rows: number,
  cols: number,
  livingCells: string[]
) => {
  const db = await initDb();
  const sql = `
    INSERT INTO games (gameTS, rows, cols, livingCells)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [gameTS, rows, cols, JSON.stringify(livingCells)], (err) => {
    if (err) {
      console.error('Error inserting data', err);
    }
  });
};

const getGameState = async (gameTS: string): Promise<DBGameInfo | null> => {
  const db = await initDb();
  return new Promise<DBGameInfo | null>((resolve, reject) => {
    const sql = 'SELECT * FROM games WHERE gameTS = ?';
    db.get(sql, [gameTS], (err, row: DBGameInfo) => {
      if (err) {
        console.error('Error fetching data', err);
        reject(err);
      } else if (row) {
        resolve({
          gameTS: row.gameTS,
          rows: row.rows,
          cols: row.cols,
          livingCells: JSON.parse(row.livingCells),
        } as DBGameInfo);
      } else {
        resolve(null);
      }
    });
  });
};

const getAllDBGamesTS = async (): Promise<string[]> => {
  const db = await initDb();
  return new Promise<string[]>((resolve, reject) => {
    const sql = 'SELECT gameTS FROM games';
    db.all(sql, [], (err, rows:DBGameInfo[]) => {
      if (err) {
        console.error('Error fetching data', err);
        reject(err);
      } else {
        resolve(rows.map((row) => row.gameTS));
      }
    });
  });
};

export const getGameInfo = (gameTS: string): Promise<DBGameInfo | null> => {
  return getGameState(gameTS);
};

export const saveGameInfo = (gameTS: string, gameInfo: GameInfo): void => {
  insertGameState(gameTS, gameInfo.rows, gameInfo.cols, gameInfo.livingCells);
};

export const getAllGamesTS = (): Promise<string[]> => {
  return getAllDBGamesTS();
};

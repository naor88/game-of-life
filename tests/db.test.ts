import { saveGameInfo, getGameInfo, getAllDBGamesTS } from "../src/lib/db";

describe("SQLite In-Memory Database Tests", () => {
  it("should insert and retrieve a game state", () => {
    const gameTS = "test-game-1";
    const rows = 10;
    const cols = 10;
    const livingCells = ["1,1", "2,2", "3,3"];

    saveGameInfo(gameTS, { rows, cols, livingCells });
    const gameState = getGameInfo(gameTS);

    expect(gameState).not.toBeNull();
    if (gameState) {
      expect(gameState.gameTS).toBe(gameTS);
      expect(gameState.rows).toBe(rows);
      expect(gameState.cols).toBe(cols);
      expect(gameState.livingCells).toEqual(livingCells);
    }
  });

  it("should return null for a non-existent game state", () => {
    const gameTS = "non-existent-game";
    const gameState = getGameInfo(gameTS);
    expect(gameState).toBeNull();
  });

  it("should retrieve all game timestamps", () => {
    const gameTS1 = "test-game-2";
    const gameTS2 = "test-game-3";
    const rows = 5;
    const cols = 5;
    const livingCells = ["1,1", "2,2"];

    saveGameInfo(gameTS1, { rows, cols, livingCells });
    saveGameInfo(gameTS2, { rows, cols, livingCells });

    const gameTimestamps = getAllDBGamesTS();
    expect(gameTimestamps).toContain(gameTS1);
    expect(gameTimestamps).toContain(gameTS2);
  });
});

interface GameInfo {
  livingCells: string[];
  rows: number;
  cols: number;
}

const gamesState: { [key: string]: GameInfo } = {};

export const has = (gameTS: string): boolean => {
  return gameTS in gamesState;
};

export const getGameInfo = (gameTS: string): GameInfo => {
  return gamesState[gameTS];
};

export const saveGameInfo = (gameTS: string, gameInfo: GameInfo): void => {
  gamesState[gameTS] = gameInfo;
};

export const getAllGamesTS = () => {
  return Object.keys(gamesState);
};

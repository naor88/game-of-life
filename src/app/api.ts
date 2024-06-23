// const SERVER_PORT = process.env.PORT;
const SERVER_BASE_URL = ''; //`${process.env.NEXT_PUBLIC_URL}:${SERVER_PORT}`;

export const getAllSavedGames = async () => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/games`);
    if (response.status === 200) {
      return await response.json();
    }
    throw new Error(`response status: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const saveGame = async (
  rows: number,
  cols: number,
  livingCells: Set<string>
) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rows,
        cols,
        livingCells: Array.from(livingCells),
      }),
    });
    if (response.status === 201) {
      return await response.json();
    }
    throw new Error(`response status: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const initGame = async (
  rows: number,
  cols: number,
  useRandom: boolean
) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rows,
        cols,
        useRandom,
      }),
    });
    if (response.status === 200) {
      return await response.json();
    }
    throw new Error(`response status: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const loadGameInfo = async (savedTS: string) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/load`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        savedTS,
      }),
    });
    if (response.status === 200) {
      return await response.json();
    }
    throw new Error(`response status: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const getEvolveBoard = async (
  rows: number,
  cols: number,
  livingCells: Set<string>
) => {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/evolve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rows,
        cols,
        livingCells: Array.from(livingCells),
      }),
    });
    if (response.status === 200) {
      return await response.json();
    }
    throw new Error(`response status: ${response.status}`);
  } catch (error) {
    throw error;
  }
};

export const generateMatrixKey = (row: number, col: number): string =>
  `${row},${col}`;

export const coupleExists = (
  livingCellsSet: Set<string>,
  row: number,
  col: number
): boolean => {
  return livingCellsSet.has(generateMatrixKey(row, col));
};

export const calcLivingNeighbors = (
  livingCells: Set<string>,
  row: number,
  col: number,
  totalRows: number,
  totalCols: number
) => {
  const neighborOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return neighborOffsets.reduce((liveNeighbors, [dRow, dCol]) => {
    const neighborRow = row + dRow;
    const neighborCol = col + dCol;

    if (
      neighborRow >= 0 &&
      neighborRow < totalRows &&
      neighborCol >= 0 &&
      neighborCol < totalCols &&
      coupleExists(livingCells, neighborRow, neighborCol)
    ) {
      return liveNeighbors + 1;
    }

    return liveNeighbors;
  }, 0);
};

export const generateLivingCells = (
  rows: number,
  cols: number,
  useRandom: boolean
): Set<string> => {
  const livingCells = new Set<string>();
  if (!useRandom) return livingCells;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() > 0.5) {
        livingCells.add(generateMatrixKey(i, j));
      }
    }
  }
  return livingCells;
};

export const calcEvolveBoard = (
  rows: number,
  cols: number,
  livingCells: Set<string>
) => {
  const newLivingCells = new Set<string>();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const livingNeighbors = calcLivingNeighbors(
        livingCells,
        i,
        j,
        rows,
        cols
      );
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

  return newLivingCells;
};

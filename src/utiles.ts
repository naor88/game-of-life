export const generateMatrixKey = (row: number, col: number): string => `${row},${col}`;

export  const coupleExists = (
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

export const generateRandomLivingCells = (rows: number, cols: number): Set<string> => {
  const livingCells = new Set<string>();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() > 0.5) {
        livingCells.add(generateMatrixKey(i, j));
      }
    }
  }
  return livingCells;
};

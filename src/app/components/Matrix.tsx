import React from "react";

interface MatrixProps {
  data: boolean[][];
}

const Matrix: React.FC<MatrixProps> = ({ data }) => {
  return (
    <table className="h-5/6 w-5/6">
      <tbody className="border-separate border-spacing-2">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                className={`border border-black rounded-xl ${cell ? "bg-yellow-300" : "bg-black"}`}
                key={cellIndex}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Matrix;

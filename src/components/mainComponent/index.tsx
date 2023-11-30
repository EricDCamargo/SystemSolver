import React, { useState } from 'react'

interface LinearSystemSolverProps {}

const LinearSystemSolver: React.FC<LinearSystemSolverProps> = () => {
  const [matrixRows, setMatrixRows] = useState<number>(2)
  const [matrixCols, setMatrixCols] = useState<number>(3)
  const [augmentedMatrix, setAugmentedMatrix] = useState<number[][]>(
    new Array(matrixRows).fill(null).map(() => new Array(matrixCols).fill(0))
  )
  const [solution, setSolution] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleMatrixSizeChange = (rows: number, cols: number) => {
    setMatrixRows(rows)
    setMatrixCols(cols)
    setAugmentedMatrix(
      new Array(rows).fill(null).map(() => new Array(cols).fill(0))
    )
  }

  const handleInputChange = (row: number, col: number, value: string) => {
    const newValue = parseFloat(value)
    const newMatrix = augmentedMatrix.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((c, colIndex) => (colIndex === col ? newValue : c))
        : r
    )

    setAugmentedMatrix(newMatrix)
  }

  const solveLinearSystem = () => {
    if (validateInput()) {
      const matrix = augmentedMatrix.map(row => [...row])

      for (let pivotRow = 0; pivotRow < matrixRows - 1; pivotRow++) {
        for (let row = pivotRow + 1; row < matrixRows; row++) {
          const factor = matrix[row][pivotRow] / matrix[pivotRow][pivotRow]

          for (let col = pivotRow; col < matrixCols + 1; col++) {
            matrix[row][col] -= factor * matrix[pivotRow][col]
          }
        }
      }

      const result: number[] = new Array(matrixRows).fill(0)
      for (let row = matrixRows - 1; row >= 0; row--) {
        let sum = 0
        for (let col = row + 1; col < matrixCols; col++) {
          sum += matrix[row][col] * result[col]
        }
        result[row] = (matrix[row][matrixCols] - sum) / matrix[row][row]
      }

      setSolution(result)
    }
  }

  const validateInput = (): boolean => {
    for (let row = 0; row < matrixRows; row++) {
      for (let col = 0; col < matrixCols; col++) {
        if (isNaN(augmentedMatrix[row][col])) {
          setError('Por favor, preencha todos os campos com números válidos.')
          return false
        }
      }
    }

    const hasZeroRows = augmentedMatrix.some(row =>
      row.every(value => value === 0)
    )

    if (hasZeroRows) {
      setError('A matriz não pode ter todas as linhas com zeros.')
      return false
    }

    setError(null)
    return true
  }

  return (
    <div>
      <h2>Sistema Linear Solver</h2>

      <label>
        Número de Linhas:
        <input
          type="number"
          value={matrixRows}
          onChange={e =>
            handleMatrixSizeChange(parseInt(e.target.value, 10), matrixCols)
          }
        />
      </label>

      <label>
        Número de Colunas:
        <input
          type="number"
          value={matrixCols}
          onChange={e =>
            handleMatrixSizeChange(matrixRows, parseInt(e.target.value, 10))
          }
        />
      </label>

      <div>
        {Array.from({ length: matrixRows }).map((_, rowIndex) => (
          <div key={rowIndex}>
            {Array.from({ length: matrixCols }).map((__, colIndex) => (
              <input
                key={colIndex}
                type="number"
                value={augmentedMatrix[rowIndex][colIndex]}
                onChange={e =>
                  handleInputChange(rowIndex, colIndex, e.target.value)
                }
              />
            ))}
          </div>
        ))}
      </div>

      <button onClick={solveLinearSystem}>Resolver</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {solution.length > 0 && (
        <div>
          <h3>Solução:</h3>
          <ul>
            {solution.map(
              (value, index) => (
                console.log(value),
                (<li key={index}>{`x${index + 1}: ${value}`}</li>)
              )
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LinearSystemSolver

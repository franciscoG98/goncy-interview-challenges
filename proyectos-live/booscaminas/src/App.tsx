import { useEffect, useState } from "react"
import boo from '/boo.mp3'

type Cell = {
  id: string,
  pumpking: boolean,
  clicked: boolean,
  around: number,
  flagged: boolean
}

const initializeGrid = (size: number, mines: number) => {
  let grid: Cell[][] = []

  for (let j = 0; j < size; j++) {

    let line: Cell[] = []

    for (let i = 0; i < size; i++) {
      let placePumpking = Math.random() < (mines - grid.flat().filter(cell => cell.pumpking).length) / ((size * size) - (j * size + i))
      line.push({ id: `${j}${i}`, pumpking: placePumpking, clicked: false, around: 0, flagged: false })
    }
    grid.push(line)
  }

  return grid
}

function App() {

  const [grid, setGrid] = useState<Cell[][]>([])
  const [lose, setLose] = useState<boolean>(false)
  const [win, setWin] = useState<boolean>(false)
  const [mines, setMines] = useState<number>(10)
  const [gridSize, setGridSize] = useState<number>(10)
  const initialCells = gridSize ** 2
  const [availableCells, setAvailableCells] = useState<number>(initialCells)

  useEffect(() => {
    setGrid(initializeGrid(gridSize, mines))
  }, [mines, gridSize])

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLose(false)
    setWin(false)
    setAvailableCells(initialCells)
    setGrid(initializeGrid(gridSize, mines))
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: Cell) => {
    e.preventDefault()

    if (e.type === 'contextmenu') {
      toggleFlag(item)
    } else if (!item.flagged) {
      toggleClicked(item)
      if (item.pumpking) setLose(true)
    }
  }

  const toggleClicked = (item: Cell) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell.id === item.id) {
          let around = 0

          const neighbors = [
            [rowIndex - 1, colIndex - 1],
            [rowIndex - 1, colIndex],
            [rowIndex - 1, colIndex + 1],
            [rowIndex, colIndex - 1],
            [rowIndex, colIndex + 1],
            [rowIndex + 1, colIndex - 1],
            [rowIndex + 1, colIndex],
            [rowIndex + 1, colIndex + 1]
          ]

          // check cells and update around
          neighbors.forEach(([r, c]) => {
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c].pumpking) {
              around++
            }
          })

          return { ...cell, clicked: true, around }
        }
        return cell
      })
    )
    setGrid(newGrid)
    let updatedAvailableCells = availableCells - 1
    setAvailableCells(updatedAvailableCells)

    // Check if all non-pumpkin cells are clicked
    const allNonPumpkinClicked = newGrid.flat().filter(cell => !cell.pumpking).every(cell => cell.clicked)
    if (allNonPumpkinClicked) {
      setWin(true)
    }

  }

  const toggleFlag = (item: Cell) => {
    const newGrid = grid.map(row =>
      row.map(cell =>
        cell.id === item.id ? { ...cell, flagged: !cell.flagged } : cell
      )
    )
    setGrid(newGrid)
  }

  let loseSound = new Audio(boo)
  const handleLose = () => {
    loseSound.play()
  }

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      <header className="text-xl capitalize text-center font-bold leading-[3rem]">booscaminas</header>

      {
        !lose && !win
          ? (
            <section className="flex flex-col mx-auto gap-3">
              <label htmlFor="size">
                <span>Configura el tamaño de la grilla</span>
                <input
                  className="border ml-2 p-2 w-12 rounded-sm"
                  value={gridSize}
                  min={8}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  type="number"
                  name="size"
                  id="size"
                />
              </label>

              <label htmlFor="mines">
                <span>Configura la cantidad de minas</span>
                <input
                  className="border ml-2 p-2 w-12 rounded-sm"
                  value={mines}
                  min={8}
                  max={gridSize - 10}
                  onChange={(e) => setMines(parseInt(e.target.value))}
                  type="number"
                  name="mines"
                  id="mines"
                />
              </label>

              <span>Casillas disponibles {availableCells}</span>
            </section>
          )
          : ''
      }

      <section className="py-8 mx-auto">

        {
          !lose && !win
            ? grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {
                  row.map((item) => (
                    <button
                      key={item.id}
                      className={`w-12 h-12 border border-gray-500 rounded-sm ${item.clicked ? 'bg-slate-600' : 'bg-slate-400 hover:bg-slate-500'}`}
                      onClick={(e) => handleClick(e, item)}
                      // right clic property
                      onContextMenu={(e) => handleClick(e, item)}
                    >
                      {item.flagged ? '🕯️' : item.clicked ? (item.pumpking ? '🎃' : item.around) : ''}
                    </button>
                  ))
                }
              </div>
            ))
            : (
              lose ? (
                <>
                  {handleLose()}
                  <span className="text-center text-md text-red-700 semi-bold">Perdiste capo. Te quedaron {availableCells} casillas disponibles</span>
                </>
              ) : (
                <span className="text-center text-md text-green-700 semi-bold">¡Ganaste! idolo bestia maestro distinto.</span>
              )
            )
        }

        <button
          className='flex mx-auto mt-12 px-4 py-1 bg-blue-600 hover:bg-blue-500  rounded-sm'
          onClick={(e) => handleReset(e)}
        >
          Reset
        </button>

      </section>
      <footer className="text-center leading-[3rem] opacity-70">
        © {new Date().getFullYear()} booscaminas
      </footer>
    </main>
  )
}

export default App

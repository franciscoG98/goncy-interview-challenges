import { useEffect, useState } from "react"
import boo from '/boo.mp3'

type Cell = { id: string, pumpking: boolean, clicked: boolean, around: number }

const initializeGrid = (size: number, mines: number) => {
  let grid: Cell[][] = []

  for (let j = 0; j < size; j++) {

    let line: Cell[] = []

    for (let i = 0; i < size; i++) {
      let placePumpking = Math.random() < (mines - grid.flat().filter(cell => cell.pumpking).length) / ((size * size) - (j * size + i))
      line.push({ id: `${j}${i}`, pumpking: placePumpking, clicked: false, around: 0 })
    }
    grid.push(line)
  }

  return grid
}

function App() {

  // Fácil: Aproximadamente 10 minas.
  // Intermedio: Aproximadamente 15-20 minas.
  // Difícil: Aproximadamente 30 minas

  const size = 10 // grid size (10x10)
  const mines = 10 // mines

  const [grid, setGrid] = useState<Cell[][]>([])
  const [lose, setLose] = useState<boolean>(false)
  // const [lose, setLose] = useState<boolean>(false)

  useEffect(() => {
    setGrid(initializeGrid(size, mines))
  }, [])

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setLose(false)
    setGrid(initializeGrid(size, mines))
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: Cell) => {
    e.preventDefault()

    toggleClicked(item)
    item.pumpking && setLose(true)
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

          // Verificar celdas vecinas y actualizar around
          neighbors.forEach(([r, c]) => {
            if (r >= 0 && r < size && c >= 0 && c < size && grid[r][c].pumpking) {
              around++
            }
          })

          return { ...cell, clicked: true, around }
        }
        return cell
      })
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
      <section className="py-8 mx-auto">

        {
          !lose
            ? grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {
                  row.map((item) => (

                    item.clicked
                      ? (
                        <button
                          key={item.id}
                          className='w-12 h-12 border rounded-sm bg-slate-500'
                          onClick={(e) => handleClick(e, item)}
                        >
                          {item.pumpking ? '🎃' : item.around}
                        </button>
                      )
                      : (

                        <button
                          key={item.id}
                          className='w-12 h-12 bg-slate-400 hover:bg-red-500 border rounded-sm'
                          onClick={(e) => handleClick(e, item)}
                        >
                          {item.pumpking && item.clicked ? '🎃' : ""}
                        </button>
                      )
                  ))
                }
              </div>
            ))
            : <span className="text-center text-md text-red-700 semi-bold">Perdiste capo.</span>
        }

        {
          lose ? handleLose() : ''
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

function init() {

  const grid = document.querySelector('.grid')

  const width = 9
  const mines = 10
  const cellCount = width * width
  let cells = []

  // * Grid
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
      cell.classList.add('covered')
    }
  }
  createGrid()
  console.log('cells', cells)

  // * Creating random Mines


  // * Number Logic based on mines


  // * Game Start


  // * Game Over


  // * Player clicks a cell
  function clickCell(event) {
    event.target.classList.add('uncovered')
  }

  // * Player flags a cell
  function flagCell(event) {
    event.target.classList.add('flagged')
  }

  // * Event Listeners
  cells.forEach(cell => {
    cell.addEventListener('click', clickCell)
  })

  cells.forEach(cell => {
    cell.addEventListener('contextmenu', flagCell)
  })

}

window.addEventListener('DOMContentLoaded', init)
function init() {

  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const title = document.querySelector('h1')

  const width = 9
  const mines = 10
  const cellCount = width * width
  const cells = []

  // * Game Start
  function startGame() {
    start.classList.add('hidden')
    grid.classList.remove('hidden')
    createGrid()

    // * Player clicks a cell
    function clickCell(event) {
      if (event.target.classList.contains('mine')) {
        gameOver()
      } else {
        event.target.classList.add('uncovered')
      }
    }

    // * Player flags a cell
    function flagCell(event) {
      event.target.classList.toggle('flagged')
      event = event || window.event
      if (event.stopPropagation) {
        event.stopPropagation()
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
    }
    
    // * Number Logic based on mines


    // * Game Event Listeners
    cells.forEach(cell => {
      cell.addEventListener('click', clickCell)
    })
    cells.forEach(cell => {
      cell.addEventListener('contextmenu', flagCell)
    })
  }

  // * Grid
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
      cell.classList.add('covered') 
    }
    for (let j = 0; j < mines; j++) {
      cells[j].classList.add('mine')
    } 
    shuffleCells(cells)
  }
  
  // * Creating random Mines
  function shuffleCells(cells) {
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = cells[i]
      cells[i] = cells[j]
      cells[j] = temp
    }
  }
  
  // * Game Over
  function gameOver() {
    cells.forEach(cell => {
      cell.classList.remove('flagged')
      cell.classList.add('uncovered')
      cells.forEach(mine => {
        if (mine.classList.contains('mine')) {
          mine.classList.add('mine-clicked')
        }
      })
      title.innerHTML = 'Game Over'
    })
  }

  // * Event Listeners
  start.addEventListener('click', startGame)

  


}

window.addEventListener('DOMContentLoaded', init)
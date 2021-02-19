function init() {

  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const title = document.querySelector('h1')
  const reset = document.querySelector('.reset')

  const width = 9
  const mines = 10
  const cellCount = width * width
  const cells = []
  let randomMines = []
  const safeCells = []

  // * Game Start
  function startGame() {
    start.classList.add('hidden')
    grid.classList.remove('hidden')
    createGrid()

    // * Player clicks a cell
    function clickCell(event) {
      if (event.target.classList.contains('flagged')) {
        return
      } else if (event.target.classList.contains('mine')) {
        gameOver()
      } else if (event.target.classList.contains('blank')) {
        blankCell()
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
    
    // * Game Event Listeners
    cells.forEach(cell => {
      cell.addEventListener('click', clickCell)
    })
    cells.forEach(cell => {
      cell.addEventListener('contextmenu', flagCell)
    })
  }

  // * Grid
  // create shuffled array
  function createGrid() {
    for (let i = 0; i < mines; i++) {
      const mine = document.createElement('div')
      randomMines.push(mine)
      randomMines[i].classList.add('mine') 
    }
    for (let i = 0; i < cellCount - mines; i++) {
      const safe = document.createElement('div')
      safeCells.push(safe)
    }
    randomMines = randomMines.concat(safeCells)
    shuffleCells(randomMines)

    // add shuffled array to grid
    for (let i = 0; i < cellCount; i++) {
      grid.appendChild(randomMines[i])
      cells.push(randomMines[i])
    }

    // add blank & number classes to non-mine cells
    
  }
  
  // * Creating random Mines
  function shuffleCells(cells) {
    for (let i = 0; i < cells.length; i++) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = cells[i]
      cells[i] = cells[j]
      cells[j] = temp
    }
  }

  // * Number Logic based on mines
    


  // * If blank cell, reveal surrounding blank cells
  function blankCell() {

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
      reset.classList.remove('hidden')
    })
  }

  // * Reset Game
  function resetGame() {
    window.location.reload()
  }

  // * Event Listeners
  start.addEventListener('click', startGame)

  reset.addEventListener('click', resetGame)

}

window.addEventListener('DOMContentLoaded', init)
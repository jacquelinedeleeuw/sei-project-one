function init() {

  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const title = document.querySelector('h1')
  const reset = document.querySelector('.reset')
  const flag = document.querySelector('.flag')

  const width = 10
  const mines = 10
  const cellCount = width * width
  const cells = []
  let randomMines = []
  const safeCells = []
  let testBlankCell

  // * Game Start
  function startGame() {
    start.classList.add('hidden')
    grid.classList.remove('hidden')
    flag.classList.remove('hidden')
    createGrid()

    // * Player clicks a cell
    function clickCell(event) {
      if (event.target.classList.contains('uncovered')) {
        return
      } else if (flag.classList.contains('flagging')) {
        event.target.classList.toggle('flagged')
        return
      } else if (event.target.classList.contains('flagged')) {
        return
      } else if (event.target.classList.contains('mine')) {
        gameOver()
      } else if (event.target.classList.contains('safe') && event.target.value === 0) {
        event.target.classList.add('uncovered')
        testBlankCell = cells.indexOf(event.target)
        blankCell()
      } else {
        event.target.classList.add('uncovered')
        event.target.innerHTML = event.target.value
      }
    }

    // * Player flags a cell
    function flagCell(event) {
      event = event || window.event
      if (event.stopPropagation) {
        event.stopPropagation()
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
      if (event.target.classList.contains('uncovered')) {
        return
      } else {
        event.target.classList.toggle('flagged')
      }
    }

    function flagCells() {
      flag.classList.toggle('flagging')
    }
    
    // * Game Event Listeners
    cells.forEach(cell => {
      cell.addEventListener('click', clickCell)
    })
    cells.forEach(cell => {
      cell.addEventListener('contextmenu', flagCell)
    })
    flag.addEventListener('click', flagCells)
  }


  // * Grid
  // create shuffled array
  function createGrid() {
    for (let i = 0; i < mines; i++) {
      const mine = document.createElement('div')
      randomMines.push(mine)
      randomMines[i].classList.add('mine')
      // randomMines[i].classList.add('mine-clicked')
    }
    for (let i = 0; i < cellCount - mines; i++) {
      const safe = document.createElement('div')
      safeCells.push(safe)
      safeCells[i].classList.add('safe')
      safeCells[i].value = 0
    }
    randomMines = randomMines.concat(safeCells)
    shuffleCells(randomMines)

    // add shuffled array to grid
    for (let i = 0; i < cellCount; i++) {
      grid.appendChild(randomMines[i])
      cells.push(randomMines[i])
    }

    // add blank & number classes to non-mine cells
    numberCell()
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
  function numberCell() {
    for (let i = 0; i < cellCount; i++) {
      const left = i - 1
      const right = i + 1
      const top = i - width
      const bottom = i + width
      const leftTop = i - 1 - width
      const rightTop = i + 1 - width
      const leftBottom = i - 1 + width
      const rightBottom = i + 1 + width
      if (cells[i].classList.contains('mine')) {
        cells[i].value = 0
      } else {
        if (i % width !== width - 1 && cells[right].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i % width !== 0 && cells[left].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i >= width && cells[top].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i < cellCount - width && cells[bottom].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i % width !== 0 && i >= width && cells[leftTop].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i % width !== width - 1 && i >= width && cells[rightTop].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i % width !== 0 && i < cellCount - width && cells[leftBottom].classList.contains('mine')) {
          cells[i].value += 1
        }
        if (i % width !== width - 1 && i < cellCount - width && cells[rightBottom].classList.contains('mine')) {
          cells[i].value += 1
        }
      }
    }
  }

  // * If blank cell, reveal surrounding blank cells
  function blankCell() {
    const testBlankCells = [testBlankCell]
    while (testBlankCells.length > 0) {
      console.log('test blank cells top', testBlankCells)
  
      // check to the left
      if (testBlankCell % width !== 0 && cells[testBlankCell - 1].classList.contains('safe')) {
        cells[testBlankCell - 1].classList.add('uncovered')
        if (cells[testBlankCell - 1].value > 0) {
          cells[testBlankCell - 1].innerHTML = cells[testBlankCell - 1].value
        } else {
          testBlankCells.push(testBlankCell - 1)
        }
      }
  
      // // ? setTimeout?
      // // check to the right
      console.log('test right', testBlankCell)
      // if (testBlankCell % width !== width - 1 && cells[testBlankCell + 1].classList.contains('safe')) {
      //   cells[testBlankCell + 1].classList.add('uncovered')
      //   if (cells[testBlankCell + 1].value > 0) {
      //     cells[testBlankCell + 1].innerHTML = cells[testBlankCell + 1].value
      //   } else {
      //     testBlankCells.push(testBlankCell + 1)
      //   }
      // }
  
      // // check top
      // if (testBlankCell >= width && cells[testBlankCell - width].classList.contains('safe')) {
      //   cells[testBlankCell - width].classList.add('uncovered')
      //   if (cells[testBlankCell - width].value > 0) {
      //     cells[testBlankCell - width].innerHTML = cells[testBlankCell - width].value
      //   } else {
      //     testBlankCells.push(testBlankCell - width)
      //   }
      // }
  
      // // check bottom
      // if (testBlankCell < cellCount - width && cells[testBlankCell + width].classList.contains('safe')) {
      //   cells[testBlankCell + width].classList.add('uncovered')
      //   if (cells[testBlankCell + width].value > 0) {
      //     cells[testBlankCell + width].innerHTML = cells[testBlankCell + width].value
      //   } else {
      //     testBlankCells.push(testBlankCell + width)
      //   }
      // }
      testBlankCells.shift()
      testBlankCell = testBlankCells[0]
      console.log(testBlankCell)
      console.log(testBlankCells)
    }    
  }
    
  // * Game Over
  function gameOver() {
    cells.forEach(cell => {
      cell.classList.remove('flagged')
      cell.classList.add('uncovered')
      if (cell.value > 0) {
        cell.innerHTML = cell.value
      }
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
    // change to play new game
  }

  // * Event Listeners
  start.addEventListener('click', startGame)

  reset.addEventListener('click', resetGame)

}

window.addEventListener('DOMContentLoaded', init)
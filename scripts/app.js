function init() {

  const gameLevels = document.querySelectorAll('.level')
  const grid = document.querySelector('.grid')
  const title = document.querySelector('h1')
  const reset = document.querySelector('.reset')
  const flag = document.querySelector('.flag')
  const timer = document.querySelector('.timer')
  const gameLevel = document.querySelector('.levels')
  const easy = document.querySelector('.easy')
  const audio = document.querySelector('audio')

  let width = 9
  const height = 9
  const mines = 10
  let cellCount = width * height
  let cells = []
  let randomMines = []
  let safeCells = []
  let testBlankCell
  let gameTimer = 0
  let counter = 0
  let uncoveredCells
  
  // * Game Start
  // ? 1st click never a mine
  // ? ScoreBoard

  createGrid(9, 9, 10)

  function startGame(event) {
    if (event.target.classList.contains('easy')) {
      event.target.classList.add('neon')
      grid.classList.add('easyGame')
      startTimer()
    } else if (event.target.classList.contains('medium')) {
      easy.classList.remove('neon')
      event.target.classList.add('neon')
      grid.classList.add('mediumGame')
      for (let i = 0; i < (width * height); i++) {
        grid.removeChild(randomMines[i])
      }
      cells = []
      randomMines = []
      safeCells = []
      createGrid(16, 16, 40)
      startTimer()
    } else if (event.target.classList.contains('hard')) {
      easy.classList.remove('neon')
      event.target.classList.add('neon')
      grid.classList.add('hardGame')
      for (let i = 0; i < (width * height); i++) {
        grid.removeChild(randomMines[i])
      }
      cells = []
      randomMines = []
      safeCells = []
      createGrid(30, 16, 99)
      startTimer()
    }
    cells.forEach(cell => {
      cell.addEventListener('click', clickCell)
    })
    cells.forEach(cell => {
      cell.addEventListener('contextmenu', flagCell)
    })
  }

  // * Grid
  // create shuffled array
  function createGrid(width, height, mines) {
    
    for (let i = 0; i < (width * height) - mines; i++) {
      const safe = document.createElement('div')
      safeCells.push(safe)
      safeCells[i].classList.add('safe')
      safeCells[i].value = 0
      if (grid.classList.contains('mediumGame')) {
        safeCells[i].classList.add('medium')
      }
      if (grid.classList.contains('hardGame')) {
        safeCells[i].classList.add('hard')
      }
    }
    for (let i = 0; i < mines; i++) {
      const mine = document.createElement('div')
      randomMines.push(mine)
      randomMines[i].classList.add('mine')
      randomMines[i].classList.add('mine-clicked')
      if (grid.classList.contains('mediumGame')) {
        randomMines[i].classList.add('medium')
      }
      if (grid.classList.contains('hardGame')) {
        randomMines[i].classList.add('hard')
      }
    }
    randomMines = randomMines.concat(safeCells)

    // * Shuffling Mines
    for (let i = 0; i < randomMines.length; i++) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = randomMines[i]
      randomMines[i] = randomMines[j]
      randomMines[j] = temp
    }
    
    // add shuffled array to grid
    for (let i = 0; i < (width * height); i++) {
      grid.appendChild(randomMines[i])
      cells.push(randomMines[i])
    }
    // Number Logic based on mines
    if (grid.classList.contains('mediumGame')) {
      width = 16
      height = 16
      cellCount = width * height
    } else if (grid.classList.contains('hardGame')) {
      width = 16
      height = 30
      cellCount = width * height
    }
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

  // * Blank cell logic
  function blankCell() {
    if (grid.classList.contains('mediumGame') || grid.classList.contains('hardGame')) {
      width = 16
    }
    const testBlankCells = [testBlankCell]
    const alreadyChecked = []
    while (testBlankCells.length > 0) {
      
      // check to the left
      if (testBlankCell % width !== 0 && cells[testBlankCell - 1].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1)) {
        cells[testBlankCell - 1].classList.add('uncovered')
        if (cells[testBlankCell - 1].value > 0) {
          cells[testBlankCell - 1].innerHTML = cells[testBlankCell - 1].value
        } else {
          testBlankCells.push(testBlankCell - 1)
        }
        alreadyChecked.push(testBlankCell - 1)
      }
    
      // check top left
      if (testBlankCell % width !== 0 && testBlankCell >= width && cells[testBlankCell - 1 - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1 - width)) {
        cells[testBlankCell - 1 - width].classList.add('uncovered')
        if (cells[testBlankCell - 1 - width].value > 0) {
          cells[testBlankCell - 1 - width].innerHTML = cells[testBlankCell - 1 - width].value
        } else {
          testBlankCells.push(testBlankCell - 1 - width)
        }
      }
    
      // check top
      if (testBlankCell >= width && cells[testBlankCell - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - width)) {
        cells[testBlankCell - width].classList.add('uncovered')
        if (cells[testBlankCell - width].value > 0) {
          cells[testBlankCell - width].innerHTML = cells[testBlankCell - width].value
        } else {
          testBlankCells.push(testBlankCell - width)
        }
        alreadyChecked.push(testBlankCell - width)
      }
    
      // check top right
      if (testBlankCell % width !== width - 1 && testBlankCell >= width && cells[testBlankCell + 1 - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1 - width)) {
        cells[testBlankCell + 1 - width].classList.add('uncovered')
        if (cells[testBlankCell + 1 - width].value > 0) {
          cells[testBlankCell + 1 - width].innerHTML = cells[testBlankCell + 1 - width].value
        } else {
          testBlankCells.push(testBlankCell + 1 - width)
        }
      }
          
      // check to the right
      if (testBlankCell % width !== width - 1 && cells[testBlankCell + 1].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1)) {
        cells[testBlankCell + 1].classList.add('uncovered')
        if (cells[testBlankCell + 1].value > 0) {
          cells[testBlankCell + 1].innerHTML = cells[testBlankCell + 1].value
        } else {
          testBlankCells.push(testBlankCell + 1)
        }
        alreadyChecked.push(testBlankCell + 1)
      }
    
      // check bottom right
      if (testBlankCell % width !== width - 1 && testBlankCell < cellCount - width && cells[testBlankCell + 1 + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1 + width)) {
        cells[testBlankCell + 1 + width].classList.add('uncovered')
        if (cells[testBlankCell + 1 + width].value > 0) {
          cells[testBlankCell + 1 + width].innerHTML = cells[testBlankCell + 1 + width].value
        } else {
          testBlankCells.push(testBlankCell + 1 + width)
        }
      }
    
      // check bottom
      if (testBlankCell < cellCount - width && cells[testBlankCell + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + width)) {
        cells[testBlankCell + width].classList.add('uncovered')
        if (cells[testBlankCell + width].value > 0) {
          cells[testBlankCell + width].innerHTML = cells[testBlankCell + width].value
        } else {
          testBlankCells.push(testBlankCell + width)
        }
        alreadyChecked.push(testBlankCell + width)
      }
    
      // check bottom left
      if (testBlankCell % width !== 0 && testBlankCell < cellCount - width && cells[testBlankCell - 1 + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1 + width)) {
        cells[testBlankCell - 1 + width].classList.add('uncovered')
        if (cells[testBlankCell - 1 + width].value > 0) {
          cells[testBlankCell - 1 + width].innerHTML = cells[testBlankCell - 1 + width].value
        } else {
          testBlankCells.push(testBlankCell - 1 + width)
        }
      }
    
      testBlankCells.shift()
      testBlankCell = testBlankCells[0]
    }    
  }

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
      return
    } else if (event.target.classList.contains('safe') && event.target.value === 0) {
      event.target.classList.add('uncovered')
      testBlankCell = cells.indexOf(event.target)
      // audio.src = './assets/Woosh-Mark_DiAngelo-4778593.mp3'
      // audio.play()
      blankCell()
      uncoveredCells = 0
      cells.forEach(cell => {
        if (cell.classList.contains('safe') && cell.classList.contains('uncovered')) {
          uncoveredCells++
          if (uncoveredCells === cellCount - mines) {
            gameWon()
          }
        }
      })
    } else {
      event.target.classList.add('uncovered')
      event.target.innerHTML = event.target.value
      uncoveredCells = 0
      cells.forEach(cell => {
        if (cell.classList.contains('safe') && cell.classList.contains('uncovered')) {
          uncoveredCells++
          if (uncoveredCells === cellCount - mines) {
            gameWon()
          }
        }
      })
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
    flag.classList.toggle('neon')
  }
  
  // * Timer
  function startTimer() {
    title.classList.add('neon')
    setTimeout(() => {
      title.classList.remove('neon')
      audio.src = 'assets/Fizzle-SoundBible.com-1439537520.mp3'
      audio.play()
    }, 500)
    setTimeout(() => {
      title.classList.add('neon')
    }, 800)
    timer.classList.add('neon')  
    flag.classList.remove('hidden')
    timer.innerHTML = counter
    gameTimer = setInterval(() => {
      counter++
      timer.innerHTML = counter
      grid.removeEventListener('click', startTimer)
    }, 1000)
  
  }

  // * Game Won
  function gameWon() {
    cells.forEach(mine => {
      if (mine.classList.contains('mine')) {
        mine.classList.add('mine-clicked')
      }
    })
    title.innerHTML = 'You won!'
    reset.classList.remove('hidden')
    flag.classList.add('hidden')
    title.classList.add('animate__heartBeat')
    clearInterval(gameTimer)
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
    })

    title.innerHTML = 'Game Over'
    reset.classList.remove('hidden')
    reset.classList.add('neon')
    flag.classList.add('hidden')
    title.classList.add('animate__bounceIn')
    title.classList.add('game-over')
    clearInterval(gameTimer)
  }

  // * Reset Game
  function resetGame() {
    window.location.reload()
  }

  // * Event Listeners
  cells.forEach(cell => {
    cell.addEventListener('click', clickCell)
  })
  cells.forEach(cell => {
    cell.addEventListener('contextmenu', flagCell)
  })
  flag.addEventListener('click', flagCells)

  reset.addEventListener('click', resetGame)

  grid.addEventListener('click', startTimer)
  
  gameLevels.forEach(level => {
    level.addEventListener('click', startGame)
  })
}

window.addEventListener('DOMContentLoaded', init)
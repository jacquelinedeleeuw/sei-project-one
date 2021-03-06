function init() {

  // * Variables
  const gameLevels = document.querySelectorAll('.level')
  const grid = document.querySelector('.grid')
  const title = document.querySelector('h1')
  const reset = document.querySelector('.reset')
  const flag = document.querySelector('.flag')
  const timer = document.querySelector('.timer')
  const easy = document.querySelector('.easy')
  const medium = document.querySelector('.medium')
  const hard = document.querySelector('.hard')
  const audio = document.querySelector('audio')
  const leaderboard = document.querySelector('.leaderboard')
  const pickLevel = document.querySelector('.pick-level')

  let width = 9
  let height = 9
  const mines = 10
  let cellCount = width * height
  const cells = []
  let randomMines = []
  const safeCells = []
  const extraCells = []
  let testBlankCell
  let gameTimer = 0
  let counter = 0
  let uncoveredCells
  const keyClass = 'key'
  let keyCurrentPosition = 0
  let firstCell = true
  
  // * Game Start
  function chooseLevel(event) {
    if (event.target.classList.contains('easy')) {
      grid.classList.remove('startMedium')
      grid.classList.remove('startHard')
      grid.classList.add('start')
    } else if (event.target.classList.contains('medium')) {
      grid.classList.remove('start')
      grid.classList.remove('startHard')
      grid.classList.add('startMedium')
    } else if (event.target.classList.contains('hard')) {
      grid.classList.remove('start')
      grid.classList.remove('startMedium')
      grid.classList.add('startHard')
    }
  }

  function startGame(event) {
    pickLevel.classList.remove('font-effect-neon')
    gameLevels.forEach(level => {
      level.removeEventListener('mouseenter', chooseLevel)
    })
    gameLevels.forEach(level => {
      level.removeEventListener('click', startGame)
    })
    if (event.target.classList.contains('easy')) {
      grid.classList.add('easyGame')
      reset.classList.remove('hidden')
      startTimer()
      setTimeout(() => {
        createGrid(9, 9, 10)
      }, 500)
      setTimeout(() => {
        grid.classList.remove('start')
      }, 1500)
    } else if (event.target.classList.contains('medium')) {
      grid.classList.add('mediumGame')
      reset.classList.remove('hidden')
      startTimer()
      setTimeout(() => {
        createGrid(16, 16, 40)
      }, 500)
      setTimeout(() => {
        grid.classList.remove('startMedium')
      }, 1500)
    } else if (event.target.classList.contains('hard')) {
      grid.classList.add('hardGame')
      reset.classList.remove('hidden')
      startTimer()
      setTimeout(() => {
        createGrid(30, 16, 99)
      }, 500)
      setTimeout(() => {
        grid.classList.remove('startHard')
      }, 1500)
    }
    setTimeout(() => {
      cells.forEach(cell => {
        cell.addEventListener('click', clickCell)
      })
      cells.forEach(cell => {
        cell.addEventListener('contextmenu', flagCell)
      })
    }, 1000)
    
    setTimeout(() => {
      setInterval(() => {
        title.classList.remove('font-effect-neon')
        timer.classList.remove('font-effect-neon') 
        if (grid.classList.contains('easyGame')) {
          easy.classList.remove('font-effect-neon')
        } else if (grid.classList.contains('mediumGame')) {
          medium.classList.remove('font-effect-neon')
        } else if (grid.classList.contains('hardGame')) {
          hard.classList.remove('font-effect-neon')
        }
        if (flag.classList.contains('flagging')) {
          flag.classList.remove('font-effect-neon')
        }
        if (!leaderboard.classList.contains('hidden')) {
          leaderboard.classList.remove('font-effect-neon')
        }
        if (reset.classList.contains('font-effect-neon')) {
          reset.classList.remove('font-effect-neon')
        }
        audio.src = './assets/random-fizzle.mp3'
        audio.play()
        setTimeout(() => {
          title.classList.add('font-effect-neon')
          timer.classList.add('font-effect-neon')
          if (grid.classList.contains('easyGame')) {
            easy.classList.add('font-effect-neon')
          } else if (grid.classList.contains('mediumGame')) {
            medium.classList.add('font-effect-neon')
          } else if (grid.classList.contains('hardGame')) {
            hard.classList.add('font-effect-neon')
          }
          if (flag.classList.contains('flagging')) {
            flag.classList.add('font-effect-neon')
          }
          if (!leaderboard.classList.contains('hidden')) {
            leaderboard.classList.add('font-effect-neon')
          }
          if (title.innerHTML === 'Game Over' || title.innerHTML === 'Game Won' || title.innerHTML === 'Leaderboard') {
            reset.classList.add('font-effect-neon')
          }
        }, 200)
      }, Math.floor(Math.random() * (12000 - 5000) + 5000))
    }, 5000)
  }

  // * Grid
  // create shuffled array
  function createGrid(width, height, mines) {
    for (let i = 0; i < (width * height) - mines - 3; i++) {
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
    for (let i = 0; i < 3; i++) {
      const safe = document.createElement('div')
      extraCells.push(safe)
      extraCells[i].classList.add('safe')
      extraCells[i].value = 0
    }
    for (let i = 0; i < mines; i++) {
      const mine = document.createElement('div')
      randomMines.push(mine)
      randomMines[i].classList.add('mine')
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
    randomMines = randomMines.concat(extraCells)
    
    // add shuffled array to grid
    for (let i = 0; i < (width * height); i++) {
      grid.appendChild(randomMines[i])
      cells.push(randomMines[i])
    }
    numberLogic()
  }

  function addKey(position) {
    cells[position].classList.add(keyClass)
  }

  function removeKey(position) {
    cells[position].classList.remove(keyClass)
  }

  function handleKey(event) {
    addKey(keyCurrentPosition)
    if (grid.classList.contains('mediumGame')) {
      width = 16
      height = 16
      cellCount = width * height
    } else if (grid.classList.contains('hardGame')) {
      width = 16
      height = 30
      cellCount = width * height
    }
    const key = event.keyCode
    if (key === 32) {
      if (firstCell === true && cells[keyCurrentPosition].classList.contains('mine')) {
        cells[keyCurrentPosition].classList.remove('mine')
        cells[keyCurrentPosition].classList.remove('mine-clicked')
        cells[keyCurrentPosition].classList.add('safe')
        cells[cells.length - 1].classList.add('mine')
        cells[cells.length - 1].classList.remove('safe')
        cells.forEach(cell => {
          cell.value = 0
        })
        numberLogic()
        firstCell = false
      }
      if (cells[keyCurrentPosition].classList.contains('uncovered')) {
        return
      } else if (flag.classList.contains('flagging')) {
        cells[keyCurrentPosition].classList.toggle('flagged')
        return
      } else if (cells[keyCurrentPosition].classList.contains('flagged')) {
        return
      } else if (cells[keyCurrentPosition].classList.contains('mine')) {
        gameOver()
        return
      } else if (cells[keyCurrentPosition].classList.contains('safe') && cells[keyCurrentPosition].value === 0) {
        cells[keyCurrentPosition].classList.add('uncovered')
        testBlankCell = keyCurrentPosition
        audio.src = './assets/woosh.mp3'
        audio.play()
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
        cells[keyCurrentPosition].classList.add('uncovered')
        cells[keyCurrentPosition].innerHTML = cells[keyCurrentPosition].value
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
    if (key === 17) {
      if (cells[keyCurrentPosition].classList.contains('uncovered')) {
        return
      } else {
        cells[keyCurrentPosition].classList.toggle('flagged')
      }
    }
    removeKey(keyCurrentPosition)
    if (key === 39 && keyCurrentPosition % width !== width - 1) {
      keyCurrentPosition++
    } else if (key === 37 && keyCurrentPosition % width !== 0) {
      keyCurrentPosition--
    } else if (key === 38 && keyCurrentPosition >= width) {
      keyCurrentPosition -= width
    } else if (key === 40 && keyCurrentPosition + width <= cellCount - 1) {
      keyCurrentPosition += width
    } 
    addKey(keyCurrentPosition)
  }
  // Number Logic based on mines
  function numberLogic() {
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
      let testLeft = true
      let testLeftTop = true
      let testTop = true
      let testRightTop = true
      let testRight = true
      let testRightBottom = true
      let testBottom = true
      let testLeftBottom = true
      
      // check to the left
      if (testBlankCell % width !== 0 && cells[testBlankCell - 1].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1) && testLeft === true && !cells[testBlankCell - 1].classList.contains('flagged')) {
        cells[testBlankCell - 1].classList.add('uncovered')
        if (cells[testBlankCell - 1].value > 0) {
          cells[testBlankCell - 1].innerHTML = cells[testBlankCell - 1].value
        } else {
          testBlankCells.push(testBlankCell - 1)
        }
        alreadyChecked.push(testBlankCell - 1)
      } else {
        testLeft = false
      }

      // check top left
      if (testBlankCell % width !== 0 && testBlankCell >= width && cells[testBlankCell - 1 - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1 - width) && testLeftTop === true && !cells[testBlankCell - 1 - width].classList.contains('flagged')) {
        cells[testBlankCell - 1 - width].classList.add('uncovered')
        if (cells[testBlankCell - 1 - width].value > 0) {
          cells[testBlankCell - 1 - width].innerHTML = cells[testBlankCell - 1 - width].value
        } else {
          testBlankCells.push(testBlankCell - 1 - width)
        }
      } else {
        testLeftTop = false
      }
    
      // check top
      if (testBlankCell >= width && cells[testBlankCell - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - width) && testTop === true && !cells[testBlankCell - width].classList.contains('flagged')) {
        cells[testBlankCell - width].classList.add('uncovered')
        if (cells[testBlankCell - width].value > 0) {
          cells[testBlankCell - width].innerHTML = cells[testBlankCell - width].value
        } else {
          testBlankCells.push(testBlankCell - width)
        }
        alreadyChecked.push(testBlankCell - width)
      } else {
        testTop = false
      }
    
      // check top right
      if (testBlankCell % width !== width - 1 && testBlankCell >= width && cells[testBlankCell + 1 - width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1 - width) && testRightTop === true && !cells[testBlankCell + 1 - width].classList.contains('flagged')) {
        cells[testBlankCell + 1 - width].classList.add('uncovered')
        if (cells[testBlankCell + 1 - width].value > 0) {
          cells[testBlankCell + 1 - width].innerHTML = cells[testBlankCell + 1 - width].value
        } else {
          testBlankCells.push(testBlankCell + 1 - width)
        }
      } else {
        testRightTop = false
      }
          
      // check to the right
      if (testBlankCell % width !== width - 1 && cells[testBlankCell + 1].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1) && testRight === true && !cells[testBlankCell + 1].classList.contains('flagged')) {
        cells[testBlankCell + 1].classList.add('uncovered')
        if (cells[testBlankCell + 1].value > 0) {
          cells[testBlankCell + 1].innerHTML = cells[testBlankCell + 1].value
        } else {
          testBlankCells.push(testBlankCell + 1)
        }
        alreadyChecked.push(testBlankCell + 1)
      } else {
        testRight = false

      }
    
      // check bottom right
      if (testBlankCell % width !== width - 1 && testBlankCell < cellCount - width && cells[testBlankCell + 1 + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + 1 + width)  && testRightBottom === true && !cells[testBlankCell + 1 + width].classList.contains('flagged')) {
        cells[testBlankCell + 1 + width].classList.add('uncovered')
        if (cells[testBlankCell + 1 + width].value > 0) {
          cells[testBlankCell + 1 + width].innerHTML = cells[testBlankCell + 1 + width].value
        } else {
          testBlankCells.push(testBlankCell + 1 + width)
        }
      } else {
        testRightBottom = false
      }
    
      // check bottom
      if (testBlankCell < cellCount - width && cells[testBlankCell + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell + width) && testBottom === true && !cells[testBlankCell + width].classList.contains('flagged')) {
        cells[testBlankCell + width].classList.add('uncovered')
        if (cells[testBlankCell + width].value > 0) {
          cells[testBlankCell + width].innerHTML = cells[testBlankCell + width].value
        } else {
          testBlankCells.push(testBlankCell + width)
        }
        alreadyChecked.push(testBlankCell + width)
      } else {
        testBottom = false
      }
    
      // check bottom left
      if (testBlankCell % width !== 0 && testBlankCell < cellCount - width && cells[testBlankCell - 1 + width].classList.contains('safe') && !alreadyChecked.includes(testBlankCell - 1 + width) && testLeftBottom === true && !cells[testBlankCell - 1 + width].classList.contains('flagged')) {
        cells[testBlankCell - 1 + width].classList.add('uncovered')
        if (cells[testBlankCell - 1 + width].value > 0) {
          cells[testBlankCell - 1 + width].innerHTML = cells[testBlankCell - 1 + width].value
        } else {
          testBlankCells.push(testBlankCell - 1 + width)
        }
      } else {
        testLeftBottom = false
      }
    
      testBlankCells.shift()
      testBlankCell = testBlankCells[0]
    }    
  }

  // * Player clicks a cell
  function clickCell(event) {
    if (firstCell === true && event.target.classList.contains('mine')) {
      event.target.classList.remove('mine')
      event.target.classList.remove('mine-clicked')
      event.target.classList.add('safe')
      cells[cells.length - 1].classList.add('mine')
      cells[cells.length - 1].classList.remove('safe')
      cells.forEach(cell => {
        cell.value = 0
      })
      numberLogic()
      firstCell = false
    }
    firstCell = false
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
      audio.src = './assets/woosh.mp3'
      audio.play()
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

  function flagCells(event) {
    if (event.target.classList.contains('flagging')) {
      audio.src = './assets/button-off.mp3'
    } else {
      audio.src = './assets/click.mp3'
    }
    audio.play()
    flag.classList.toggle('font-effect-neon')
    flag.classList.toggle('flagging')
  }
  // * Timer
  function startTimer() {
    audio.src = './assets/click.mp3'
    audio.play()
    setTimeout(() => {
      audio.src = './assets/start-fizzle.mp3'
      audio.play()
    }, 400)
    title.classList.add('font-effect-neon')
    timer.classList.add('font-effect-neon')
    if (grid.classList.contains('easyGame')) {
      easy.classList.add('font-effect-neon')
    } else if (grid.classList.contains('mediumGame')) {
      medium.classList.add('font-effect-neon')
    } else if (grid.classList.contains('hardGame')) {
      hard.classList.add('font-effect-neon')
    }
    setTimeout(() => {
      title.classList.remove('font-effect-neon')
      timer.classList.remove('font-effect-neon') 
      if (grid.classList.contains('easyGame')) {
        easy.classList.remove('font-effect-neon')
      } else if (grid.classList.contains('mediumGame')) {
        medium.classList.remove('font-effect-neon')
      } else if (grid.classList.contains('hardGame')) {
        hard.classList.remove('font-effect-neon')
      }
    }, 300)
    setTimeout(() => {
      title.classList.add('font-effect-neon')
      timer.classList.add('font-effect-neon')
      if (grid.classList.contains('easyGame')) {
        easy.classList.add('font-effect-neon')
      } else if (grid.classList.contains('mediumGame')) {
        medium.classList.add('font-effect-neon')
      } else if (grid.classList.contains('hardGame')) {
        hard.classList.add('font-effect-neon')
      }
    }, 500)
    flag.classList.remove('hidden')
    timer.innerHTML = counter
    setTimeout(() => {
      gameTimer = setInterval(() => {
        counter++
        timer.innerHTML = counter
      }, 1000)
    }, 500)
  }

  // * Game Won
  function gameWon() {
    cells.forEach(mine => {
      if (mine.classList.contains('mine')) {
        mine.classList.add('mine-clicked')
      }
    })
    title.innerHTML = 'You won!'
    flag.classList.add('hidden')
    reset.classList.add('font-effect-neon')
    title.classList.add('animate__heartBeat')
    pickLevel.classList.add('hidden')
    clearInterval(gameTimer)
    setTimeout(() => {
      // * ScoreBoard
      let name = window.prompt('You won! Enter your name for the leaderboard', '')
      const value = counter
      grid.classList.add('hidden')
      timer.classList.add('hidden')
      gameLevels.forEach(level => {
        level.classList.add('hidden')
      })
      leaderboard.classList.remove('hidden')
      title.innerHTML = 'Leaderboard'
      if (name) {
        if (grid.classList.contains('easyGame')) {
          name = 'Easy - ' + name
        } else if (grid.classList.contains('mediumGame')) {
          name = 'Medium - ' + name
        } if (grid.classList.contains('hardGame')) {
          name = 'Hard - ' + name
        }
        localStorage.setItem(name, value)
      }
      for (let i = 0; i < localStorage.length; i++) {
        const name = localStorage.key(i)
        const score = localStorage.getItem(name)
        leaderboard.innerHTML += name + ' in ' + score + ' seconds' + '<br/>'
      }
    }, 2500)
  }
      
  // * Game Over
  function gameOver() {
    audio.src = './assets/explosion.mp3'
    audio.play()
    cells.forEach(mine => {
      if (mine.classList.contains('mine')) {
        mine.classList.add('mine-clicked')
        mine.classList.add('uncovered')
      }
    })
    event.target.classList.add('mine-explode')
    title.innerHTML = 'Game Over'
    reset.classList.add('font-effect-neon')
    flag.classList.add('hidden')
    title.classList.add('game-over')
    clearInterval(gameTimer)
  }

  // * Reset Game
  function resetGame() {
    reset.classList.add('font-effect-neon')
    audio.src = './assets/button-off.mp3'
    audio.play()
    setTimeout(() => {
      window.location.reload()
    }, 300)
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
  
  gameLevels.forEach(level => {
    level.addEventListener('click', startGame)
  })
  gameLevels.forEach(level => {
    level.addEventListener('mouseenter', chooseLevel)
  })
  document.addEventListener('keydown', handleKey)
}

window.addEventListener('DOMContentLoaded', init)
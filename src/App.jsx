import {useRef, useEffect, useState } from 'react'
function App() {

  const [snake, setSnake] = useState([{x:0,y:0}, {x:1,y:0}, {x:2,y:0}]);
  const [apple, setApple] = useState({x: 5, y:7})
  const [direction, setDirection] = useState({x:1, y:0})
  const [gameOver, setGameOver] = useState(false)

  const canvasRef = useRef(null)

  const board = {
      width : 17,
      height : 15
    }

  const directions = {
      ArrowDown: {x:0, y:1},
      ArrowUp: {x:0, y:-1},
      ArrowLeft: {x:-1, y:0},
      ArrowRight: {x:1, y:0}
    }
  
  const cheackColision = (snake) =>{
    let length = snake.length
    const head = snake[length - 1]
    const body = snake.slice(0, length - 1);
    
    console.log(body)
    

    if(head.x < 0 || head.x >= board.width  || head.y < 0 || head.y >= board.height ) {
      return true 
    }
    if (body.some (el => el.x === head.x && el.y === head.y)){
      return true
    }

    return false
  }

  const generateApple = (snake) => {
    let y,x 
    do{
      x = Math.round(Math.random()*(board.width -1));
      y = Math.round(Math.random()*(board.height -1))
    }
    while(snake.some(el=> el.x === x && el.y === y))
      return {x, y}
  }

  const changeDirection = (direction, newDirection) =>{
     
   if (
    direction.x + newDirection.x === 0 &&
    direction.y + newDirection.y === 0
    ) return direction
     
    return newDirection
  }
  

  const moveSnake = (snake, direction, apple)=>{
    const head = snake[snake.length - 1];
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    }
    const newSnake = [...snake, newHead];
    const eatApple = newHead.x === apple.x && newHead.y === apple.y;

    const result = {snake: null, colision: false, eatApple: eatApple  }

    result.snake = eatApple ? newSnake : newSnake.slice(1)

    if(cheackColision(result.snake)) result.colision = true 

    return result 
  }

  const resetGame = ()=>{
    setSnake([{x:0,y:0}, {x:1,y:0}, {x:2,y:0}]);
    setApple({x: 5, y:7})
    setDirection({x:1, y:0})
    setGameOver(false)
  }

  useEffect(()=>{
    if (gameOver) return
  const interval = setInterval(()=>{
     setSnake(prev => {
        const result = moveSnake(prev, direction, apple)
        console.log(result.colision)
        if(result.colision){
          clearInterval(interval)
         setGameOver(true)
        }

       if(result.eatApple){
        setApple(generateApple(result.snake))
      }
        return result.snake
     })
  },200)

  return ()=> clearInterval(interval)

},[direction, apple])

useEffect(() => {
  const handleKey = (e) => {
    const newDirection = directions[e.key]

    if(newDirection){
      setDirection(prev => changeDirection(prev, newDirection))
    }
  }

  window.addEventListener('keydown', handleKey)

  return () => {
    window.removeEventListener('keydown', handleKey)
  }

},[])


useEffect(()=>{
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')

  const size = 20

  // limpiar
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // dibujar snake
  snake.forEach(seg => {
    ctx.fillStyle = 'blue'
    ctx.fillRect(seg.x * size, seg.y * size, size, size)
  })

  // dibujar apple
  ctx.fillStyle = 'red'
  ctx.fillRect(apple.x * size, apple.y * size, size, size)

  
},[snake,apple])
  
  return (
    <>
      <main className='board'>
        <h1>Snake Game</h1>
        <section className='game'>
         <canvas ref={canvasRef} width={340} height={300} />
        </section>
        {gameOver && <div className='modal'>
          <h2>Game Over</h2>
          <button onClick={resetGame}>Reiniciar</button>
        </div>}
      </main>
    </>
  )
}

export default App

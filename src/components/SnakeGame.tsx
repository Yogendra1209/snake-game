import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 60;

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  const directionRef = useRef(direction);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(prev => !prev);
      return;
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, score, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
      <div className="w-full flex justify-between text-fuchsia-500 mb-2 border-b-2 border-cyan-500 pb-1 text-xl">
        <span>// SECTOR_GRID_ALPHA</span>
        <span className="animate-pulse">STATUS: {gameOver ? 'OFFLINE' : isPaused ? 'SUSPENDED' : 'ACTIVE'}</span>
      </div>
      
      <div 
        className="grid bg-black border-4 border-cyan-500 relative tear-effect"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: '100%',
          aspectRatio: '1/1',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
          const isSnake = snakeIndex !== -1;
          const isHead = snakeIndex === 0;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                w-full h-full border-[0.5px] border-cyan-900/30
                ${isHead ? 'bg-fuchsia-500 z-10' : ''}
                ${isSnake && !isHead ? 'bg-cyan-400' : ''}
                ${isFood ? 'bg-white animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]' : ''}
              `}
              style={isSnake && !isHead ? {
                opacity: Math.max(0.2, 1 - (snakeIndex / snake.length))
              } : {}}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-fuchsia-500 m-2">
            <div className="text-center glitch-neon-text">
              <h2 className="text-6xl text-fuchsia-500 mb-2">CRITICAL_FAILURE</h2>
              <p className="text-cyan-400 text-3xl mb-8">DATA_LOST: {score}</p>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-transparent text-fuchsia-500 border-4 border-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-none text-4xl"
              >
                [ REBOOT_SEQUENCE ]
              </button>
            </div>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 border-4 border-cyan-500 m-2">
            <h2 className="text-6xl text-cyan-400 glitch-neon-text animate-pulse">SYSTEM_HALT</h2>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-cyan-500 text-xl w-full flex justify-between border-t-2 border-fuchsia-500 pt-2">
        <span>INPUT: W,A,S,D / ARROWS</span>
        <span>INTERRUPT: SPACE</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import ScoreBoard from './ScoreBoard';

const Game = () => {
  const [gameStart, setGameStart] = useState(false); // Tracks the game start button, if clicked set to true
  const [score, setScore] = useState(0); // Tracks the score of the game
  const [highscore, setHighscore] = useState(() => {
    return Number(localStorage.getItem("highscore")) || 0; // Load highscore from localStorage
  }); 
  const [grid, setGrid] = useState(new Array(9).fill(false));
  const [roundTimer, setRoundTimer] = useState(30); // Set round timer (change number inside (x) for seconds)

  // Effect for mole spawning with dynamic speed
  useEffect(() => {
    if (!gameStart) return; // Don't run if the game hasn't started

    const highlightMole = () => {
      const newGrid = new Array(9).fill(false);
      const randomIndex = Math.floor(Math.random() * 9);
      newGrid[randomIndex] = true;
      setGrid(newGrid);
    };

    highlightMole(); // Initial mole

    // Adjust mole spawn speed based on score (higher score = faster mole changes)
    const spawnSpeed = Math.max(1000 - score * 50, 200); // Decrease interval, minimum 200ms
    const moleTimer = setInterval(highlightMole, spawnSpeed);

    return () => clearInterval(moleTimer);
  }, [gameStart, score]); // Runs when game starts or score updates

  // Effect for round timer countdown
  useEffect(() => {
    if (!gameStart || roundTimer <= 0) return;

    const timerInterval = setInterval(() => {
      setRoundTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameStart, roundTimer]);

  // Handle round end when timer hits 0
  useEffect(() => {
    if (roundTimer === 0) {
      setGameStart(false);
      
      // Update high score if the current score is higher
      setHighscore((prevHighscore) => {
        const newHighscore = Math.max(prevHighscore, score);
        localStorage.setItem("highscore", newHighscore); // Save highscore to localStorage
        return newHighscore;
      });

      alert(`Time's up! Final Score: ${score}`);
    }
  }, [roundTimer, score]);

  const handleMoleClick = (index) => {
    if (grid[index]) {
      setScore(score + 1);
    }
  };

  const startGame = () => {
    setGameStart(true);
    setScore(0); // Reset score
    setRoundTimer(30); // Reset timer to (x) seconds (you change it), (don't forget to change the top timer and this timer)
  };

  return (
    <div className="game">
      <h1>Whack-a-Mole</h1>
      <ScoreBoard score={score} />
      <p>High Score: {highscore}</p> {/* Display high score */}
      <p>Time Left: {roundTimer}s</p>
      {!gameStart ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <Grid grid={grid} onMoleClick={handleMoleClick} />
      )}
    </div>
  );
};

export default Game;

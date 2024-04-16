import React, { useState, useEffect } from "react";
import { getGameStats, updateGameStats } from "./api";

export const Game = () => {
  const [prevPoints, setPrevPoints] = useState(0);
  const [prevTaps, setPrevTaps] = useState(0);
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [taps, setTaps] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null); // State to keep the timeout reference
  const [gameData, setGameData] = useState({
    rank: 1,
    league: 1,
    currRechargeLvl: 1,
    currTurboLvl: 1,
  });

  useEffect(() => {
    if (energy < 100) {
      const interval = setInterval(() => {
        setEnergy((currentEnergy) =>
          currentEnergy < 100 ? currentEnergy + 1 : 100
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [energy]);

  const handleTap = () => {
    if (energy > 0) {
      setPoints((prev) => prev + 1);
      setEnergy((prev) => Math.max(0, prev - 1));
      setTaps((prev) => prev + 1);

      // Clear existing timeout and set a new one
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        sendGameStats();
      }, 2000); // Adjust the time as necessary for your game's design
      setTimeoutId(newTimeoutId);
    }
  };

  const sendGameStats = async () => {
    console.log("hello");

    const updatedGameStats = {
      coins: points,
      numberOfTaps: taps,
      energyBoosterLevel: energy,
    };
    try {
      const response = await updateGameStats(updatedGameStats);
      console.log(response);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const response = await getGameStats();
        console.log(response);
        const timeNow = Date.now();
        const timestamp = response.lastActivityTime;
        const date = new Date(timestamp);
        const secondsSinceLast = Math.floor((timeNow - date.getTime()) / 1000);
        const recoveredEnergy = Math.min(
          100,
          response.currentEnergyLevel +
            Math.min(secondsSinceLast, 100 - response.currentEnergyLevel)
        );

        setPrevPoints(response.coins);
        setPrevTaps(response.numberOfTaps);
        setEnergy(recoveredEnergy);
        setGameData({
          rank: response.game,
          league: response.league,
          currRechargeLvl: response.energyBoosterLevel,
          currTurboLvl: response.turboBoosterLevel,
        });
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchGameStats();
  }, []);

  return (
    <div>
      <h1>Tap Game</h1>
      <button onClick={handleTap} disabled={energy <= 0}>
        Tap Me!
      </button>
      <p>Points: {prevPoints + points}</p>
      <p>Energy: {energy}</p>
      <p>Taps: {prevTaps + taps}</p>
      <p>RechargeBoosterLvl: {gameData.currRechargeLvl}</p>
      <p>TurboBoosterLvl: {gameData.currTurboLvl}</p>
    </div>
  );
};

import React, { useState, useEffect } from "react";

export const Game = () => {
  const [prevPoints, setPrevPoints] = useState(0);
  const [prevTaps, setPrevTaps] = useState(0);
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const [taps, setTaps] = useState(0);
  const [currRechargeLvl, setCurrRechargeLvl] = useState(0);
  const [currTurboLvl, setCurrTurboLvl] = useState(0);

  useEffect(() => {
    if (energy < 100) {
      const interval = setInterval(() => {
        setEnergy((currentEnergy) => {
          const updatedEnergy = currentEnergy + 1;
          return updatedEnergy > 100 ? 100 : updatedEnergy;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [energy]);

  const handleTap = () => {
    if (energy > 0) {
      setPoints((prev) => prev + 1);
      const newEnergy = Math.max(0, energy - 1);
      setEnergy(newEnergy);
      setTaps((prev) => prev + 1);
    }
    setLastActiveTime(Date.now());
  };

  useEffect(() => {
    const storedPoints = parseInt(localStorage.getItem("points")) || 0;
    const storedEnergy = parseInt(localStorage.getItem("energy")) || 100;
    const storedTaps = parseInt(localStorage.getItem("taps")) || 100;
    const storedLastActive =
      parseInt(localStorage.getItem("lastActive")) || Date.now();
    const timeNow = Date.now();
    const secondsSinceLast = Math.floor((timeNow - storedLastActive) / 1000);
    const recoveredEnergy = Math.min(
      100,
      storedEnergy + Math.min(secondsSinceLast, 100 - storedEnergy)
    );
    const storedRecharge =
      parseInt(localStorage.getItem("rechargeLevel")) || 100;
    const storedTurbo = parseInt(localStorage.getItem("turboLevel")) || 100;
    setCurrRechargeLvl(storedRecharge);
    setCurrTurboLvl(storedTurbo);
    setPrevPoints(storedPoints);
    setEnergy(Math.max(0, recoveredEnergy));
    setLastActiveTime(storedLastActive);
    setPrevTaps(storedTaps);
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      console.log("I was called");

      localStorage.setItem("points", prevPoints + points);
      localStorage.setItem("energy", energy);
      localStorage.setItem("taps", prevTaps + taps);
      localStorage.setItem("lastActive", Date.now());
      localStorage.setItem("rechargeLevel", "1");
      localStorage.setItem("turboLevel", "1");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [
    prevPoints,
    points,
    energy,
    taps,
    prevTaps,
    currRechargeLvl,
    currTurboLvl,
  ]);

  return (
    <div>
      <h1>Tap Game</h1>
      <button onClick={handleTap} disabled={energy <= 0}>
        Tap Me!
      </button>
      <p>Points: {prevPoints + points}</p>
      <p>Energy: {energy}</p>
      <p>TurboLvl: {currTurboLvl}</p>
      <p>Taps: {prevTaps + taps}</p>
      <p>RechargeLvl: {currRechargeLvl}</p>
    </div>
  );
};

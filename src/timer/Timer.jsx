import React, { useContext, useEffect, useState, useRef } from "react";
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "./RadialSeparators"; // Assuming RadialSeparators is a custom component
import PlayButton from "./PlayButton"; // Assuming PlayButton is a custom component
import PauseButton from "./PauseButton"; // Assuming PauseButton is a custom component
import Settings from "./Settings"; // Assuming Settings is a custom component
import SettingsContext from "./SettingsContext"; // Assuming SettingsContext provides settings

const Timer = () => {
  const settingInfo = useContext(SettingsContext);
  const [isPause, setIsPause] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [mode, setMode] = useState('work'); // it can be work, break, null

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPause);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  function switchMode() {
    const nextMode = modeRef.current === 'work' ? 'break' : 'work';
    const nextSeconds = (nextMode === 'work' ? settingInfo.workMinutes : settingInfo.breakMinutes) * 60;
    setMode(nextMode);
    modeRef.current = nextMode;
    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;
  }

  function initTimer() {
    setSecondsLeft(settingInfo.workMinutes * 60);
  }

  useEffect(() => {
    initTimer();

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }
      tick();

      // Debugging: Log the percentage to verify updates
      console.log(`Percentage: ${Math.round(secondsLeft / (settingInfo.workMinutes * 60) * 100)}%`);
    }, 10);

    setSecondsLeft(settingInfo.workMinutes * 60);
    secondsLeftRef.current = settingInfo.workMinutes * 60;

    return () => clearInterval(interval);
  }, [settingInfo]);

  const totalSeconds = mode === 'work' ? settingInfo.workMinutes * 60 : settingInfo.breakMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds) * 100;

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const progressColor = mode === 'work' ? '#F8F4EC' : '#4aec8c'; // Red for work, green for break

  return (
    <div>
      <CircularProgressbarWithChildren
        value={percentage}
        text={`${minutes}:${seconds}`}
        strokeWidth={10}
        styles={buildStyles({
          textColor: "white",
          font: '',
          strokeLinecap: "butt",
          backgroundColor: "#333", // Set background color (optional)
          pathColor: progressColor,
        })}
      >
        <RadialSeparators
          count={12}
          style={{
            background: "#333",
            width: "2px",
            height: `${10}%`,
          }}
        />
      </CircularProgressbarWithChildren>
      <div>
        {isPause ? (
          <PlayButton onClick={() => { setIsPause(false); isPausedRef.current = false; }} />
        ) : (
          <PauseButton onClick={() => { setIsPause(true); isPausedRef.current = true; }} />
        )}
      </div>
      <Settings onClick={() => settingInfo.setShowSettings(true)} />
    </div>
  );
};

export default Timer;

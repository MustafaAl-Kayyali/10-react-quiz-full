import React, { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, secondsRemaining]);

  const safeSeconds = Math.max(secondsRemaining, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return (
    <div className="timer">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
export default Timer;

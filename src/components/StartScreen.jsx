import React from "react";

function StartScreen({ dispatch }) {
  return (
    <div className="start">
      <h2>Welome To react Quiz</h2>
      <h3>15 question to test your react mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;

import React from "react";

function Options({ question, dispatch, answer }) {
  const hasAnserwed = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          key={index}
          disabled={hasAnserwed}
          className={`btn btn-option ${index === answer ? "answer" : ""} 
          ${
            hasAnserwed
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() => {
            dispatch({ type: "newAnswer", payload: index });
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;

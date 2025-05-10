import { useEffect, useReducer } from "react";
import Error from "./components/Error";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Footer from "./components/Footer";
import NextButton from "./components/NextButton";
import FinishScreen from "./components/FinishScreen";
import Progress from "./components/Progress";
import Timer from "./components/Timer";

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active", secondsRemaining: 480 }; // start timer here
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 1 ? "finished" : state.status,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    default:
      return state;
  }
}

function App() {
  const [{ questions, status, answer, points, index, secondsRemaining }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data })) 
      .catch((err) => {
        console.error("Error fetching data:", err);
        dispatch({ type: "dataFailed" });
      });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              answer={answer}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {index < numQuestions - 1 ? (
                <NextButton
                  answer={answer}
                  dispatch={dispatch}
                  index={index}
                  numQuestions={numQuestions}
                />
              ) : (
                <button className="btn btn-ui" onClick={() => dispatch({ type: "finish" })}>Finish</button>
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} />
        )}
      </Main>
    </div>
  );
}

export default App;

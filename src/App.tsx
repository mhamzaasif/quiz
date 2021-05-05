import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { QuestionState, fetchQuizQuestions, Difficulty } from "./API";
import { GlobalStyles, Wrapper } from "./App.styles";

export type AnswerObject = {
	question: string;
	correct: boolean;
	answer: string;
	correctAnswer: string;
};
function App() {
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0);
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);

	const startTrivia = async () => {
		setLoading(true);
		setGameOver(false);
		const newQuestions = await fetchQuizQuestions(10, Difficulty.Medium);
		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	};
	const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
		console.log("callback");
		debugger;
		if (!gameOver) {
			const answer = e.currentTarget.textContent!;
			const correct = questions[number].correct_answer === answer;
			if (correct) setScore((prev) => prev + 1);
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer,
			};
			setUserAnswers((prev) => [...prev, answerObject]);
		}
	};
	const nextQuestion = () => {
		if (10 === number + 1) setGameOver(true);
		setNumber((prev) => prev + 1);
	};
	return (
		<>
			<GlobalStyles />
			<Wrapper className="App">
				<h1>React Quiz</h1>
				{gameOver || userAnswers.length === 10 ? (
					<button className="start" onClick={startTrivia}>
						Start
					</button>
				) : null}
				{!gameOver ? <p className="score">Score: {score}</p> : null}
				{loading ? <p>Loading Questions...</p> : null}
				{!loading && !gameOver && (
					<QuestionCard
						totalQuestions={10}
						questionNr={number + 1}
						question={questions[number].question}
						answers={questions[number].answers}
						userAnswer={userAnswers ? userAnswers[number] : undefined}
						callback={checkAnswer}
					/>
				)}
				{!gameOver &&
					!loading &&
					userAnswers.length === number + 1 &&
					number + 1 !== 10 && (
						<button className="next" onClick={nextQuestion}>
							Next Question
						</button>
					)}
			</Wrapper>
		</>
	);
}

export default App;

import React, { useState, useEffect } from 'react';
import questions from './data/questions.json';
import './Quiz.css';

interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
  answer: string;
}

interface Questions {
  questions: Question[];
}

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const currentQuestion: Question = questions.questions[currentQuestionIndex];
  const isLastQuestion: boolean = currentQuestionIndex === questions.questions.length - 1;

  function handleAnswerSelect(answerId: string) {
    setSelectedAnswerId(answerId);
  }

  function handleNextButtonClick() {
    if (!selectedAnswerId) {
      alert('답안을 선택해주세요.');
      return;
    }

    const isCorrect: boolean = selectedAnswerId === currentQuestion.answer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setSelectedAnswerId('');

    if (isLastQuestion) {
      const finalScore = isCorrect ? score + 1 : score;
      const confirmRestart = window.confirm(`최종 점수: ${finalScore}/${questions.questions.length}\n다시 풀겠습니까?`);
      if (confirmRestart) {
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(60);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  useEffect(() => {
    let timer: number | undefined = undefined;
    if (timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      alert(`시간 초과! 최종 점수: ${score}/${questions.questions.length}`);
    }

    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [timeLeft, score, questions.questions.length]);

  return (
<div className="quiz">
      <div className="timer">
        {timeLeft}초&nbsp;&nbsp;|&nbsp;&nbsp;맞춘 개수: {score}
      </div>
      <h2>{currentQuestion.text}</h2>
      <ul>
        {currentQuestion.choices.map((choice: Choice) => (
          <li key={choice.id}>
            <input
              type="radio"
              id={choice.id}
              name="answer"
              checked={choice.id === selectedAnswerId}
              onChange={() => handleAnswerSelect(choice.id)}
            />
            <label htmlFor={choice.id}>{choice.text}</label>
          </li>
        ))}
      </ul>
      <button onClick={handleNextButtonClick}>
        {isLastQuestion ? '제출' : '다음 문제'}
      </button>
      </div>
  );
}

export default Quiz;

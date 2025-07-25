import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const { questionId, email } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    questionId ? parseInt(questionId, 10) - 1 : 0
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestions();
    }
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:3001/overview");
      const questionsWithKeys = response.data.map((question, index) => ({
        ...question,
        id: index + 1,
        answer: "",
      }));
      setQuestions(questionsWithKeys);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const answers = questions.map((question) => ({
        question: question.vraag,
        answer: question.currentAnswer || "Geen antwoord",
      }));

      await submitAnswers(answers);
      navigate("/overview");
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const submitAnswers = async (answers) => {
    try {
      console.log("Email is:", email);
      console.log("Answers:", answers);

      await axios.post("http://localhost:3001/addAnswer", {
        email: email,
        answers: answers,
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].currentAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const isAllQuestionsAnswered = !questions.some(
    (question) => !question.currentAnswer
  );

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const { vraag, type, opties } = currentQuestion;

  const renderQuestionInput = () => {
    if (type === "open") {
      return (
        <input
          type="text"
          value={currentQuestion.currentAnswer || ""}
          onChange={handleInputChange}
          placeholder="antwoord"
          className="edit-feedback-form-input"
          required
        />
      );
    } else if (type === "multipleChoice") {
      const options = opties.split(",");
      return (
        <select
          value={currentQuestion.currentAnswer || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">Maak een keuze</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
  };

  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  return (
    <div>
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{vraag}</p>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          {renderQuestionInput()}
          <button className="submit-button" type="submit">
            Submit
          </button>
        </div>
      </form>
      {currentQuestionIndex > 0 && (
        <button
          className="previous-button"
          type="button"
          onClick={handlePrevious}
        >
          Vorige
        </button>
      )}
      <div className="progress-text">
        Vraag {currentQuestionIndex + 1} van de {questions.length}
      </div>
      <div className="progress-bar-fixed">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {currentQuestionIndex + 1 < questions.length && (
        <button className="next-button" type="button" onClick={handleNext}>
          Volgende
        </button>
      )}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default QuestionForm;

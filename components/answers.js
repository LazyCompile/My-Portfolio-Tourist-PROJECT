import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { ReactComponent as Logo } from "../dyflexis.svg";
import { Link } from "react-router-dom";

function Answers() {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/answers");
      const answersWithKeys = response.data.map((answer, index) => ({
        ...answer,
        id: index + 1,
      }));
      setAnswers(answersWithKeys);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="feedbackOverviewContainer">
      <Logo className="logo" />
      <div className="feedbackOverview scrollableContainer">
        <Link to="/" className="Home">
          Home
        </Link>
        {answers.map((answer) => (
          <div key={answer.id} className="feedbackOverviewItem">
            {answer.teamlid && (
              <div className="feedbackTeamlid">
                <span>{answer.teamlid}</span>
              </div>
            )}
            <div className="feedbackQuestions">
              {answer.vragen.split(",").map((vraag, index) => (
                <div className="feedbackQuestion" key={index}>
                  <div className="questionColumn">
                    <span className="questionLabel">Vraag {index + 1}: </span>
                    <span className="questionText">{vraag.trim()}</span>
                  </div>
                  {answer.antwoorden.split(",")[index] && (
                    <div className="answerColumn">
                      <span className="answerLabel">
                        Antwoord {index + 1}:{" "}
                      </span>
                      <span className="answerText">
                        {answer.antwoorden.split(",")[index].trim()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Answers;

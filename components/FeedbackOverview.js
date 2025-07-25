import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; 
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../dyflexis.svg';

function FeedbackOverview() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/overview');
      const questionsWithKeys = response.data.map((question, index) => ({ ...question, id: index + 1 }));
      setQuestions(questionsWithKeys);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="feedback-overview-container">
      <Logo className="logo" />
      <Link to="/" className="Home">Home</Link>
      <div className="feedback-overview">
        {questions.map((question) => (
          <div key={question.id} className="feedback-overview-item">
            <span className="feedback-overview-item-id">{question.id}. </span>
            <span className="feedback-overview-item-question">{question.vraag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackOverview;

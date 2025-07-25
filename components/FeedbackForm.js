import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FeedbackForm() {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('open');
  const [options, setOptions] = useState('');
  const [questionPool, setQuestionPool] = useState([]);
  const [isNewQuestion, setIsNewQuestion] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [teamMemberName, setTeamMemberName] = useState('');

  useEffect(() => {
    fetchQuestionPool();
  }, []);

  const fetchQuestionPool = async () => {
    try {
      const response = await axios.get('http://localhost:3001/overview');
      setQuestionPool(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuestionSelection = (selectedQuestion) => {
    setQuestion(selectedQuestion);
    setIsNewQuestion(false);
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setType('open');
    setOptions('');
    setIsNewQuestion(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isNewQuestion && !question) {
      console.error('Nieuwe vraag mag niet leeg zijn.');
      return;
    }
  
    if (!isAnonymous && !teamMemberName) {
      console.error('Naam van het teamlid mag niet leeg zijn.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/addQuestion', {
        vraag: question,
        type,
        opties: options,
        is_anoniem: isAnonymous,
        teamlid_naam: isAnonymous ? '' : teamMemberName, // Lege string als anoniem, anders teamlid_naam
      });
  
      console.log(response.data); // Optioneel: toon een succesbericht
  
      // Voeg de nieuwe vraag toe aan de vraagpool
      const newQuestion = { id: response.data.id, vraag: question };
      setQuestionPool([...questionPool, newQuestion]);
  
      // Reset het formulier na het toevoegen van de vraag
      handleNewQuestion();
    } catch (error) {
      console.error(error);
      // Toon een foutbericht aan de gebruiker
    }
  };
  
  // Callback-functie om de vraagpool bij te werken na het bijwerken van een vraag
  const updateQuestionPool = () => {
    fetchQuestionPool();
  };

  return (
    <div className="feedback-form-container">
      <h1>Voeg een vraag toe</h1>
      <div className="feedback-form-radio-group">
        <input
          type="radio"
          id="newQuestion"
          value="newQuestion"
          checked={isNewQuestion}
          onChange={handleNewQuestion}
          className="feedback-form-radio"
        />
        <label htmlFor="newQuestion" className="feedback-form-label">
          Nieuwe vraag
        </label>
        <input
          type="radio"
          id="existingQuestion"
          value="existingQuestion"
          checked={!isNewQuestion}
          onChange={() => setIsNewQuestion(false)}
          className="feedback-form-radio"
        />
        <label htmlFor="existingQuestion" className="feedback-form-label">
          Bestaande vraag
        </label>
        <select
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isNewQuestion}
          className="feedback-form-select"
        >
          <option value="">Selecteer een vraag</option>
          {questionPool.map((question) => (
            <option key={question.id} value={question.id}>
              {question.vraag}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="feedback-form">
        {isNewQuestion && (
          <div className="feedback-form-group">
            <label htmlFor="newQuestionText" className="feedback-form-label">
              Nieuwe vraag:
            </label>
            <input
              type="text"
              id="newQuestionText"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="feedback-form-input"
            />
          </div>
        )}
        <div className="feedback-form-group">
          <label htmlFor="type" className="feedback-form-label">
            Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="feedback-form-select"
          >
            <option value="open">Open vraag</option>
            <option value="multipleChoice">Meerkeuzevraag</option>
          </select>
        </div>
        {type === 'multipleChoice' && (
          <div className="feedback-form-group">
            <label htmlFor="options" className="feedback-form-label">
              Opties (gescheiden door komma's):
            </label>
            <input
              type="text"
              id="options"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="feedback-form-input"
            />
          </div>
        )}
        <div className="feedback-form-group">
          <label htmlFor="anonymous" className="feedback-form-label">
            Anoniem invullen:
          </label>
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
            className="feedback-form-checkbox"
          />
        </div>
        {!isAnonymous && (
          <div className="feedback-form-group">
            <label htmlFor="teamMemberName" className="feedback-form-label">
              Naam teamlid:
            </label>
            <input
              type="text"
              id="teamMemberName"
              value={teamMemberName}
              onChange={(e) => setTeamMemberName(e.target.value)}
              className="feedback-form-input"
            />
          </div>
        )}
        <button type="submit" className="feedback-form-button">
          Toevoegen
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;

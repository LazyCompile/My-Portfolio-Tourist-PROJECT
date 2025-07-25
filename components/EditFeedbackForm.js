import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function DeleteQuestionForm({ onQuestionDeleted }) {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [questionPool, setQuestionPool] = useState([]);

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

  const handleQuestionDeletion = async () => {
    try {
      const response = await axios.post('http://localhost:3001/deleteQuestion', {
        question: selectedQuestion,
      });

      console.log(response.data); // Optioneel: toon een succesbericht

      // Reset de geselecteerde vraag
      setSelectedQuestion('');

      // Haal de bijgewerkte vraagpool opnieuw op
      fetchQuestionPool();

      // Roep de callback-functie aan om de vraagpool in FeedbackForm bij te werken
      onQuestionDeleted();
    } catch (error) {
      console.error(error);
      // Toon een foutbericht aan de gebruiker
    }
  };

  return (
    <div className="delete-question-form">
      <h1>Verwijder een vraag</h1>
      <div>
        <label className="delete-question-form-label" htmlFor="deleteQuestion">Selecteer een vraag:</label>
        <select className='delete-question-form-select'
          id="deleteQuestion"
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
        >
          <option value="">Selecteer een vraag</option>
          {questionPool.map((question) => (
            <option key={question.id} value={question.vraag}>
              {question.vraag}
            </option>
          ))}
        </select>
      </div>
      {selectedQuestion && (
        <button onClick={handleQuestionDeletion} className="delete-question-button">
          Verwijderen
        </button>
      )}
    </div>
  );
}

function EditFeedbackForm({ onQuestionUpdated }) {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [type, setType] = useState('open');
  const [options, setOptions] = useState('');
  const [questionPool, setQuestionPool] = useState([]);

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

  const handleQuestionSelection = (e) => {
    const selectedQuestion = e.target.value;
    setSelectedQuestion(selectedQuestion);
    setNewQuestion('');
    setType('');
    setOptions('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/editQuestion', {
        question: selectedQuestion,
        newQuestion,
        type,
        options,
      });

      console.log(response.data); // Optioneel: toon een succesbericht

      // Reset het formulier na het bijwerken van de vraag
      setSelectedQuestion('');
      setNewQuestion('');
      setType('');
      setOptions('');

      // Haal de bijgewerkte vraagpool opnieuw op
      fetchQuestionPool();

      // Roep de callback-functie aan om de vraagpool in FeedbackForm bij te werken
      onQuestionUpdated();
    } catch (error) {
      console.error(error);
      // Toon een foutbericht aan de gebruiker
    }
  };

  return (
    <div className="edit-feedback-form">
      <div className="edit-feedback-form-container">
      <h1> Bewerk een vraag</h1>
        <label htmlFor="question" className="edit-feedback-form-label">
          Selecteer een vraag:
        </label>
        <select
          id="question"
          value={selectedQuestion}
          onChange={handleQuestionSelection}
          className="edit-feedback-form-select"
        >
          <option value="">Selecteer een vraag</option>
          {questionPool.map((question) => (
            <option key={question.id} value={question.vraag}>
              {question.vraag}
            </option>
          ))}
        </select>
      </div>
      {selectedQuestion && (
        <form onSubmit={handleSubmit} className="edit-feedback-form-container">
          <div className="edit-feedback-form-group">
            <label htmlFor="newQuestion" className="edit-feedback-form-label">
              Nieuwe vraag:
            </label>
            <input
              type="text"
              id="newQuestion"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="edit-feedback-form-input"
            />
          </div>
          <div className="edit-feedback-form-group">
            <label htmlFor="type" className="edit-feedback-form-label">
              Type:
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="edit-feedback-form-select"
            >
              <option value="">Selecteer een type</option>
              <option value="open">Open vraag</option>
              <option value="multipleChoice">Meerkeuzevraag</option>
            </select>
          </div>
          {type === 'multipleChoice' && (
            <div className="edit-feedback-form-group">
              <label htmlFor="options" className="edit-feedback-form-label">
                Opties:
              </label>
              <input
                type="text"
                id="options"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                className="edit-feedback-form-input"
              />
            </div>
          )}
          <button type="submit" className="edit-feedback-form-button">
            Bewerken
          </button>
        </form>
      )}
      <DeleteQuestionForm onQuestionDeleted={fetchQuestionPool} />
    </div>
  );
}

export default EditFeedbackForm;

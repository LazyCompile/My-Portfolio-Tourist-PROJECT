import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackOverview from "./components/FeedbackOverview";
import AdminLogin from "./components/AdminLogin";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import EditFeedbackForm from "./components/EditFeedbackForm";
import Answers from "./components/answers";
import QuestionForm from "./components/QuestionForm";
import Check from "./components/check";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/overview" element={<FeedbackOverview />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/answers" element={<Answers />} />
        <Route path="/edit" element={<EditFeedbackForm />} />
        <Route path="/form/:email" element={<QuestionForm />} />
        <Route path="/check" element={<Check />} />
      </Routes>
    </Router>
  );
}

export default App;

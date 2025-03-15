import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventForm from "./components/EventForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventForm />} />
      </Routes>
    </Router>
  );
}

export default App;
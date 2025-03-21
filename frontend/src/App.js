import React from "react";
import RazorpayButton from "./components/RazorpayButton";
import "./styles.css";

const App = () => {
    return (
        <div className="container">
            <h1>Orchestrate Events</h1>
            <p>Pay to RSVP for the event</p>
            <RazorpayButton amount={100} />
        </div>
    );
};

export default App;

import { useState } from "react";

const Flashcard = ({ question, answer }) => {
    const [showAnswer, setShowAnswer] = useState(false);
  
    return (
      <div
        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        <div className="text-lg font-semibold mb-2">{question}</div>
        {showAnswer && <div className="text-gray-700">{answer}</div>}
      </div>
    );
  };
  
  export default Flashcard;
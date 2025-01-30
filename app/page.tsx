"use client";
import { useState } from 'react';
import FileUpload from "@/app/components/FileUpload";
import Flashcard from '@/app/components/Flashcard';

export default function Home() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFileUpload = async (file) => {
    // Simulate text extraction (replace with actual PDF/Word parsing logic)
    const extractedText = `Sample text extracted from ${file.name}.`;
    setText(extractedText);

    // Simulate Q&A generation (replace with AI-based logic)
    const generatedFlashcards = [
      { question: 'What is the capital of France?', answer: 'Paris' },
      { question: 'What is 2 + 2?', answer: '4' },
    ];
    setFlashcards(generatedFlashcards);
  };

  const handleLogin = () => {
    // Simple authentication logic (replace with real auth system)
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {!isLoggedIn ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-black">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-black/80"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8 text-black">Flashcard Generator</h1>
            <FileUpload onFileUpload={handleFileUpload} />
            {text && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700">{text}</p>
                </div>
              </div>
            )}
            {flashcards.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Generated Flashcards</h2>
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <Flashcard key={index} question={card.question} answer={card.answer} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';
import FileUpload from "@/app/components/FileUpload";
import Flashcard from '@/app/components/Flashcard';

export default function Home() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Upload file
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      alert(uploadData.error);
      return;
    }

    // Extract text (simulate or integrate with an extraction API)
    const extractedText = `Sample extracted text from ${uploadData.fileName}`;
    setText(extractedText);

    // Process with AI
    const aiResponse = await fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: extractedText }),
    });

    const aiData = await aiResponse.json();
    setFlashcards(aiData.flashcards || []);
  };

  const handleLogin = () => {
    // Simple authentication logic (replace with real auth system)
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-black">Flashcard Generator</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>
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

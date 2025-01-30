"use client";
import { useEffect, useState } from "react";
import FileUpload from "@/app/components/FileUpload"; // Import FileUpload
import Flashcard from "@/app/components/Flashcard"; // Import Flashcard

export default function Home() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputType, setInputType] = useState<"file" | "text">("file"); // Track input type

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file);

    // Upload the file
    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    console.log("Upload Response:", uploadData);

    if (!uploadResponse.ok) {
      alert(uploadData.error);
      return;
    }

    // Simulate text extraction (you can integrate with a real extraction API)
    const extractedText = `Sample extracted text from ${uploadData.fileName}`;
    setText(extractedText);

    console.log("Extracted Text:", extractedText);

    // Generate flashcards from the extracted text
    await generateFlashcards(extractedText);
  };

  const handleTextSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    // Generate flashcards from the manually entered text
    await generateFlashcards(text);
  };

  const generateFlashcards = async (text) => {
    try {
      // Call your AI API (e.g., DeepSeek) to generate flashcards
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      // Set the generated flashcards
      setFlashcards(data.flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    }
  };

  // Login handler
  const handleLogin = () => {
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Login Screen */}
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
            {/* Logged-in Screen */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-black">Flashcard Generator</h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded"
              >
                Logout
              </button>
            </div>

            {/* Input Type Toggle */}
            <div className="mb-8">
              <label className="mr-4 text-black">
                <input
                  type="radio"
                  value="file"
                  checked={inputType === "file"}
                  onChange={() => setInputType("file")}
                  className="mr-2 text-black"
                />
                Upload File
              </label>
              <label className="text-black">
                <input
                  type="radio"
                  value="text"
                  checked={inputType === "text"}
                  onChange={() => setInputType("text")}
                  className="mr-2 text-black"
                />
                Enter Text
              </label>
            </div>

            {/* File Upload Section */}
            {inputType === "file" && <FileUpload onFileUpload={handleFileUpload} />}

            {/* Text Input Section */}
            {inputType === "text" && (
              <div className="mb-8">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full p-2 border rounded mb-4 text-black"
                  rows={6}
                />
                <button
                  onClick={handleTextSubmit}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Generate Flashcards
                </button>
              </div>
            )}

            {/* Display Extracted Text */}
            {text && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-black/80">Input Text</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700">{text}</p>
                </div>
              </div>
            )}

            {/* Display Flashcards */}
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
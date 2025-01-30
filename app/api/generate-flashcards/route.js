import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function POST(req) {
  try {
    const { text } = await req.json();

    // Step 1: Call Python script for relation extraction
    const parsedRelations = await extractRelationsFromText(text);

    // Step 2: Generate Flashcards from Relations
    const flashcards = [];
    for (const relation of parsedRelations) {
      const question = `What is ${relation.subject} ${relation.verb}?`;
      const answer = await generateAnswerFromModel(text, question);
      
      flashcards.push({
        question,
        answer
      });
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error during flashcard generation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to call Python script
async function extractRelationsFromText(text) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, 'extract_relations.py');
    
    exec(`python3 ${pythonScriptPath} "${text}"`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Error executing Python script: ${stderr || error}`);
        reject(new Error("Failed to parse relations"));
      } else {
        const relations = JSON.parse(stdout);
        resolve(relations);
      }
    });
  });
}

// Function to generate answers using Hugging Face API
async function generateAnswerFromModel(context, question) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/deepset/roberta-base-squad2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context, question }),
    });

    const result = await response.json();
    return result.answer || "Answer not found";
  } catch (error) {
    console.error("Error generating answer:", error);
    return "Answer not found";
  }
}

import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import spacy from "spacy";

// Initialize Hugging Face Inference API
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();

    // Step 1: Dependency Parsing with spaCy to Extract Relations
    const parsedRelations = extractRelationsFromText(text);

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function extractRelationsFromText(text) {
  const doc = spacy.nlp(text);
  const relations = [];

  for (let sent of doc.sents) {
    for (let token of sent) {
      if (token.dep_ === "nsubj" && token.head.dep_ in ["ROOT", "attr"]) {
        const subject = token.text;
        const verb = token.head.text;
        const object = [...token.head.children].filter(child => child.dep_ === "prep").map(child => child.text).join(" ");
        
        relations.push({
          subject,
          verb,
          object
        });
      }
    }
  }
  return relations;
}

async function generateAnswerFromModel(context, question) {
  const response = await hf.questionAnswering({
    model: "deepset/roberta-base-squad2",
    context,
    question
  });

  return response.answer || "Answer not found";
}

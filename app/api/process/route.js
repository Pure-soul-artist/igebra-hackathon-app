import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face Inference API
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();

    // You can use a model fine-tuned for Q&A, such as "deepset/roberta-base-squad2"
    const response = await hf.questionAnswering({
      model: "deepset/roberta-base-squad2", 
      context: text,
      question: "What are the key points in this text?",
    });

    // Here we're generating questions for Q&A
    const question = response.answer;  // The answer generated from the model
    const flashcards = [{
      question: "What are the key points in this text?",
      answer: question
    }];

    return NextResponse.json({ flashcards });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

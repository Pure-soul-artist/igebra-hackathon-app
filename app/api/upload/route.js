import { NextResponse } from "next/server";
import multer from "multer";
import { writeFile } from "fs/promises";
import path from "path";

// Configure multer storage
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save file locally (Optional: You can use cloud storage like AWS S3)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public/uploads", file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: "File uploaded successfully",
      fileName: file.name,
      filePath: `/uploads/${file.name}`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

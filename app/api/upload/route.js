import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";

// Disable body parser for file upload route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Set up multer to handle file uploads with memory storage
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req) {
  return new Promise((resolve, reject) => {
    // Debug: Log to check if multer is processing the file
    console.log("Request headers:", req.headers);

    upload.single("file")(req, {}, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return resolve(NextResponse.json({ error: "File upload failed." }, { status: 500 }));
      }

      if (!req.file) {
        console.log("No file uploaded");
        return resolve(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));
      }

      console.log("File uploaded:", req.file);

      // Define the upload directory
      const dir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the file to the server
      const filePath = path.join(dir, req.file.originalname);
      fs.writeFileSync(filePath, req.file.buffer);

      // Respond with the file information
      return resolve(NextResponse.json({
        message: "File uploaded successfully",
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.originalname}`,
      }));
    });
  });
}

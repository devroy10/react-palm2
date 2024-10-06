// Make sure to include these imports:
import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

let answer = null;
let prompt =
  "How should frontend developers embrace or how is their work impacted with ragards to tools like framer, webflow";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/api", async (req, res) => {
  prompt = req.body.prompt;
  const result = await model.generateContent(prompt);
  try {
    answer = result.response.text();
    // console.log(result.response.text());
    res.json(answer);
  } catch (err) {
    console.error("error occurred", err);
  }
});

app.listen(3333, () => {
  console.log("server is listening on port 3333");
});

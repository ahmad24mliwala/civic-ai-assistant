const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const data = require("./data.json");

// 🔹 Steps API
app.get("/steps", (req, res) => {
  res.json(data.steps);
});

// 🔹 Timeline API
app.get("/timeline", (req, res) => {
  res.json(data.timeline);
});

// 🔹 AI Chat API
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are CivicAI, an assistant that explains elections in very simple, step-by-step language.
Use examples from India when possible.
Keep answers short, clear, and beginner-friendly.
`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));

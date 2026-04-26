const express = require("express");
const cors = require("cors");
// const helmet = require("helmet"); ❌ disable
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());
// app.use(helmet()); ❌ disable for now

// ✅ Serve frontend FIRST
app.use(express.static(path.resolve(__dirname, "../frontend")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const data = require("./data.json");

// APIs
app.get("/steps", (req, res) => {
  res.json(data.steps);
});

app.get("/timeline", (req, res) => {
  res.json(data.timeline);
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const language = req.body.language || "en";

  if (!userMessage || typeof userMessage !== "string") {
    return res.json({ reply: "Invalid input" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are CivicAI.

If language is "hi", respond in Hindi.
If language is "en", respond in English.

Explain elections simply using Indian examples.
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

    let reply = "⚠️ Smart assistant mode:\n\n";

    const msg = userMessage.toLowerCase();

    if (msg.includes("vote")) {
      reply += "👉 Steps:\n1. Register\n2. ID\n3. Booth\n4. Vote";
    } else if (msg.includes("eligibility")) {
      reply += "👉 Any citizen above 18 can vote.";
    } else {
      reply += "👉 Election process:\n1. Registration\n2. Voting\n3. Results";
    }

    res.json({ reply });
  }
});

// fallback route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/index.html"));
});

app.listen(80, "0.0.0.0", () => {
  console.log("✅ Backend running on http://98.82.171.159");
});

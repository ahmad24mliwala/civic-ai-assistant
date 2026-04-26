const API = "";
let currentLanguage = "en";


function setLanguage(lang) {
  currentLanguage = lang;

  if (lang === "hi") {
    addMessage("AI", "🇮🇳 हिंदी मोड सक्रिय है। आप मुझसे चुनाव के बारे में पूछ सकते हैं।");
  } else {
    addMessage("AI", "🇬🇧 English mode activated. Ask me anything about elections.");
  }
}

function quickAsk(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}

// Add message with auto scroll
function addMessage(sender, text) {
  const chat = document.getElementById("chat");

  chat.innerHTML += `
    <p>
      <b>${sender}:</b><br>${text}
    </p>
  `;

  chat.scrollTop = chat.scrollHeight;
}

// 🔹 Steps
async function getSteps() {
  try {
    const res = await fetch(API + "/steps");
    const data = await res.json();
    addMessage("AI", data.join("<br>"));
  } catch (error) {
    console.error(error);
    addMessage("AI", "⚠️ Unable to load steps.");
  }
}

// 🔹 Timeline
async function getTimeline() {
  try {
    const res = await fetch(API + "/timeline");
    const data = await res.json();

    let text = "";
    for (let key in data) {
      text += `${key}: ${data[key]}<br>`;
    }

    addMessage("AI", text);
  } catch (error) {
    console.error(error);
    addMessage("AI", "⚠️ Unable to load timeline.");
  }
}


// 🔹 Chat
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const chat = document.getElementById("chat");
  chat.innerHTML += `<p id="loading"><i>AI is typing...</i></p>`;

  try {
    const res = await fetch(API + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  message: message,
  language: currentLanguage
})
    });

    const data = await res.json();

    document.getElementById("loading").remove();

    if (data.reply) {
      addMessage("AI", data.reply);
    } else {
      addMessage("AI", "⚠️ No response from server.");
    }

  } catch (error) {
    document.getElementById("loading")?.remove();
    console.error(error);

    addMessage(
      "AI",
      "⚠️ AI service unavailable.\n\n👉 Steps:\n1. Register\n2. Check date\n3. Visit booth\n4. Vote"
    );
  }
}

// 🔥 Enter key support (VERY IMPORTANT)
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("userInput");

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});

const API = "http://localhost:5000";

function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
}

// 🔹 Steps
async function getSteps() {
  const res = await fetch(API + "/steps");
  const data = await res.json();
  addMessage("AI", data.join("<br>"));
}

// 🔹 Timeline
async function getTimeline() {
  const res = await fetch(API + "/timeline");
  const data = await res.json();

  let text = "";
  for (let key in data) {
    text += `${key}: ${data[key]}<br>`;
  }

  addMessage("AI", text);
}

// 🔹 Chat
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  addMessage("You", message);

  const res = await fetch(API + "/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  addMessage("AI", data.reply);
  input.value = "";
}

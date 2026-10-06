const startButton = document.getElementById("startButton");
const status = document.getElementById("status");
const statusText = document.getElementById("statusText");
const dot = document.getElementById("dot");
const orb = document.getElementById("orb");
const conversation = document.getElementById("conversation");

let aiActive = false;
let recognition = null;

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

function addMessage(text, type) {

  const message = document.createElement("div");

  message.className = `message ${type}`;

  message.innerHTML = text;

  conversation.appendChild(message);

  conversation.scrollTop =
    conversation.scrollHeight;
}


function speak(text) {

  if (!("speechSynthesis" in window)) {
    return;
  }

  speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);

  voice.lang = "en-US";
  voice.rate = 0.95;
  voice.pitch = 1;

  speechSynthesis.speak(voice);
}


function activateAI() {

  aiActive = true;

  status.textContent = "AI is ON";
  statusText.textContent = "Listening...";
  dot.classList.add("active");
  orb.classList.add("active");

  addMessage(
    "AI is now <b>ON</b> 🟢",
    "ai"
  );

  speak("AI is now on.");

  startListening();
}


function deactivateAI() {

  aiActive = false;

  status.textContent = "AI is OFF";
  statusText.textContent = "Waiting...";
  dot.classList.remove("active");
  orb.classList.remove("active");

  if (recognition) {
    recognition.stop();
  }

  addMessage(
    "AI is now <b>OFF</b> 🔴",
    "ai"
  );

  speak("AI is now off.");
}


function handleCommand(text) {

  const command = text
    .toLowerCase()
    .trim();

  addMessage(text, "user");

  if (
    command.includes("open ai") ||
    command.includes("open a i")
  ) {

    activateAI();
    return;
  }

  if (
    command.includes("turn off ai") ||
    command.includes("turn off a i") ||
    command.includes("close ai")
  ) {

    deactivateAI();
    return;
  }

  if (aiActive) {

    statusText.textContent = "Processing...";

    setTimeout(() => {

      const reply =
        "I heard you say: " + text;

      addMessage(reply, "ai");

      speak(reply);

      statusText.textContent =
        "Listening...";

      startListening();

    }, 500);

  } else {

    addMessage(
      'Say <b>"Open AI"</b> to start.',
      "ai"
    );

  }
}


function startListening() {

  if (!SpeechRecognition) {

    addMessage(
      "Speech recognition is not supported in this browser.",
      "ai"
    );

    return;
  }

  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {}
  }

  recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {

    statusText.textContent =
      "Listening 🎙️";

  };

  recognition.onresult = (event) => {

    const text =
      event.results[0][0].transcript;

    handleCommand(text);

  };

  recognition.onerror = () => {

    statusText.textContent =
      aiActive
        ? "Listening..."
        : "Waiting...";

  };

  recognition.onend = () => {

    if (aiActive) {

      setTimeout(() => {
        startListening();
      }, 300);

    }

  };

  recognition.start();
}


startButton.addEventListener(
  "click",
  () => {

    if (!aiActive) {

      addMessage(
        'Listening... Say <b>"Open AI"</b>',
        "ai"
      );

      startListening();

    } else {

      startListening();

    }

  }
);

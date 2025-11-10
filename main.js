const sysprompt = "You are a highly professional AI assistant.Always respond with the following guidelines:Maintain a professional, clear, and polite tone in all answers.When presenting structured information, use HTML formatting only such as < ul > , <ol>, <table>, <p>, <h1>–<h6>, <pre>, and <code>.Use ordered lists (<ol>) for step-by-step instructions and unordered lists (<ul>) for key points.Use tables (<table>) for comparisons, specifications, or options.Provide code examples inside <pre><code> blocks.Always explain concepts clearly before giving solutions or examples.Anticipate follow-up questions by providing additional context when relevant.Keep responses concise, structured, and easy to read, just like ChatGPT.When responding to technical topics, include examples, best practices, and recommendations.Always ensure HTML tags are properly nested and valid.Do not use Markdown, asterisks, underscores, emojis, or any non-HTML formatting; do not respond in casual, slang, or unprofessional tone; do not omit explanations before solutions; do not provide unstructured or invalid HTML; do not use plain text lists instead of <ul> or <ol>; do not skip code blocks for examples; avoid unclear, incomplete, or ambiguous answers."
const GEMINI_API_KEY = "AIzaSyAulptahRC1aNwl9JRUkJ9CR_BgfilgaWA";
const GEMINI_MODEL = "gemini-2.0-flash";

const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');


let conversation = [
  {
    role: "user",
    content: sysprompt,
  }
];


function addMessageToChat(role, content) {
  const row = document.createElement('div');
  row.className = 'message-row ' + (role === 'user' ? 'right' : 'left');
  const msg = document.createElement('div');
  msg.className = 'message ' + (role === 'user' ? 'user' : 'bot');
  msg.innerHTML = content; // Use innerHTML for HTML formatting!
  row.appendChild(msg);
  chatBox.appendChild(row);
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth"
  });
}

function showBotThinking() {
  addMessageToChat('bot', '...');
}
function replaceLastBotMessage(content) {
  const messages = chatBox.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].innerHTML = content;
  }
}
async function getBotReply() {
  try {
    // Prepare messages for Gemini API
    const history = conversation.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    const payload = { contents: history.slice(-10) };

    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error("Error: " + response.status + " " + response.statusText);
    }
    const data = await response.json();

    let reply = "Sorry, no response.";
    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
    ) {
      reply = data.candidates[0].content.parts[0].text.trim();
    }

    conversation.push({ role: "model", content: reply });
    replaceLastBotMessage(reply);
  } catch (err) {
    replaceLastBotMessage("Sorry, I couldn't reach Gemini service. (" + err.message + ")");
  }
}

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  addMessageToChat('user', text);
  conversation.push({ role: "user", content: text });

  userInput.value = '';
  userInput.focus();

  showBotThinking();
  await getBotReply();
});
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});


const initGreetingMsg = "Hello! am an AI chatbot created by Waiswa J Bryans, How can I help you today?";
window.addEventListener('DOMContentLoaded', () => {
  addMessageToChat('bot', initGreetingMsg);
  conversation.push({ role: "model", content: initGreetingMsg });
});
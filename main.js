
const GEMINI_API_KEY = "AIzaSyAulptahRC1aNwl9JRUkJ9CR_BgfilgaWA";
const GEMINI_MODEL = "gemini-2.0-flash";

// Chat UI Elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Store conversation as array of {role, content}
let conversation = [];


// Add message to chat UI
function addMessageToChat(role, content) {
  const row = document.createElement('div');
  row.className = 'message-row ' + (role === 'user' ? 'right' : 'left');
  const msg = document.createElement('div');
  msg.className = 'message ' + (role === 'user' ? 'user' : 'bot');
  msg.textContent = content;
  row.appendChild(msg);
  chatBox.appendChild(row);
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth"
  });
}

// Show loading indicator
function showBotThinking() {
  addMessageToChat('bot', '...');
}

// Replace bot loader with reply
function replaceLastBotMessage(content) {
  const messages = chatBox.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].textContent = content;
  }
}

// ========== GEMINI API CALL ==========
async function getBotReply() {
  try {
    // Prepare messages for Gemini API
    const history = conversation.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    // Only send last 10 messages for brevity
    const payload = { contents: history.slice(-10) };
    
    // Call Gemini API
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

// Optional: Enter key handling
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

// Initial Greeting
const initGreetingMsg = "Hello! How can I help you today?";
window.addEventListener('DOMContentLoaded', () => {
  addMessageToChat('bot', initGreetingMsg);
  conversation.push({ role: "model", content: initGreetingMsg });
});
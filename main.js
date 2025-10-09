    // ========== CONFIGURATION ==========
 //OpenRouter API key 
    const OPENROUTER_API_KEY = "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";
    // Model 'openai/gpt-4'
    const OPENROUTER_MODEL = "openai/gpt-4.1";
    
    // ========== DOM ELEMENTS ==========
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    
    // ========== MESSAGE STATE ==========
    // Store the conversation as an array of {role, content}
    let conversation = [
      { role: "system", content: "You are a helpful AI chatbot." }
    ];
    
    // ========== FUNCTIONS ==========
    
    // Adding a message to the chat UI
    function addMessageToChat(role, content) {
      const row = document.createElement('div');
      row.className = 'message-row ' + (role === 'user' ? 'right' : 'left');
      const msg = document.createElement('div');
      msg.className = 'message ' + (role === 'user' ? 'user' : 'bot');
      msg.textContent = content;
      row.appendChild(msg);
      chatBox.appendChild(row);
      // Scrolling smoothly to bottom
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
      });
    }
    
    // Showing a loading indicator while waiting for bot response
    function showBotThinking() {
      addMessageToChat('bot', '...');
    }
    
    // Replacing the last bot message (the loader) with the actual response
    function replaceLastBotMessage(content) {
      const messages = chatBox.querySelectorAll('.message.bot');
      if (messages.length > 0) {
        messages[messages.length - 1].textContent = content;
      }
    }
    
    // ========== OPENROUTER API CALL ==========
    // Getting a response from OpenRouter API
    async function getBotReply() {
      try {
        // Preparing payload for OpenRouter
        const payload = {
          model: OPENROUTER_MODEL,
          messages: conversation.filter(m => m.role !== "system"),
          // Optionally include system message as needed
        };
        
        // Making Call to OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        
        // Parsing response
        if (!response.ok) {
          throw new Error("Error: " + response.status + " " + response.statusText);
        }
        const data = await response.json();
        
        // Extract ai first response
        const reply = data.choices[0].message.content.trim();
        // Adding to conversation history
        conversation.push({ role: "assistant", content: reply });
        // Replacing loading indicator with actual reply
        replaceLastBotMessage(reply);
      } catch (err) {
        // Showing error if API call fails
        replaceLastBotMessage("Sorry, I couldn't reach the AI service. (" + err.message + ")");
      }
    }
    
    // ========== EVENT HANDLER ==========
    chatForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;
      
      // Adding user message to UI and conversation history
      addMessageToChat('user', text);
      conversation.push({ role: "user", content: text });
      
      userInput.value = '';
      userInput.focus();
      
      // Show bot thinking indicator
      showBotThinking();
      // Get bot response from API
      await getBotReply();
    });
    
    // ========== OPTIONAL: ENTER KEY HANDLING ==========
    userInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
    
    // ========== INITIAL GREETING ==========
    const initGreetingMsg ="Hello! 👋 How can I help you today?";
    window.addEventListener('DOMContentLoaded', () => {
      addMessageToChat('bot',initGreetingMsg );
      conversation.push({ role: "assistant", content: initGreetingMsg });
    });
    
  
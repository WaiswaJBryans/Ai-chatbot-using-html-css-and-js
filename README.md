# AI Chatbot Web App

A simple, modern AI chatbot web application built with vanilla HTML, CSS, and JavaScript. This app features a clean chat interface and integrates with the [OpenRouter API](https://openrouter.ai/) to deliver AI-powered responses. Messages are displayed in a conversational format with smooth scrolling, rounded corners, and responsive design.

## Features

- Clean, responsive chat UI.
- Scrollable chat box.
- User messages on the right (blue), bot messages on the left (green).
- AI responses via OpenRouter API.
- Smooth scrolling for new messages.
- Modern CSS styling: rounded corners, shadow, mobile-friendly.
- Well-commented JavaScript for easy understanding and customization.

## Demo

![Chatbot Screenshot](screenshot.png) <!-- Add your screenshot here if available -->

## Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/WaiswaJBryans/Ai-chatbot-using-html-css-and-js.git
cd Ai-chatbot-using-html-css-and-js

# 2. Add your operRouter api key
- open your js file and add api key.

```bash
const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY_HERE";

# 3. Running the app

Just open index.html file in your browser.
no built tool or server required.

## CODE STRUCTURE
 index.html – The main HTML file.
 style.css _ file contain the styling of the application.
 main.js - file containing javascript code.
 
 ## How it works
 
1. User types a message and presses Send.
2. The message appears on the right side (blue bubble).
3. The app sends the message to OpenRouter via its API.
4. The AI's response appears on the left (green bubble).
5. The chat box scrolls smoothly to always show the latest message.

## Customization

- Change colors and layouts in the CSS section.
- Swap the AI model by modifying the `OPENROUTER_MODEL` variable.
- Add more features (message history, avatars, etc.) by extending the JS code.

## Security

**Note:**  
This demo stores the API key in the frontend, which is suitable only for testing or local use.  
For production, use a backend server to securely store and proxy API requests.

## License

MIT License

---

## Acknowledgments

- [OpenRouter](https://openrouter.ai/)
- [DeepSeek](https://deepseek.com/) (optional model)
- [OpenAI](https://openai.com/) (optional model)
```

---
 
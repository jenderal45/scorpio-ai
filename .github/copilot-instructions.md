# Scorpio AI - AI Agent Instructions

## Architecture Overview

**Scorpio AI** is a full-stack generative AI chat application combining a Google Gemini-powered backend with a responsive frontend. The system maintains conversation context through session-based memory.

### Core Components

1. **Backend** (`backend/server.js`) - Express.js server with `/api/chat` endpoint that:
   - Accepts POST requests with `message` and `sessionId`
   - Manages session memory using in-memory Map (persists within process lifetime)
   - Interfaces with Google Gemini API (`gemini-1.5-flash` model)
   - Returns AI response + sessionId for client-side session tracking

2. **Frontend** (`frontend/index.html`) - Single-file HTML/CSS/JS application that:
   - Maintains conversation history in localStorage via `scorpio_session` key
   - Displays messages with distinct styling (user: cyan, AI: gray)
   - Sends requests to `/api/chat` with message + sessionId
   - Implements smooth scrolling and responsive design

3. **Memory Management** (`backend/memory.js`) - Session-based conversation history:
   - Stores messages in `sessions` Map keyed by sessionId
   - Limits memory to 10 messages per session (FIFO when exceeded)
   - Contains user/assistant role pairs for Gemini's chat history format

## Critical Data Flow

1. Frontend captures user input → sends to `/api/chat` with current sessionId
2. Backend retrieves memory for sessionId, appends system prompt + message history
3. Gemini API processes complete context (system prompt + history + new message)
4. Response saved to memory, returned with sessionId to frontend
5. Frontend stores sessionId in localStorage for continuity across page reloads

**Note**: Memory is ephemeral (RAM only); sessions lost on server restart. This is intentional design.

## Key Implementation Patterns

- **System Prompt Injection**: `backend/prompt.js` exports fixed system prompt defining Scorpio AI's personality and behavior - injected as first message in every chat history
- **Session Management**: Dual storage (backend RAM + frontend localStorage) ensures context survives client-side navigation but not server restarts
- **Gemini Chat Format**: Uses `startChat()` with history array where system prompt is a "user" message and all history follows role/parts structure
- **CORS Enabled**: `cors()` middleware allows cross-origin requests (important for local development)

## Development Workflow

### Start Development
```bash
cd backend
npm install  # Required first time
npm run dev  # Starts nodemon with hot reload on port 3000
```

### Environment Setup
- Copy `backend/env.txt` to `.env` in backend directory
- Set `GEMINI_API_KEY=<your-key>` from Google AI Studio (https://aistudio.google.com)
- Port defaults to 3000 (override with PORT environment variable)

### Testing Chat Locally
- Open `frontend/index.html` in browser directly OR serve via simple HTTP server
- localStorage prevents CORS issues when frontend is file:// protocol (browser allows it)
- Verify `/api/chat` endpoint responds from backend (check browser DevTools Network tab)

## Conventions & Patterns

1. **ES6 Modules**: Backend uses `import/export` syntax (`"type": "module"` in package.json)
2. **Async Handlers**: Express route handlers are async; errors caught by top-level try-catch
3. **Session IDs**: Generated as crypto.randomUUID() if not provided by client
4. **Message Objects**: Backend memory stores `{role, content}`; API responses return plain text in `reply` field
5. **Error Handling**: 500 status for exceptions; error message exposed in JSON response

## Integration Points

- **Google Generative AI SDK**: Used via `GoogleGenerativeAI` class initialized with API key
- **Model Choice**: Hardcoded to `gemini-1.5-flash` (fast, cost-effective); change in `server.js` line 25
- **CORS Origins**: Currently allows all (`cors()` with no restrictions); restrict in production with `{origin: 'https://yourdomain.com'}`

## Files to Reference

- [backend/server.js](backend/server.js) - API route definition and Gemini integration
- [backend/memory.js](backend/memory.js) - Session memory with 10-message limit
- [backend/prompt.js](backend/prompt.js) - System prompt defining AI personality
- [frontend/index.html](frontend/index.html) - Chat UI and client-side logic
- [backend/package.json](backend/package.json) - Dependencies and scripts

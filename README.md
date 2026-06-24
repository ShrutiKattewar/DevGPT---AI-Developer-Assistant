# DevGPT – AI Developer Assistant

DevGPT is a full-stack AI-powered developer assistant built using Angular, Node.js, and OpenAI APIs. It helps developers with debugging, code explanations, code generation, DSA problem solving, and general programming queries through an interactive chat interface.

##Live Demo: [DevGPT](https://dev-gpt-ai-developer-assistant.vercel.app/)

## Features

* Multi-mode AI workflows:

  * Chat
  * Debug
  * Explain
  * Generate
  * DSA Assistant
* Real-time AI responses
* Reactive state management using RxJS
* Multi-chat support with persistent chat history
* Context-aware conversations
* Loading states and error handling
* Responsive user interface

## Tech Stack

### Frontend

* Angular
* TypeScript
* RxJS
* HTML5
* SCSS

### Backend

* Node.js
* Express.js

### APIs

* OpenAI API

### Storage

* localStorage

## Architecture

Frontend (Angular + RxJS)
↓
Backend API (Node.js + Express)
↓
OpenAI API

## Getting Started

### Prerequisites

* Node.js
* Angular CLI
* OpenAI API Key

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd devgpt
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Configure environment variables:

```env
OPENAI_API_KEY=your_api_key
```

Run backend:

```bash
npm start
```

Run frontend:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

## Key Learnings

* Building AI-powered web applications
* Prompt engineering and conversational workflows
* Reactive state management with RxJS
* Full-stack application development using Angular and Node.js
* Managing chat context and optimizing token usage
* Integrating streaming AI responses

## Future Enhancements

* User authentication
* Cloud database integration
* Chat search functionality
* File upload support

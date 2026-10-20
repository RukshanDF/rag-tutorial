# ComputeIQ Tech — Next.js + Gemini AI Chatbot

A modern, full-stack electronics e-commerce demo website based in **New York, NY, USA**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and an integrated AI customer-support chatbot powered by the **Google Gemini API** (`@google/genai` official SDK).

This project serves as **Stage 1** of an educational tutorial series exploring:
1. **Basic Gemini Chatbot Without RAG** *(This repository)*
2. RAG (Retrieval-Augmented Generation) using a Markdown Knowledge Base
3. AI Guardrails and Domain Protection
4. AI Sandboxing & Tool Security Concepts

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup Guide](#step-by-step-setup-guide)
  - [1. Clone or Download](#1-clone-or-download)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Obtain a Gemini API Key](#3-obtain-a-gemini-api-key)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Run Development Server](#5-run-development-server)
- [Testing the Application](#testing-the-application)
- [Security: Why Client-Side API Keys Are Dangerous](#security-why-client-side-api-keys-are-dangerous)
- [Future RAG Integration Roadmap](#future-rag-integration-roadmap)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [License & Disclaimer](#license--disclaimer)

---

## Features

- **Storefront & Tech Aesthetics:** Dark navy/charcoal styling with electric cyan accents, subtle tech grid patterns, and refined micro-interactions.
- **Product Catalog:** Showcases 4 flagship products with category tags, warranty badges, and "Ask AI About This Product" deep-link buttons.
  - **NovaBook Air** (Laptops, LKR 185,000 / $620, 2-Year Warranty)
  - **NovaBook Pro** (Laptops, LKR 265,000 / $890, 2-Year Warranty)
  - **NovaBuds** (Audio, LKR 12,500 / $42, 6-Month Warranty)
  - **NovaCharge 65W** (Accessories, LKR 4,500 / $15, 3-Month Warranty)
- **Floating AI Assistant Widget:**
  - Floating trigger button with status indicator and subtle hover animations.
  - Rich chat panel with minimize, maximize, clear history, and close controls.
  - Suggested question chips for instant testing.
  - Multi-turn conversation history maintained in client state and passed cleanly to the server route.
  - Auto-scrolling, typing spinner, Enter to send, Shift+Enter for newlines, and error retry states.
- **Server-Side Security:**
  - Route handler (`/api/chat`) strictly enforces server-side execution.
  - In-memory rate limiting and request payload sanitization.
  - Safe error masking preventing internal stack trace leaks to the client.

---

## Architecture Overview

```
D:/RAG App/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Secure server-side route handler for Gemini API
│   ├── globals.css            # Tailwind CSS v4 styling & dark navy theme tokens
│   ├── layout.tsx             # Root layout with metadata and Inter font
│   └── page.tsx               # Main storefront page assembling all sections
├── components/
│   ├── Header.tsx             # Sticky navbar, logo, mobile drawer, AI trigger
│   ├── Hero.tsx               # Hero banner with dual CTAs & trust badges
│   ├── ProductSection.tsx     # Filterable product grid
│   ├── ProductCard.tsx        # Card with price, image, & Ask AI action
│   ├── AboutSection.tsx       # Brand story & core values
│   ├── BenefitsSection.tsx    # Warranties, transparent pricing, and policies
│   ├── ContactSection.tsx     # New York store hours, delivery rates & policies
│   ├── Footer.tsx             # Links, educational roadmap & disclaimer
│   ├── ChatWidget.tsx         # Floating chatbot widget with multi-turn support
│   ├── ChatMessage.tsx        # Styled message bubbles, timestamps, & retry button
│   └── ChatInput.tsx          # Textarea input with auto-resize and length counter
├── lib/
│   ├── products.ts            # Clean static product data (separated for future RAG)
│   ├── business.ts            # Baseline shop policies & system instruction text
│   ├── gemini.ts              # Official @google/genai SDK integration
│   └── validation.ts          # Server-side request sanitization & length limits
├── public/
│   └── images/                # Product photography & hero banner assets
├── .env.example               # Template environment configuration
├── .env.local                 # Local environment file (git-ignored)
└── package.json
```

---

## Prerequisites

- **Node.js:** Version 20.x or higher installed on your machine.
  - Check your version: `node -v`
  - Download from [nodejs.org](https://nodejs.org/) if not installed.
- **npm:** Version 9.x or higher (bundled with Node.js).
- **Google Gemini API Key:** A free API key from [Google AI Studio](https://aistudio.google.com/apikey).

---

## Step-by-Step Setup Guide

### 1. Clone or Download

Open your terminal or command prompt in the project directory:

```bash
cd "D:\RAG App"
```

### 2. Install Dependencies

Install all required packages (`next`, `react`, `react-dom`, `@google/genai`, `lucide-react`, `tailwindcss`, `typescript`):

```bash
npm install
```

### 3. Obtain a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with your Google Account.
3. Click **"Create API key"** and select or create a Google Cloud project.
4. Copy your API key string.

### 4. Configure Environment Variables

Create your local `.env.local` file by copying `.env.example`:

```bash
# On Windows PowerShell
Copy-Item .env.example .env.local

# On Linux / macOS
cp .env.example .env.local
```

Open `.env.local` and paste your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> **Note on models:** `gemini-2.5-flash` is the default fast and capable model for customer service chat. You can also configure `gemini-2.0-flash` or `gemini-2.5-pro`.

### 5. Run Development Server

Start the Next.js local server:

```bash
npm run dev
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## Testing the Application

1. **Storefront Verification:**
   - Scroll down to view the **4 Product Cards** with specifications and warranties.
   - Verify New York showroom hours (Mon–Sat 9AM–6PM EST, Closed Sundays) and delivery policies in the Contact section.
2. **Product "Ask AI" Deep Links:**
   - Click **"Ask AI About This Product"** on any card (e.g., *NovaBook Air*).
   - The chatbot opens automatically with a prefilled inquiry about that model.
3. **Multi-Turn Conversation:**
   - Ask: `"What laptops do you have?"`
   - Follow up with: `"How much is the Pro model and what is its warranty?"`
   - Notice that the model understands "the Pro model" references the *NovaBook Pro* from the previous turn.
4. **Suggested Questions:**
   - Test clicking chips like `"What is your delivery policy?"` to receive instant shipping calculations ($15 NYC Courier, $35 US Domestic, Free over $500).

---

## Security: Why Client-Side API Keys Are Dangerous

In this project, the Gemini API is called **strictly on the server side** via Next.js Route Handlers (`app/api/chat/route.ts`).

### The Risk of Client-Side Keys:
- Any variable prefixed with `NEXT_PUBLIC_` in Next.js is bundled into client-side JavaScript.
- Anyone can view the key in browser Developer Tools (Network tab or Application bundle) and steal it.
- An attacker can exhaust your API quota, incur unexpected bills, or abuse the key for unauthorized generation.

### How We Mitigate Risks:
1. **Server-Only Env Var:** `GEMINI_API_KEY` has no `NEXT_PUBLIC_` prefix and is only accessible in Node.js runtime.
2. **Input Sanitization:** User messages are strictly capped at 1,000 characters to prevent prompt stuffing attacks.
3. **In-Memory Rate Limiter:** Protects the route from rapid-fire spamming.
4. **Error Masking:** Client receives generic, sanitized error messages rather than raw API stack traces.

---

## Future RAG Integration Roadmap

In this initial Stage 1 implementation, the chatbot is a standard Gemini assistant provided with baseline system instructions.

In **Stage 2 (RAG Implementation)**, the following architectural upgrades will be introduced:
- **Markdown Knowledge Base:** Moving store policies, FAQ guides, and extended technical specs into standalone Markdown documents.
- **Chunking & Embeddings:** Splitting documents into semantic chunks and generating vector embeddings.
- **Vector Search / Retrieval:** Querying relevant chunks based on user prompt similarity.
- **Context Injection:** Injecting only the retrieved passages into the Gemini prompt dynamically rather than hardcoding static text.

Notice how `lib/products.ts`, `lib/business.ts`, and `lib/gemini.ts` are cleanly separated from the UI components. This will make swapping the direct prompt with a RAG pipeline trivial without touching the storefront components!

---

## Troubleshooting Common Issues

| Error Message in Chat | Cause | Solution |
|---|---|---|
| *"GEMINI_API_KEY is not configured"* | Missing API key in `.env.local` | Open `.env.local`, set `GEMINI_API_KEY=your_key`, and restart `npm run dev`. |
| *"Invalid Gemini API key"* | The key is incorrect or expired | Check your key in [Google AI Studio](https://aistudio.google.com/apikey). |
| *"Gemini API rate limit or quota has been reached"* | Free tier quota exceeded | Wait 60 seconds before making additional requests, or check your quota in Google Cloud console. |
| *"The configured Gemini model was not found"* | Unsupported model name in `GEMINI_MODEL` | Set `GEMINI_MODEL=gemini-2.5-flash` in `.env.local`. |

---

## License & Disclaimer

ComputeIQ Tech is an educational demonstration project. All products, prices, warranty terms, and contact details are fictional and intended solely for learning and teaching purposes.

# Project: ComputeIQ Tech — Next.js + Gemini AI Chatbot

Build a complete, working, modern electronics e-commerce demo website with an integrated AI chatbot powered by the Google Gemini API.

This project will be used in an educational YouTube tutorial series demonstrating:
1. A basic AI chatbot without RAG.
2. RAG using a Markdown knowledge base.
3. AI guardrails.
4. AI sandboxing and tool security concepts.

For this first version, implement the functional storefront and Gemini chatbot WITHOUT RAG, vector databases, embeddings, or guardrails. Keep the architecture clean so these features can be added in later stages.

## 1. Technology Stack

- Next.js with App Router.
- TypeScript.
- React.
- Tailwind CSS.
- Google Gemini API using the official `@google/genai` JavaScript/TypeScript SDK.
- Server-side Gemini integration through Next.js Route Handlers.
- Lucide React icons.
- Local static product data for the storefront.
- npm for package management.

Use current stable, mutually compatible dependencies and follow their current APIs. Do not use deprecated Gemini SDK packages.

## 2. Storefront Design

Create a premium, modern electronics store called ComputeIQ Tech.

Visual direction:
- Dark navy and charcoal backgrounds.
- White and soft-gray text.
- Electric cyan accents.
- Subtle blue and violet gradients.
- Clean product cards with rounded corners.
- Professional spacing and typography.
- Responsive layouts for desktop, tablet, and mobile.
- Smooth, restrained hover animations.
- Modern, polished UI suitable for a professional technology brand.

Avoid excessive neon effects, clutter, and unnecessary animations.

### Header

Include:
- ComputeIQ Tech logo rendered using text and a simple icon.
- Home.
- Products.
- About.
- Contact.
- A prominent AI assistant button.
- A mobile navigation menu.

### Hero Section

Create a visually impressive hero section containing:
- Headline: "Technology That Moves You Forward"
- Supporting text describing the electronics store.
- Primary CTA: "Explore Products"
- Secondary CTA: "Ask Our AI Assistant"
- A high-quality visual of premium laptops, wireless earbuds, and chargers.
- Subtle technology-themed background effects.

The primary CTA should scroll to the products section. The secondary CTA should open the chatbot.

### Product Catalog

Display four product cards using the following exact demo data.

Product 1:
- Name: NovaBook Air
- Category: Laptops
- Price: LKR 185,000
- Warranty: 2 years
- Description: A lightweight laptop designed for everyday productivity and work.

Product 2:
- Name: NovaBook Pro
- Category: Laptops
- Price: LKR 265,000
- Warranty: 2 years
- Description: A high-performance laptop for demanding workloads and creative projects.

Product 3:
- Name: NovaBuds
- Category: Audio
- Price: LKR 12,500
- Warranty: 6 months
- Description: Wireless earbuds designed for everyday listening and convenient portability.

Product 4:
- Name: NovaCharge 65W
- Category: Accessories
- Price: LKR 4,500
- Warranty: 3 months
- Description: A compact 65W charger for compatible electronic devices.

Each product card must include:
- Product image or a polished local placeholder.
- Product name.
- Category.
- Price formatted in Sri Lankan rupees.
- Short description.
- Warranty information.
- "Ask AI About This Product" button.

Clicking the product-specific AI button should open the chatbot and prefill a relevant question about that product.

Use locally available assets or reliable remote image URLs with appropriate Next.js image configuration. Do not leave broken image links. If suitable product images are unavailable, use attractive CSS-based product placeholders.

Do not implement real purchasing or payment functionality.

### Additional Sections

Add:
- A short About Us section.
- A benefits section featuring product support, transparent pricing, and warranty information.
- A contact section using clearly identified demo contact information.
- A footer with navigation links and a demo-business disclaimer.

Business information for the demo:
- Location: New York, NY, USA (Manhattan Showroom).
- Opening hours: Monday–Saturday, 9:00 AM–6:00 PM EST.
- Closed on Sundays.
- New York City local delivery: $15 (LKR 500 equivalent).
- Delivery outside NYC / US Domestic: $35 (LKR 1,200 equivalent).
- Free delivery within New York City for orders above $500 (or LKR 50,000).
- Standard delivery time: 2–4 business days.
- Returns: Within 7 days, provided the product is unused and in its original packaging.
- Damaged products should be reported within 48 hours of delivery.

All business details are fictional and intended for educational demonstration.

## 3. AI Chatbot UI

Create a polished floating chatbot widget available throughout the website.

### Closed State

- Floating button in the bottom-right corner.
- AI assistant icon.
- Subtle animation.
- Accessible label such as "Open AI Assistant".

### Open State

Display a modern chat panel containing:
- Header: "ComputeIQ AI Assistant".
- Small online/status indicator.
- A short welcome message.
- Scrollable message history.
- Distinct user and assistant message styles.
- Message timestamps, if practical.
- Text input.
- Send button.
- Loading indicator while Gemini is responding.
- Error state with a retry option.
- Close and minimize controls.
- Suggested question chips.

Suggested questions:
- "What laptops do you have?"
- "How much does NovaBook Air cost?"
- "What is your delivery policy?"
- "What are your warranty periods?"

Support Enter to send and Shift+Enter for a new line.

Automatically scroll to the newest message when appropriate.

On mobile, ensure the chat panel fits the viewport and does not obstruct the entire application unnecessarily.

### Conversation Behavior

- Maintain conversation history in React state while the widget is open.
- Send the relevant conversation history to the backend for follow-up questions.
- Show the user's message immediately.
- Show a loading indicator while waiting for the response.
- Handle API errors gracefully.
- Prevent duplicate submissions while a request is processing.
- Limit the amount of conversation history sent to the model.
- Validate and limit incoming message lengths on the server.

Do not persist chat conversations to a database in this version.

## 4. Gemini Integration

Use the official `@google/genai` SDK.

Read the Gemini API key from the server-only environment variable:

GEMINI_API_KEY=your_api_key_here

Never expose the API key in client-side JavaScript or a `NEXT_PUBLIC_` environment variable.

Create a server-side route:

POST /api/chat

The frontend must send requests to this route rather than calling Gemini directly.

Request payload should contain:
- The current user message.
- The previous conversation messages, if available.

Validate the payload using a clear, maintainable validation approach.

On the server:
1. Validate the request.
2. Normalize and limit the conversation history.
3. Build the conversation prompt.
4. Call the configured Gemini model using the official SDK.
5. Return the generated response as JSON.
6. Handle invalid requests, rate limits, API failures, and unexpected errors.

Use a current Gemini model that supports text generation and is available through the API. Keep the model name configurable through a server-side environment variable, such as GEMINI_MODEL, and document the expected value.

Do not invent SDK methods or use deprecated APIs. Follow the current official SDK syntax.

### Initial System Instructions

Configure the assistant as follows:

"You are ComputeIQ AI Assistant, a helpful customer-support assistant for ComputeIQ Tech, a fictional electronics shop in New York, NY, USA.

Be friendly, concise, and professional.

You may answer general questions and questions about products, prices, warranties, delivery, returns, and business information.

Use the product and business details explicitly provided in your instructions when answering shop-specific questions.

Do not invent product prices, warranty terms, delivery promises, or shop policies. If you do not know a shop-specific fact, explain that you cannot confirm it.

You are a demonstration chatbot. Do not claim to access real orders, customer accounts, inventory systems, or payment services."

For this initial version, the assistant may answer general knowledge questions. Do not enforce a strict shop-only domain restriction yet. We will introduce domain guardrails in a later tutorial.

Important: Do not include the entire product catalog as hidden client-side data or expose the API key in browser code. Any baseline business context used by the server must be clearly separated from the future RAG implementation.

## 5. Architecture and Project Structure

Use a clean, beginner-friendly project structure similar to:

app/
  layout.tsx
  page.tsx
  globals.css
  api/
    chat/
      route.ts

components/
  Header.tsx
  Hero.tsx
  ProductSection.tsx
  ProductCard.tsx
  AboutSection.tsx
  BenefitsSection.tsx
  ContactSection.tsx
  Footer.tsx
  ChatWidget.tsx
  ChatMessage.tsx
  ChatInput.tsx

lib/
  gemini.ts
  products.ts
  business.ts
  validation.ts

public/
  images/

.env.example
.gitignore
README.md

You may adjust this structure when there is a clear architectural reason. Keep the code understandable for beginners and avoid unnecessary abstractions.

Do not create a monolithic page component containing the entire application.

## 6. Prepare for Future RAG Integration

The next tutorial will add a Markdown knowledge base and a retrieval pipeline.

Prepare the codebase for this without implementing RAG yet.

Requirements:
- Keep the Gemini API integration separate from the React UI.
- Keep static product data separate from UI components.
- Keep baseline business instructions separate from request handling.
- Make it easy to introduce a configurable RAG mode in a future version.
- Avoid tightly coupling the chat widget to the Gemini SDK.
- Do not create fake retrieval logic or simulated embeddings.
- Do not add a vector database in this version.
- Do not claim that the application has RAG, grounding, or retrieval capabilities yet.

The initial implementation must remain a normal Gemini-powered chatbot.

## 7. Security and Reliability

Implement sensible baseline safeguards:
- Keep API keys server-side.
- Validate request payloads on the server.
- Restrict message lengths.
- Limit the conversation history included in requests.
- Return safe, structured error messages.
- Avoid logging API keys or sensitive conversation contents.
- Do not expose stack traces to clients.
- Add a basic rate-limiting strategy appropriate for a local demo, and explain its limitations if it uses in-memory state.
- Do not treat system prompts as security boundaries.
- Do not execute model-generated code.
- Do not connect the model to external tools or sensitive systems.

Include a clear disclaimer that production deployment requires stronger abuse prevention, shared rate limiting, monitoring, and appropriate privacy controls.

## 8. Accessibility and Code Quality

- Use semantic HTML.
- Add accessible labels to interactive elements.
- Ensure keyboard navigation works.
- Maintain adequate color contrast.
- Include loading, error, and empty states.
- Keep TypeScript types explicit where helpful.
- Avoid unnecessary `any` types.
- Follow standard React and Next.js conventions.
- Ensure the application builds without TypeScript errors or lint errors where supported by the chosen setup.
- Avoid placeholder buttons that appear functional but do nothing.

## 9. README and Setup Instructions

Create a detailed beginner-friendly README covering:

1. Prerequisites.
2. Installing Node.js if necessary.
3. Installing project dependencies.
4. Obtaining a Gemini API key from Google's official developer platform.
5. Creating `.env.local`.
6. Configuring `GEMINI_API_KEY` and `GEMINI_MODEL`.
7. Starting the development server.
8. Opening the application locally.
9. Testing the chatbot.
10. Troubleshooting common Gemini API errors.
11. Explaining the frontend/backend architecture.
12. Explaining which parts will later change when adding RAG.
13. Explaining why a client-side API key is unsafe.

Include an `.env.example` containing placeholder values only. Never include a real API key.

## 10. Acceptance Criteria

The project is complete only when:

- The Next.js application starts successfully.
- The landing page looks polished on desktop and mobile.
- All four product cards display the correct demo information.
- Product-specific AI buttons open the chatbot with an appropriate prefilled question.
- The chatbot sends requests to `/api/chat`.
- The server successfully calls Gemini when a valid API key and supported model are configured.
- The assistant returns actual model-generated responses, not hardcoded replies.
- Conversation history supports follow-up questions.
- Loading and error states work.
- No API key is exposed to the browser.
- No RAG or embeddings are implemented yet.
- Setup instructions are complete.

## 11. Implementation Instructions

First inspect the existing workspace and preserve any useful existing files.

Then implement the complete application, install the required dependencies, and run the available checks.

Fix any errors you encounter.

Do not stop after generating a plan or displaying code snippets. Create the actual project files in the workspace.

At the end, provide:
- A concise summary of what was implemented.
- The final project structure.
- The commands to install and run the application.
- The required environment variables.
- The checks and tests actually completed.
- Any limitations that remain.

Do not claim the Gemini integration was tested successfully unless it was actually tested with valid API credentials.
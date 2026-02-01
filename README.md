# Government Form Filler

AI-assisted government form completion with validation.

## Features

- 📋 Common form templates (W-4, I-9, SS-5)
- 👤 Save profile for auto-fill
- ✅ Field validation and error checking
- 💡 AI suggestions for complex fields
- 📄 Export completed forms

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | Get form templates |
| POST | `/api/submit` | Validate and submit form |
| GET/POST | `/api/profile` | Manage user profile |

## Demo Mode

Works without API key with basic validation.

## License

MIT

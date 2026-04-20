# The Alchemists — What's Your AI Archetype?

A dual-mode interactive tool exploring how people relate to AI — reimagined as an alchemical world where each archetype is a distinct kind of practitioner.

**Mode 1: Discover Your Alchemist** — 12 questions, 11 alchemist archetypes (from The Distiller to The Guardian), grounded in research from Anthropic, OpenAI, NBER, and Pew Research Center. Hand-illustrated by Selina Sprout.

**Mode 2: Meet Your AI** — 6 prompts you send to your AI, then reflect on the relationship you've co-created. 6 relationship profiles.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deployment to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. It auto-detects Vite — just click Deploy
4. (Optional) Add environment variables for analytics (see below)

## Analytics Setup (Optional)

The quiz works without analytics — results just log to console. To track responses:

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase-schema.sql`
3. Go to **Settings > API** and copy your Project URL and `anon` key
4. In Vercel, add environment variables:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Redeploy

### What gets tracked:
- Which archetype / profile people land on
- Runner-up archetype
- Dimension scores (anonymized, no personal data)
- Timestamp

### What does NOT get tracked:
- Individual question answers
- IP addresses
- Any personal information

## Project Structure

```
├── index.html              # Entry point with OG meta tags
├── vercel.json             # Deployment config
├── supabase-schema.sql     # Database schema (run in Supabase SQL editor)
├── .env.example            # Environment variable template
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Main application (all views)
│   ├── components/
│   │   └── ShareCard.jsx   # Shareable result image generator
│   ├── data/
│   │   ├── archetypes.js   # 11 archetypes + 6 relationship profiles
│   │   └── questions.js    # Quiz questions, meet prompts, reflection questions
│   └── lib/
│       └── supabase.js     # Analytics client + tracking functions
└── public/
    └── og-default.png      # Default social sharing image (ADD YOUR OWN)
```

## Customization

### Adding illustrations
Place optimized PNGs (400x400px) in `src/assets/` following the naming in `src/assets/README.md`. Then add imports in `src/data/archetypes.js` and replace `image: null` with the imported reference. Components already render images when available, falling back to emoji.

### Updating OG image
Add `og-default.png` (1200x630px) to the `public/` folder for social sharing previews.

### Custom domain
In Vercel: Settings > Domains > Add your domain (e.g., `aiarchetype.com`)

## Credits

Research basis: Anthropic Economic Index, OpenAI/NBER "How People Use ChatGPT" study, Pew Research Center, Yext AI Search Archetypes Report.

Design & concept: Selina Sprout

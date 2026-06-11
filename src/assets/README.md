# Illustration Assets

Place your optimized illustration files here. Recommended specs:
- Format: PNG with transparency
- Size: 400x400px (optimized for web)
- Naming: match exactly as below

## Archetype Illustrations (11)
- alchemist-distiller.webp
- alchemist-excavator.webp
- alchemist-catalyst.webp
- alchemist-cartographer.webp
- alchemist-forgemaster.webp
- alchemist-wayfinder.webp
- alchemist-transmuter.webp
- alchemist-apprentice.webp
- alchemist-guardian.webp
- alchemist-questioner.webp
- alchemist-keeper.webp

## Relationship Profile Illustrations (6) — Phase 2
- dynamic-cocreative.webp
- dynamic-mirror.webp
- dynamic-specialist.webp
- dynamic-coach.webp
- dynamic-utility.webp
- dynamic-explorer.webp

## To activate illustrations in the code:

1. Place files in this directory
2. Open src/data/archetypes.js
3. Add imports at the top:
   ```js
   import distillerImg from '../assets/alchemist-distiller.webp'
   // ... etc for each
   ```
4. Replace `image: null` with `image: distillerImg` for each archetype
5. The components already check for `image` and will render it instead of emoji when present

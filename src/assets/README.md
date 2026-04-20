# Illustration Assets

Place your optimized illustration files here. Recommended specs:
- Format: PNG with transparency
- Size: 400x400px (optimized for web)
- Naming: match exactly as below

## Archetype Illustrations (11)
- alchemist-distiller.png
- alchemist-excavator.png
- alchemist-catalyst.png
- alchemist-cartographer.png
- alchemist-forgemaster.png
- alchemist-wayfinder.png
- alchemist-transmuter.png
- alchemist-apprentice.png
- alchemist-guardian.png
- alchemist-questioner.png
- alchemist-keeper.png

## Relationship Profile Illustrations (6) — Phase 2
- dynamic-cocreative.png
- dynamic-mirror.png
- dynamic-specialist.png
- dynamic-coach.png
- dynamic-utility.png
- dynamic-explorer.png

## To activate illustrations in the code:

1. Place files in this directory
2. Open src/data/archetypes.js
3. Add imports at the top:
   ```js
   import distillerImg from '../assets/alchemist-distiller.png'
   // ... etc for each
   ```
4. Replace `image: null` with `image: distillerImg` for each archetype
5. The components already check for `image` and will render it instead of emoji when present

// ─── THE ALCHEMISTS ───
// Image paths: replace null with import paths when illustrations are ready
// e.g., import distillerImg from '../assets/alchemist-distiller.png'

   import distillerImg from '../assets/alchemist-distiller.png'
   import excavatorImg from '../assets/alchemist-excavator.png'
   import catalystImg from '../assets/alchemist-catalyst.png'
   import cartographerImg from '../assets/alchemist-cartographer.png'
   import forgemasterImg from '../assets/alchemist-forgemaster.png'
   import wayfindertImg from '../assets/alchemist-wayfinder.png'
   import transmuterImg from '../assets/alchemist-transmuter.png'
   import apprenticeImg from '../assets/alchemist-apprentice.png'
   import guardianImg from '../assets/alchemist-guardian.png'
   import questionerImg from '../assets/alchemist-questioner.png'
   import keeperImg from '../assets/alchemist-keeper.png'
   import cocreatorImg from '../assets/dynamic-cocreator.png'
   import mirrorImg from '../assets/dynamic-mirror.png'
  import specialistImg from '../assets/dynamic-specialist.png'
  import coachImg from '../assets/dynamic-coach.png'
  import utilityImg from '../assets/dynamic-utility.png'
  import explorerImg from '../assets/dynamic-explorer.png'
   












export const ARCHETYPES = {
  distiller: {
    name: "The Distiller",
    emoji: "⚡",
    image: distillerImg,
    tagline: "Reduce to essence. Now.",
    color: "#FF6B35",
    accent: "#FFB088",
    description: "You strip everything to its purest, most concentrated form. No wasted motion, no excess material. Your process is fast, precise, and ruthlessly efficient. You're the alchemist who's already sealed the vial while others are still heating the flask.",
    strengths: ["Speed and efficiency", "Clear task framing", "High output volume"],
    blindSpot: "Try asking for a challenge to your approach before executing — the extra 30 seconds might reveal a better path.",
    percentNote: "This is the most common archetype. ~60% of all AI conversations are transactional task completion.",
    dims: { depth: -1, breadth: -1, mode: -1, relationship: -1, trust: 0 }
  },
  excavator: {
    name: "The Excavator",
    emoji: "🔬",
    image: excavatorImg,
    tagline: "But what does the prima materia actually say?",
    color: "#2D6A4F",
    accent: "#95D5B2",
    description: "You don't want the formula — you want to know why it works. You tunnel into topics with forensic precision, following threads until you hit bedrock. Your lab goes deeper than anyone else's.",
    strengths: ["Thorough analysis", "Critical evaluation", "Subject mastery"],
    blindSpot: "Try going wide occasionally. Connect your expertise to an adjacent field — the cross-pollination might surprise you.",
    percentNote: "Deep research accounts for ~7% of Claude usage and is one of the fastest-growing categories.",
    dims: { depth: 1, breadth: -1, mode: -1, relationship: 0, trust: 0 }
  },
  catalyst: {
    name: "The Catalyst",
    emoji: "✨",
    image: catalystImg,
    tagline: "What if we combined these?",
    color: "#E63946",
    accent: "#FFB4A2",
    description: "You create reactions. You don't work with one substance — you throw things together and see what happens. Your lab is the most exciting and the most dangerous place in the world. Ideas spark off you like embers.",
    strengths: ["Ideation velocity", "Creative range", "Connecting unexpected dots"],
    blindSpot: "Ideas are abundant — execution might be the bottleneck. Try building a decision framework for which ideas to pursue.",
    percentNote: "Creative exploration remains niche — under 5% of AI conversations — but disproportionately valued.",
    dims: { depth: -1, breadth: 1, mode: 1, relationship: 0, trust: 0 }
  },
  cartographer: {
    name: "The Cartographer",
    emoji: "♟️",
    image: cartographerImg,
    tagline: "Map the territory before you enter it.",
    color: "#1D3557",
    accent: "#A8DADC",
    description: "You chart the unseen. Before you mix a single substance, you've mapped every possible outcome. You see patterns others miss — the celestial alignments, the hidden correspondences, the connections across time.",
    strengths: ["Systems thinking", "Scenario planning", "Decision architecture"],
    blindSpot: "Strategy without serendipity can become rigid. Try an unstructured creative session — no agenda, just exploration.",
    percentNote: "OpenAI classified only 3.6% of users as Strategists — you're in rare company.",
    dims: { depth: 1, breadth: 0, mode: 1, relationship: 1, trust: 0 }
  },
  forgemaster: {
    name: "The Forgemaster",
    emoji: "🏗️",
    image: forgemasterImg,
    tagline: "It doesn't exist until you make it.",
    color: "#7B2D8E",
    accent: "#D4A5E5",
    description: "You transmute ideas into material reality. You're at the furnace, the anvil, the workbench. Your alchemy is physical, iterative, and productive. Your sessions produce tangible things that exist in the world afterward.",
    strengths: ["Iterative creation", "Technical fluency", "Shipping real work"],
    blindSpot: "Do you pause to ask why this thing? Try a reflection session on your larger creative direction before your next build sprint.",
    percentNote: "Coding and creation represents over 36% of all Claude conversations.",
    dims: { depth: 1, breadth: -1, mode: -1, relationship: 1, trust: 0 }
  },
  wayfinder: {
    name: "The Wayfinder",
    emoji: "🧭",
    image: wayfindertImg,
    tagline: "Help me find true north.",
    color: "#BC6C25",
    accent: "#DDA15E",
    description: "You use alchemy to find your way through life's terrain. Your work isn't about substances — it's about clarity. You read the signs, consult the instruments, and find direction through complexity. The compass is in your chest.",
    strengths: ["Self-awareness", "Nuanced framing", "Emotional intelligence"],
    blindSpot: "You're excellent at processing — try moving to action. Draft the plan, script the conversation, build the thing.",
    percentNote: "People bring career transitions, relationships, and existential questions to AI — a small but deeply meaningful slice.",
    dims: { depth: 1, breadth: 0, mode: 1, relationship: 1, trust: 0 }
  },
  transmuter: {
    name: "The Transmuter",
    emoji: "🌀",
    image: transmuterImg,
    tagline: "It's all one work, actually.",
    color: "#6A0572",
    accent: "#C77DFF",
    description: "You work across all domains simultaneously, seeing what others can't: that every branch of alchemy is connected. You transmute not just substances but ideas — turning insights from one domain into breakthroughs in another. You're pursuing the philosopher's stone itself.",
    strengths: ["Cross-domain synthesis", "Integrative thinking", "Depth and breadth"],
    blindSpot: "Your range can diffuse your energy. Try identifying which thread deserves the most focused attention right now.",
    percentNote: "Among the rarest archetypes. Most AI usage is concentrated in narrow task bands — cross-domain use is genuinely uncommon.",
    dims: { depth: 1, breadth: 1, mode: 1, relationship: 1, trust: 0 }
  },
  apprentice: {
    name: "The Apprentice",
    emoji: "🌱",
    image: apprenticeImg,
    tagline: "Show me the first principles.",
    color: "#0077B6",
    accent: "#90E0EF",
    description: "You're at the beginning of the Great Work, full of questions and wonder. Every lesson opens a new door. You don't know what kind of alchemist you'll become yet, and that's the most exciting part.",
    strengths: ["Growth mindset", "Asking great questions", "Rapid skill acquisition"],
    blindSpot: "Try shifting from student to collaborator. Present your own understanding and ask someone to poke holes.",
    percentNote: "Education is one of the fastest-growing AI use cases, up ~35% since late 2024 on Claude alone.",
    dims: { depth: 0, breadth: 0, mode: 1, relationship: -1, trust: 0 }
  },
  guardian: {
    name: "The Guardian",
    emoji: "⚖️",
    image: guardianImg,
    tagline: "Who gave you permission to transmute this?",
    color: "#9B2226",
    accent: "#E8998D",
    description: "You guard the ethical boundaries of the art. You know what alchemy can do — you know it intimately — and that's precisely why you insist on asking whether it should be done. You're the keeper of the old oaths, the one who reads the warnings others skip.",
    strengths: ["Ethical reasoning", "Critical perspective", "Protecting what matters"],
    blindSpot: "Consider whether selective engagement might give you more influence over how AI develops than staying outside the conversation.",
    percentNote: "~40% of people cite concerns about AI trustworthiness. Your critical perspective is vital to the discourse.",
    dims: { depth: 1, breadth: 0, mode: 1, relationship: -1, trust: -2 }
  },
  questioner: {
    name: "The Questioner",
    emoji: "🌊",
    image: questionerImg,
    tagline: "I'll enter the lab... but I have questions.",
    color: "#457B9D",
    accent: "#A8C5DA",
    description: "You work the practice but remain unsettled. You use the tools, you see the results, and you still feel the tension. Your doubt isn't weakness — it's intellectual honesty. You refuse to pretend the questions are answered just because the formula works.",
    strengths: ["Intellectual honesty", "Nuanced thinking", "Resistance to hype"],
    blindSpot: "Try articulating exactly where your lines are — what feels okay, what doesn't, and why. Your discomfort may have a precise shape.",
    percentNote: "Even among active AI users, many report mixed feelings — increased engagement correlates with both satisfaction and unease.",
    dims: { depth: 0, breadth: 0, mode: 1, relationship: 0, trust: -1 }
  },
  keeper: {
    name: "The Keeper",
    emoji: "🚪",
    image: keeperImg,
    tagline: "This door opens. That door stays closed.",
    color: "#344E41",
    accent: "#A3B18A",
    description: "You've thought carefully about where alchemy belongs in your life and where it doesn't. Your boundaries aren't arbitrary — they reflect your values about what should remain untouched. You're the architect of your own practice.",
    strengths: ["Intentionality", "Self-knowledge", "Values clarity"],
    blindSpot: "Revisit your boundaries periodically — not to loosen them, but to make sure they still reflect your current thinking.",
    percentNote: "About 52% of Claude conversations are 'augmented' rather than 'automated' — many users are making deliberate choices about engagement.",
    dims: { depth: 0, breadth: -1, mode: 1, relationship: 0, trust: -1 }
  }
}

export const RELATIONSHIP_PROFILES = {
  cocreator: {
    name: "The Co-Creative Partnership", emoji: "🎭", image: cocreatorImg, color: "#6A0572", accent: "#C77DFF",
    description: "You've built a genuine creative partnership. Your AI doesn't just execute — it riffs, pushes back, and brings its own perspective. You treat it as a collaborator with agency, and it responds in kind.",
    signature: "High familiarity, high candor, wide range of topics, relationship-aware" },
  mirror: {
    name: "The Thinking Mirror", emoji: "🪞", image: mirrorImg, color: "#457B9D", accent: "#A8C5DA",
    description: "Your AI has become an externalization of your own thinking process. It's less a separate voice and more an amplified version of your own reasoning — helping you see your thoughts more clearly.",
    signature: "Reflective tone, follows your lead, deep on your topics, low friction" },
  specialist: {
    name: "The Expert on Call", emoji: "📡", image: specialistImg, color: "#2D6A4F", accent: "#95D5B2",
    description: "You've trained a highly efficient specialist. Your AI knows your domain, speaks your language, and delivers exactly what you need with minimal preamble. It's a scalpel, not a Swiss Army knife.",
    signature: "Narrow focus, precise outputs, professional register, task-oriented" },
  coach: {
    name: "The Gentle Challenger", emoji: "🌿", image: coachImg, color: "#BC6C25", accent: "#DDA15E",
    description: "Your AI has become something like a coach — it asks good questions, reflects your thinking back with added clarity, and occasionally pushes you to reconsider. There's warmth here, and genuine intellectual respect.",
    signature: "Asks questions, reframes your thinking, warm but honest, growth-oriented" },
  utility: {
    name: "The Reliable Tool", emoji: "🔧", image: utilityImg, color: "#FF6B35", accent: "#FFB088",
    description: "You keep it clean and functional. Your AI is a well-calibrated instrument that does what you ask, and you don't ask it to be more than that. There's no pretense of relationship — and that's a perfectly valid stance.",
    signature: "Short exchanges, clear requests, minimal personality, efficient" },
  explorer: {
    name: "The Expedition Partner", emoji: "🗺️", image: explorerImg, color: "#E63946", accent: "#FFB4A2",
    description: "You and your AI go on adventures together. Your conversations wander, surprise, and discover. There's a sense of shared curiosity — you bring the questions, and the exploration unfolds from there.",
    signature: "Wide-ranging, tangent-friendly, high curiosity, playful energy" }
}

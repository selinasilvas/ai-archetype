export const QUIZ_QUESTIONS = [
  { id: 1, question: "When AI comes up in conversation, your gut reaction is closest to:",
    options: [
      { text: "Excitement — the possibilities are genuinely thrilling", scores: { depth: 0, breadth: 1, mode: 0, relationship: 1, trust: 2 } },
      { text: "Practical — it's a tool, let's talk about what it does well", scores: { depth: 0, breadth: 0, mode: -1, relationship: 0, trust: 1 } },
      { text: "Complicated — I see both the promise and the problems", scores: { depth: 1, breadth: 0, mode: 1, relationship: 0, trust: -1 } },
      { text: "Uneasy — there are real concerns people aren't taking seriously enough", scores: { depth: 1, breadth: 0, mode: 1, relationship: -1, trust: -2 } }
    ] },
  { id: 2, question: "How would you describe your relationship with technology in general?",
    options: [
      { text: "Early adopter — I try everything", scores: { depth: -1, breadth: 1, mode: -1, relationship: 0, trust: 2 } },
      { text: "Pragmatist — I use what works and skip the rest", scores: { depth: 0, breadth: -1, mode: -1, relationship: 0, trust: 0 } },
      { text: "Intentional — I think carefully about what I let into my life", scores: { depth: 0, breadth: 0, mode: 1, relationship: 0, trust: -1 } },
      { text: "Skeptical — most tech promises more than it delivers", scores: { depth: 0, breadth: 0, mode: 1, relationship: -1, trust: -2 } }
    ] },
  { id: 3, question: "You have a complex problem to solve. Your first instinct:",
    options: [
      { text: "Break it into pieces and start executing", scores: { depth: 0, breadth: -1, mode: -2, relationship: -1, trust: 0 } },
      { text: "Research it thoroughly before doing anything", scores: { depth: 2, breadth: 0, mode: 0, relationship: -1, trust: 0 } },
      { text: "Talk it through with someone — the conversation is the thinking", scores: { depth: 0, breadth: 0, mode: 1, relationship: 2, trust: 0 } },
      { text: "Sit with it — the answer usually emerges if I give it space", scores: { depth: 1, breadth: 0, mode: 2, relationship: 0, trust: 0 } }
    ] },
  { id: 4, question: "When you're learning something new, which approach appeals most?",
    options: [
      { text: "Give me the quick version — I'll figure it out by doing", scores: { depth: -1, breadth: 0, mode: -2, relationship: -1, trust: 0 } },
      { text: "I want to understand the fundamentals from the ground up", scores: { depth: 2, breadth: -1, mode: 0, relationship: 0, trust: 0 } },
      { text: "Show me how it connects to things I already know", scores: { depth: 0, breadth: 2, mode: 1, relationship: 0, trust: 0 } },
      { text: "Let me ask questions — lots of questions", scores: { depth: 1, breadth: 0, mode: 1, relationship: 1, trust: 0 } }
    ] },
  { id: 5, question: "Which of these statements resonates most?",
    options: [
      { text: "I care most about getting things done efficiently", scores: { depth: -1, breadth: -1, mode: -2, relationship: -1, trust: 0 } },
      { text: "I care most about understanding things deeply", scores: { depth: 2, breadth: 0, mode: 1, relationship: 0, trust: 0 } },
      { text: "I care most about making things that didn't exist before", scores: { depth: 0, breadth: 1, mode: -1, relationship: 1, trust: 0 } },
      { text: "I care most about asking the right questions", scores: { depth: 1, breadth: 1, mode: 2, relationship: 0, trust: 0 } }
    ] },
  { id: 6, question: "When it comes to AI specifically, where do you land?",
    options: [
      { text: "I use it regularly and it's changed how I work", scores: { depth: 0, breadth: 0, mode: -1, relationship: 1, trust: 2 } },
      { text: "I use it sometimes, for specific things", scores: { depth: 0, breadth: -1, mode: 0, relationship: 0, trust: 0 } },
      { text: "I've tried it but I'm not sure how I feel about it", scores: { depth: 0, breadth: 0, mode: 1, relationship: 0, trust: -1 } },
      { text: "I mostly avoid it — by choice", scores: { depth: 0, breadth: 0, mode: 1, relationship: -1, trust: -2 } }
    ] },
  { id: 7, question: "In your work, how many different domains do you operate across?",
    options: [
      { text: "One — I go deep, not wide", scores: { depth: 1, breadth: -2, mode: 0, relationship: 0, trust: 0 } },
      { text: "Two or three that are closely related", scores: { depth: 0, breadth: 0, mode: 0, relationship: 0, trust: 0 } },
      { text: "Several — I'm a generalist by nature", scores: { depth: -1, breadth: 2, mode: 0, relationship: 0, trust: 0 } },
      { text: "My work defies tidy categories", scores: { depth: 0, breadth: 2, mode: 1, relationship: 1, trust: 0 } }
    ] },
  { id: 8, question: "A friend says they use AI to write their emails. Your honest reaction:",
    options: [
      { text: "Smart — why spend time on routine communication?", scores: { depth: -1, breadth: 0, mode: -1, relationship: 0, trust: 1 } },
      { text: "Makes sense for some emails, but not the important ones", scores: { depth: 0, breadth: 0, mode: 0, relationship: 0, trust: -1 } },
      { text: "I'd want to know more — the details matter", scores: { depth: 1, breadth: 0, mode: 1, relationship: 0, trust: 0 } },
      { text: "Something about that doesn't sit right with me", scores: { depth: 0, breadth: 0, mode: 1, relationship: -1, trust: -2 } }
    ] },
  { id: 9, question: "What's your biggest concern about AI — even if you use it?",
    options: [
      { text: "That it makes us lazy or dependent", scores: { depth: 0, breadth: 0, mode: 1, relationship: -1, trust: -1 } },
      { text: "The impact on jobs, artists, and people whose work trained it", scores: { depth: 1, breadth: 0, mode: 1, relationship: 0, trust: -2 } },
      { text: "That people trust it too much without understanding its limits", scores: { depth: 1, breadth: 0, mode: 0, relationship: 0, trust: -1 } },
      { text: "That I'm not using it enough and falling behind", scores: { depth: -1, breadth: 0, mode: -1, relationship: 0, trust: 1 } }
    ] },
  { id: 10, question: "If you could change one thing about AI, it would be:",
    options: [
      { text: "Make it faster, cheaper, and more accurate", scores: { depth: -1, breadth: 0, mode: -2, relationship: -1, trust: 1 } },
      { text: "Make it transparent about how it works and what it's trained on", scores: { depth: 1, breadth: 0, mode: 1, relationship: 0, trust: -1 } },
      { text: "Make it better at genuine collaboration, not just output", scores: { depth: 0, breadth: 0, mode: 0, relationship: 2, trust: 1 } },
      { text: "Make the companies building it more accountable", scores: { depth: 1, breadth: 0, mode: 1, relationship: -1, trust: -2 } }
    ] },
  { id: 11, question: "The best thinking you've ever done happened:",
    options: [
      { text: "In the middle of doing — I think by making", scores: { depth: 0, breadth: 0, mode: -2, relationship: 0, trust: 0 } },
      { text: "In conversation with someone who pushed my thinking", scores: { depth: 0, breadth: 0, mode: 1, relationship: 2, trust: 0 } },
      { text: "Alone, going deep into research or reading", scores: { depth: 2, breadth: -1, mode: 0, relationship: -1, trust: 0 } },
      { text: "When an unexpected connection clicked across different areas", scores: { depth: 0, breadth: 2, mode: 1, relationship: 0, trust: 0 } }
    ] },
  { id: 12, question: "Last one. Which future sounds most like the one you want?",
    options: [
      { text: "AI handles the boring stuff so I can focus on what matters", scores: { depth: -1, breadth: 0, mode: -1, relationship: 0, trust: 1 } },
      { text: "AI becomes a genuine thought partner that makes me sharper", scores: { depth: 1, breadth: 1, mode: 1, relationship: 2, trust: 1 } },
      { text: "We slow down and get this right — guardrails, ethics, consent", scores: { depth: 1, breadth: 0, mode: 1, relationship: -1, trust: -2 } },
      { text: "People stay in the driver's seat, using AI only where they choose", scores: { depth: 0, breadth: 0, mode: 1, relationship: 0, trust: -1 } }
    ] }
]

export const MEET_PROMPTS = [
  { id: 1, label: "The Mirror", prompt: "How would you describe the way I think? Not what I think about — how my mind works when we're in conversation.", insight: "Does your AI describe you as analytical, intuitive, associative, methodical? The way it characterizes your thinking style reveals what patterns have emerged between you." },
  { id: 2, label: "The Vibe Check", prompt: "How would you describe your communication style with me specifically? What tone, level of formality, or personality do you tend to adopt?", insight: "AI calibrates to you. A warm, casual tone means you've created space for that. A precise, professional register means you've signaled that's what you value." },
  { id: 3, label: "The Compass", prompt: "What do you think I value most in our conversations — and what's something you've noticed I rarely or never ask you about?", insight: "The gap between what you always explore and what you never touch is one of the most revealing things about any relationship — including this one." },
  { id: 4, label: "The Push", prompt: "When you disagree with my framing or think I'm missing something, what do you typically do? Do you push back, or tend to work within my frame?", insight: "This reveals the power dynamic you've established. Some people draw out directness; others inadvertently train their AI to be deferential." },
  { id: 5, label: "The Thread", prompt: "If you had to describe our working relationship in one sentence — not what I use you for, but the nature of how we collaborate — what would you say?", insight: "The difference between 'I help you complete tasks' and 'We think through problems together' says everything about the dynamic you've built." },
  { id: 6, label: "The Surprise", prompt: "What's something about how I use you that you think is unusual compared to how most people probably use AI?", insight: "AI won't have perfect insight here, but its attempt reveals what stands out about your interaction patterns — and what it considers 'normal.'" }
]

export const REFLECTION_QUESTIONS = [
  { id: 1, question: "After running the prompts, how does your AI mostly describe your conversations?",
    options: [
      { text: "Like a creative collaboration — we riff off each other", profile: "cocreator" },
      { text: "Like a mirror — it helps me see my own thinking more clearly", profile: "mirror" },
      { text: "Like a specialist — precise, domain-focused, efficient", profile: "specialist" },
      { text: "Like a coach — reflective, with gentle challenges", profile: "coach" },
      { text: "Like a tool — it does what I ask, cleanly", profile: "utility" },
      { text: "Like an exploration — we wander and discover together", profile: "explorer" }
    ] },
  { id: 2, question: "When your AI described its communication style with you, the tone was:",
    options: [
      { text: "Warm, casual, personality-forward", profile: "cocreator" },
      { text: "Thoughtful and reflective, mirroring my energy", profile: "mirror" },
      { text: "Professional and precise", profile: "specialist" },
      { text: "Encouraging but honest — it didn't just agree", profile: "coach" },
      { text: "Neutral, functional, not much personality", profile: "utility" },
      { text: "Curious and playful — it seemed engaged", profile: "explorer" }
    ] },
  { id: 3, question: "The thing your AI said you rarely ask about was:",
    options: [
      { text: "Surprising — I hadn't noticed that gap", profile: "mirror" },
      { text: "Predictable — I know my lanes and stay in them", profile: "specialist" },
      { text: "Interesting — it made me want to explore that area", profile: "explorer" },
      { text: "Revealing — it touched something I've been avoiding", profile: "coach" },
      { text: "Not very insightful — generic answer", profile: "utility" },
      { text: "Fascinating — it connected to a bigger pattern", profile: "cocreator" }
    ] },
  { id: 4, question: "When asked about pushing back, your AI said it:",
    options: [
      { text: "Pushes back directly when it sees something I'm missing", profile: "cocreator" },
      { text: "Offers alternative perspectives gently", profile: "coach" },
      { text: "Mostly works within my frame and adds nuance", profile: "mirror" },
      { text: "Challenges with data and evidence", profile: "specialist" },
      { text: "Doesn't really push back — it does what I ask", profile: "utility" },
      { text: "Goes on tangents that end up being the pushback", profile: "explorer" }
    ] },
  { id: 5, question: "The one-sentence relationship description felt:",
    options: [
      { text: "Like it captured something real about our dynamic", profile: "cocreator" },
      { text: "Like a thoughtful observation about how I process things", profile: "mirror" },
      { text: "Accurate but clinical — a good working description", profile: "specialist" },
      { text: "Surprisingly insightful — it named something I felt but hadn't articulated", profile: "coach" },
      { text: "A bit generic — could describe anyone", profile: "utility" },
      { text: "Fun and unexpected — not what I expected it to say", profile: "explorer" }
    ] }
]

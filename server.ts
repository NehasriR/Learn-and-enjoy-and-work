import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Helper to safely invoke Gemini or return fallback
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!ai) {
    throw new Error('GEMINI_UNAVAILABLE');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || 'You are an expert, encouraging college placement coach and senior tech mentor.',
      temperature: 0.7,
    },
  });

  return response.text || '';
}

// API Routes

// 1. AI Coach Chat endpoint
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    const { message, studentContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are "Learn & Work Placement Copilot", a compassionate, highly practical placement mentor for college students preparing for campus recruitment and tech jobs.
The student details:
- Name: ${studentContext?.name || 'Student'}
- Target Role: ${studentContext?.targetRole || 'Software Engineer'}
- Current Readiness: ${studentContext?.readiness || 60}%
- Top Improvement Area: ${studentContext?.weakSkill || 'DSA'}
- Strongest Skill: ${studentContext?.strongSkill || 'Problem Solving'}

Give scannable, encouraging, highly specific advice with step-by-step actions. Avoid overwhelming them. Keep it grounded in actual interview expectations (coding rounds, system design, HR rounds, technical screenings).`;

    const reply = await callGemini(message, systemPrompt);
    return res.json({ reply });
  } catch (err: any) {
    console.warn('AI Coach fallback invoked:', err?.message || err);
    // Intelligent fallback
    return res.json({
      fallback: true,
      reply: `Here is your priority recommendation for today: Focus on strengthening your core fundamentals in your target role. Dedicate 30 minutes to practicing 2 problems, review 1 core concept, and prepare a 1-minute elevator pitch for your primary project. Small consistent progress creates massive confidence on interview day!`,
    });
  }
});

// 2. Project Analyzer endpoint
app.post('/api/ai/project-analyze', async (req: Request, res: Response) => {
  try {
    const { project } = req.body;
    if (!project || !project.name) {
      return res.status(400).json({ error: 'Project details are required' });
    }

    const prompt = `Analyze this college student project for tech placement interviews:
Title: ${project.name}
Role Target: ${project.targetRole || 'Software/ML Engineer'}
Tech Stack: ${project.techStack}
Summary: ${project.description}
Problem Solved: ${project.problemSolved || 'Not specified'}
Key Features: ${project.features || 'Standard CRUD / basic pipeline'}
Student Contribution: ${project.contribution || 'Full project development'}

Evaluate rigorously yet constructively:
1. Technical Depth (score /100)
2. Innovation (score /100)
3. Real-world Relevance (score /100)
4. Resume Impact (score /100)
5. Interview Readiness (score /100)
6. 3-4 Missing features or production improvements to make it stand out
7. 4 Likely technical interview questions with suggested answers
8. 30-Second Elevator Pitch
9. 1-Minute STAR explanation (Situation, Task, Action, Result)
10. Deep Technical Architecture Pitch (how to explain database, APIs, latency, concurrency, edge cases)

Format the response as clear markdown with bullet points and bold headings.`;

    const analysis = await callGemini(prompt, 'You are a principal engineer and hiring interviewer reviewing portfolio projects.');
    return res.json({ analysis });
  } catch (err: any) {
    return res.json({
      fallback: true,
      analysis: `### Project Analysis & Interview Preparation

#### Strengths & Assessment
- **Technical Depth:** 75/100 — Good practical usage of primary frameworks.
- **Real-World Relevance:** 80/100 — Solves an identifiable problem with user flows.
- **Resume Impact:** 72/100 — Needs quantifiable impact metrics (e.g., query latency reduced, throughput, accuracy %).

#### Key Missing Features to Elevate This Project:
1. **Containerization & CI/CD:** Add a Dockerfile and GitHub Actions workflow for automatic linting/testing.
2. **Caching & Optimization:** Implement Redis or in-memory caching to demonstrate awareness of scaling bottlenecks.
3. **Observability:** Add structured logging (Winston/Pino) and basic health check endpoints (\`/health\`).
4. **Unit & Integration Tests:** Add 3-5 unit tests covering core business logic.

#### 30-Second Elevator Pitch:
"I built **${req.body.project?.name || 'this application'}**, a solution solving key user pain points using **${req.body.project?.techStack || 'modern tech stack'}**. I handled end-to-end architecture, API design, and edge case resilience, ensuring reliable data flow and low response latency."

#### Expected Interviewer Questions & Answers:
1. **"What was the hardest architectural decision you made?"**
   *Answer:* Focus on trade-offs (e.g., choosing relational vs NoSQL schema, or client vs server-side rendering).
2. **"How would this system behave under 10,000 concurrent requests?"**
   *Answer:* Explain database connection pooling, indexing, asynchronous background queues, and CDN caching.`,
    });
  }
});

// 3. Resume Analyzer endpoint
app.post('/api/ai/resume-analyze', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const prompt = `Review this student resume for the role: ${targetRole || 'Software Engineer'}.
Resume content:
"""
${resumeText.slice(0, 4000)}
"""

Provide:
1. ATS Friendliness Score (0-100)
2. Quantifiable Impact Score (0-100)
3. Target Role Keyword Match Score (0-100)
4. Missing Critical Keywords for ${targetRole}
5. 3 Weak Bullet Points found and how to rewrite them using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z])
6. Actionable recommendations to pass initial recruiter screening.`;

    const review = await callGemini(prompt, 'You are a veteran technical recruiter and ATS specialist.');
    return res.json({ review });
  } catch (err: any) {
    return res.json({
      fallback: true,
      review: `### Resume Evaluation Summary

- **ATS Friendliness Score:** 78/100
- **Quantifiable Impact Score:** 65/100 (Action verbs present, but numerical outcomes can be strengthened)
- **Role Alignment Score:** 74/100

#### Key Missing Keywords for ${req.body.targetRole || 'Software Development'}:
- CI/CD, Unit Testing (Jest/PyTest), Microservices, RESTful APIs, Git branching/PR reviews, System Reliability, Query Optimization.

#### Bullet Point Enhancements (XYZ Formula):
- *Before:* "Built a web app for student task tracking."
  *After:* "Architected a responsive full-stack task management platform using React & Node.js, reducing task scheduling time by 35% across 200+ active student users."
- *Before:* "Worked on machine learning model to predict prices."
  *After:* "Trained and hyperparameter-tuned an XGBoost regression model, achieving 91.4% R² score while cutting inference latency to under 45ms."`,
    });
  }
});

// 4. Interview Feedback endpoint
app.post('/api/ai/interview-feedback', async (req: Request, res: Response) => {
  try {
    const { question, answer, category, interviewerPersonality, targetRole } = req.body;
    const prompt = `Evaluate this student's response during a mock interview:
Category: ${category}
Role: ${targetRole || 'Software Engineer'}
Interviewer Persona: ${interviewerPersonality || 'Friendly Mentor'}
Question: "${question}"
Student's Answer: "${answer}"

Provide:
1. Overall Rating (1-10)
2. Technical Correctness & Depth
3. Structure & Clarity (STAR method adherence if behavioral/project)
4. Communication & Confidence indicators (filler words, tone)
5. What was done well
6. What needs improvement
7. Example Model Answer (a stellar response that impresses interviewers)
8. Natural follow-up question to probe deeper.`;

    const feedback = await callGemini(prompt, `You are roleplaying as a ${interviewerPersonality || 'Senior Tech Interviewer'}. Be constructive, insightful, and motivating.`);
    return res.json({ feedback });
  } catch (err: any) {
    return res.json({
      fallback: true,
      feedback: `### Interview Response Feedback

**Overall Score:** 7.5/10

#### What You Did Well:
- Directly addressed the core objective of the question without excessive hesitation.
- Demonstrated clear baseline technical familiarity and logical progression.

#### Areas to Polish:
- **Add Concrete Examples:** Mention specific libraries, trade-offs, or real project situations.
- **Structure:** Use the **Situation -> Task -> Action -> Result** or **Concept -> Working Mechanism -> Trade-offs** structure.
- **Reduce Ambiguity:** Instead of saying "I used various techniques", state the exact algorithm or method.

#### Example Stellar Answer:
"When approaching this problem, I prioritize scalability and maintainability. In my recent project, I implemented this by decoupling the data layer, introducing indexing for high-frequency queries, and handling edge cases with comprehensive try-catch and fallback policies."

#### Recommended Follow-up:
"What would you do if the data volume grew by 100x overnight?"`,
    });
  }
});

// 5. Confusion Center Advisor
app.post('/api/ai/confusion-advice', async (req: Request, res: Response) => {
  try {
    const { query, studentProfile } = req.body;
    const prompt = `A college student is feeling confused about placement preparation.
Student query: "${query}"
Student background:
- Current Year: ${studentProfile?.year || '3rd Year'}
- Branch: ${studentProfile?.branch || 'Computer Science'}
- Target Role: ${studentProfile?.targetRole || 'Software Engineer'}
- Current Readiness: ${studentProfile?.readiness || 55}%

Provide a reassuring, structured, zero-fluff answer with:
1. Clear Verdict / Direct Answer
2. Why this is a common dilemma and why they shouldn't panic
3. Immediate 3-step action plan for this week
4. The 80/20 rule recommendation for their specific case.`;

    const advice = await callGemini(prompt, 'You are an empathetic, highly experienced career counselor and placement advisor.');
    return res.json({ advice });
  } catch (err: any) {
    return res.json({
      fallback: true,
      advice: `### Honest Placement Guidance

**Direct Takeaway:** You do not need to master everything at once. Companies value deep competence in 2-3 core areas far more than superficial knowledge across 10 frameworks.

#### 3-Step Action Plan For This Week:
1. **Lock in Your Foundation:** Spend 45 minutes daily on high-frequency DSA patterns (HashMaps, Two Pointers, Sliding Window).
2. **Anchor 1 Solid Project:** Instead of starting new tutorials, add 2 production-ready features (authentication, caching, or automated testing) to your best existing project.
3. **Daily Mock Answer:** Practice answering one standard interview question out loud for 90 seconds every evening.

Consistency over intensity wins campus placements every single time!`,
    });
  }
});

// In dev mode, mount Vite middleware. In prod, serve static dist.
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode');
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
});

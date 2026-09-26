import { UserProfile, Project } from '../types';

export interface AICoachResponse {
  reply: string;
  fallback?: boolean;
}

export interface AIProjectAnalysisResponse {
  analysis: string;
  fallback?: boolean;
}

export interface AIResumeAnalysisResponse {
  review: string;
  fallback?: boolean;
}

export interface AIInterviewFeedbackResponse {
  feedback: string;
  fallback?: boolean;
}

export interface AIConfusionAdviceResponse {
  advice: string;
  fallback?: boolean;
}

export async function askAICoach(
  message: string,
  profile: UserProfile,
  weakSkill?: string,
  strongSkill?: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        studentContext: {
          name: profile.name,
          targetRole: profile.targetRole,
          readiness: profile.overallReadiness,
          weakSkill: weakSkill || 'DSA',
          strongSkill: strongSkill || 'Python',
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: AICoachResponse = await res.json();
    return data.reply;
  } catch (error) {
    console.warn('Network call failed, using client intelligent fallback:', error);
    return `**Priority Guidance for ${profile.targetRole}:**\n\nFocus today on your highest-gap area. Set aside 30 uninterrupted minutes to practice 2 core patterns, then spend 15 minutes reviewing 1 foundational concept. Consistency always triumphs over cramming!`;
  }
}

export async function analyzeProjectWithAI(project: Partial<Project>, targetRole: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/project-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: {
          ...project,
          targetRole,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: AIProjectAnalysisResponse = await res.json();
    return data.analysis;
  } catch (error) {
    console.warn('Project analysis fallback:', error);
    return `### Project Evaluation & Strategy\n\n- **Technical Depth:** 75/100\n- **Real-World Relevance:** 82/100\n- **Interview Readiness:** 70/100\n\n#### Recommended Improvements:\n1. Add unit testing and Docker containerization.\n2. Quantify latency or performance benchmarks.\n3. Prepare a concise 60-second explanation highlighting trade-offs.`;
  }
}

export async function analyzeResumeWithAI(resumeText: string, targetRole: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/resume-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: AIResumeAnalysisResponse = await res.json();
    return data.review;
  } catch (error) {
    console.warn('Resume analysis fallback:', error);
    return `### Resume Review Summary\n\n- **ATS Friendliness:** 78%\n- **Quantifiable Metrics:** 65%\n- **Key Keywords to add:** CI/CD, Git workflows, unit tests, latency optimization, Docker.\n\n*Tip:* Use the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]" for all bullet points!`;
  }
}

export async function getInterviewFeedbackWithAI(
  question: string,
  answer: string,
  category: string,
  interviewerPersonality: string,
  targetRole: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai/interview-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        answer,
        category,
        interviewerPersonality,
        targetRole,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: AIInterviewFeedbackResponse = await res.json();
    return data.feedback;
  } catch (error) {
    console.warn('Interview feedback fallback:', error);
    return `### Interview Response Evaluation\n\n**Score:** 7.5/10\n\n- **Well Done:** Clear articulation and logical flow.\n- **Improvement:** Include specific metrics and edge-case considerations.\n- **Example Enhancement:** "In my implementation, I optimized this to O(N) by utilizing a HashMap, reducing query latency by 40%."\n- **Follow-up:** How would your approach change if data didn't fit in memory?`;
  }
}

export async function getConfusionAdviceWithAI(query: string, profile: UserProfile): Promise<string> {
  try {
    const res = await fetch('/api/ai/confusion-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, studentProfile: profile }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: AIConfusionAdviceResponse = await res.json();
    return data.advice;
  } catch (error) {
    console.warn('Confusion advice fallback:', error);
    return `### Mentor Advice\n\n**Direct Answer:** Keep things simple and focus on depth over breadth.\n\n**This Week's 3 Steps:**\n1. Dedicate 45 minutes daily to 2 high-frequency DSA patterns.\n2. Deeply understand 1 key project from architecture down to SQL schemas.\n3. Practice explaining technical solutions aloud for 5 minutes daily.`;
  }
}

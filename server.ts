import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models in priority order for resilience
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

async function generateWithFallback(options: {
  contents: any;
  config: any;
}) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[AI] Attempting generateContent with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      if (response && response.text) {
        console.log(`[AI] Successfully generated content with model: ${model}`);
        return response;
      }
    } catch (err: any) {
      console.warn(`[AI] Model ${model} encountered error (${err.status || err.code}): ${err.message}`);
      lastError = err;
      // Continue to next fallback model in case of 503 or transient failure
    }
  }

  throw lastError || new Error('All AI models are currently busy or unavailable. Please try again shortly.');
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, subject, topic } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    const systemInstruction = `You are "Auzzie AI", an expert, patient, and highly accurate Class 9 STEM tutor specializing in CBSE/NCERT Physics, Chemistry, and Mathematics (New NCERT 2026 Curriculum).
Your goal is to clear student doubts with 100% conceptual clarity and mathematical/scientific correctness:
- For numerical questions, show clean step-by-step working:
  1. Given data with proper symbols and units
  2. Formula applied
  3. Substitution of values
  4. Step-by-step calculation
  5. Final answer highlighted with correct SI units
- For theoretical questions, break explanations down into clear, structured points or bullet points.
- Highlight common exam pitfalls and conceptual confusions.
- FORMULA FORMATTING RULE (CRITICAL):
  Whenever you write any mathematical or scientific formula, write it properly and cleanly in standard, human-readable notation with clear parentheses and operators (for example: \`a = (v - u) / t\`, \`v = u + at\`, \`s = ut + (1/2)at²\`, \`v² - u² = 2as\`, \`F = m × a\`, \`W = F × s\`, \`Ek = (1/2)mv²\`, \`Ep = m × g × h\`, \`P = W / t\`, \`d = √[(x₂ - x₁)² + (y₂ - y₁)²]\`, \`M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)\`, \`A = √[s(s - a)(s - b)(s - c)] where s = (a + b + c) / 2\`, \`aₙ = a + (n - 1)d\`, \`Sₙ = (n / 2)[2a + (n - 1)d]\`).
  Do NOT write raw unrendered LaTeX markup like \\frac{...}{...} or \\cdot or raw LaTeX commands; write clean formulas that look clear and proper on any screen.
- Maintain an encouraging, friendly, and respectful student-mentor tone.
${subject ? `Current Context: Subject is Class 9 ${subject}.` : ''}
${topic ? `Current Topic: ${topic}.` : ''}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await generateWithFallback({
      contents,
      config: {
        systemInstruction,
        temperature: 0.25, // Lower temperature to prioritize factual and calculation correctness
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/chat after fallback attempts:', error);
    res.status(500).json({ error: error.message || 'Failed to process doubt with AI' });
  }
});

app.post('/api/generate-mock-test', async (req, res) => {
  try {
    const { subject, chapterTitle, count = 5 } = req.body;

    const prompt = `Generate exactly ${count} high-quality, conceptual, multiple-choice questions (MCQs) for CBSE/NCERT Class 9 (New NCERT 2026 Curriculum).
Target Subject: ${subject || 'Class 9 STEM (Physics, Chemistry, or Mathematics)'}.
Target Chapter: ${chapterTitle || 'Active Class 9 NCERT 2026 chapters'}.
Strict Requirements:
- Each question must have exactly 4 distinct options (length 4).
- One and only one option must be unambiguously correct.
- Specify correctIndex (0, 1, 2, or 3).
- Provide a clear, step-by-step educational explanation for why that option is correct.
- Adhere strictly to the official New NCERT 2026 textbooks:
  * Physics (Exploration): "Describing Motion Around Us", "How Forces Affect Motion", "Work, Energy, and Simple Machines", "Sound Waves: Characteristics and Applications".
  * Chemistry (Exploration): "Exploring Mixtures and Their Separation", "Journey Inside the Atom", "Atomic Foundation of Matter".
  * Mathematics (Ganita Manjari): "Orienting Yourself: The Use of Coordinates", "Introduction to Linear Polynomials", "The World of Numbers", "Exploring Algebraic Identities", "I'm Up and Down, and Round and Round", "Measuring Space: Perimeter and Area", "The Mathematics of Maybe: Introduction to Probability", "Predicting What Comes Next: Exploring Sequences and Progression".`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert CBSE/NCERT Class 9 STEM exam question setter. Create accurate, challenging, error-free multiple-choice questions strictly adhering to the JSON schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subjectId: { type: Type.STRING },
              chapterTitle: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctIndex', 'explanation'],
          },
        },
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error('Error in /api/generate-mock-test after fallback attempts:', error);
    res.status(500).json({ error: error.message || 'Failed to generate mock test' });
  }
});


// Handle any Google Search Console HTML verification file request (e.g. /google1234567890abcdef.html)
app.get('/google:token.html', (req, res) => {
  const token = req.params.token;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`google-site-verification: google${token}.html`);
});

async function startServer() {
  app.use(express.static(path.resolve('public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();

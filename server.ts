import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client dynamically from GEMINI_API_KEY env var
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Consumer fallback heuristic analyzer
function analyzeConsumerHeuristics(content: string) {
  const lower = (content || '').toLowerCase();

  // 1. PRIZE / LOTTERY SCAM (Checked before payment to prevent prize text with gift cards matching payment)
  if (/won|winner|lottery|sweepstake|prize|rewards draw|congratulations.*phone|national customer rewards|claim-national-rewards/i.test(lower)) {
    return {
      riskLevel: 'HIGH RISK' as const,
      riskPercentage: 96,
      scamType: 'Prize / Lottery Scam',
      redFlags: [
        'Unexpected prize notification',
        'Request for processing/tax/registration fee',
        'Urgent deadline',
        'Request for personal or financial information'
      ],
      explanation: 'This message is a fraudulent prize sweepstakes lure. You cannot win a contest or lottery you never entered. Legitimate sweepstakes never require winners to pay an upfront processing, courier, or tax fee to receive winnings, nor do they demand immediate submission of sensitive financial details.',
      safetyAdvice: [
        'Do not send money or pay any fee to claim a prize.',
        'Do not share OTPs, passwords, or personal banking information.',
        'Do not click suspicious links or adhere to artificial countdowns.',
        'Remember that genuine lotteries never require advance fees.',
        'Report or block the sender if appropriate.'
      ]
    };
  }

  // 2. JOB / EMPLOYMENT SCAM
  if (/data entry|remote.*assistant|work from home|\$\d+\s*(?:per hour|\/hr|\/wk)|telegram.*recruiter|macbook setup check|onboarding.*fee|training fee|registration fee/i.test(lower)) {
    return {
      riskLevel: 'HIGH RISK' as const,
      riskPercentage: 94,
      scamType: 'Job / Employment Scam',
      redFlags: [
        'Upfront registration or training fee',
        'Unrealistic salary or easy-money promise',
        'Unverified recruiter or company',
        'Urgent pressure to act'
      ],
      explanation: 'This message exhibits classic characteristics of an employment scam. Legitimate employers never require candidates to pay upfront registration or training fees, promise exceptionally high wages for basic tasks, or conduct official hiring solely through anonymous chat apps under urgent deadlines.',
      safetyAdvice: [
        'Do not send money for registration, software, or equipment.',
        'Do not deposit checks from unverified employers.',
        'Do not click suspicious links or share sensitive identity documents.',
        'Verify the company through its official website and job board.',
        'Report or block the sender if appropriate.'
      ]
    };
  }

  // 3. PAYMENT & BANKING SCAM
  if (/zelle|wire transfer|crypto|holding account|debit card.*suspended|unauthorized.*transfer|unauthorized.*charge|call.*fraud department|chase-security/i.test(lower)) {
    return {
      riskLevel: 'HIGH RISK' as const,
      riskPercentage: 89,
      scamType: 'Payment & Banking Scam',
      redFlags: [
        'Urgent account suspension or unauthorized-charge claim',
        'Request to transfer money',
        'Suspicious payment method',
        'Unverified phone number or link'
      ],
      explanation: 'This message uses artificial panic about an unauthorized charge and threatened account suspension. Financial institutions never instruct customers to transfer funds into "safe holding accounts" or direct users to unverified third-party websites to cancel transactions.',
      safetyAdvice: [
        'Do not send money or transfer funds to any requested account.',
        'Do not share OTPs, passwords, or account credentials.',
        'Do not click suspicious links or call phone numbers in the text.',
        'Verify the company through its official website or the number on your card.',
        'Report or block the sender if appropriate.'
      ]
    };
  }

  // 4. PACKAGE DELIVERY SCAM
  if (/usps|fedex|ups|dhl|parcel|package.*held|redelivery fee|incomplete address/i.test(lower)) {
    return {
      riskLevel: 'HIGH RISK' as const,
      riskPercentage: 91,
      scamType: 'Package Delivery Scam (Smishing)',
      redFlags: [
        'Fake delivery issue alert requesting an immediate link click',
        'Small fee demand designed to harvest payment card details',
        'Suspicious or unofficial web address',
        'Urgent countdown threatening parcel return'
      ],
      explanation: 'Postal carriers do not send text messages requiring small card fees to update street addresses. The embedded link leads to a counterfeit payment harvesting page.',
      safetyAdvice: [
        'Do not click the link or enter credit card information.',
        'Check package tracking directly on the carrier official website.',
        'Never pay unexpected redelivery charges via text links.',
        'Report or block the sender if appropriate.'
      ]
    };
  }

  // 5. GENERIC PHISHING / SUSPICIOUS
  if (/urgent|immediately|click here|verify your account|password|expire/i.test(lower)) {
    return {
      riskLevel: 'HIGH RISK' as const,
      riskPercentage: 82,
      scamType: 'Phishing / Impersonation Scam',
      redFlags: [
        'Urgent call to action urging immediate compliance',
        'Link prompting account verification or credential entry',
        'Unverified sender identity'
      ],
      explanation: 'The sender is using artificial urgency to pressure you into clicking a link or providing credentials before you have time to verify.',
      safetyAdvice: [
        'Do not click suspicious links or enter your credentials.',
        'Do not share OTPs or passwords.',
        'Verify through official customer service channels.',
        'Report or block the sender if appropriate.'
      ]
    };
  }

  // Default low-risk message
  return {
    riskLevel: 'LOW RISK' as const,
    riskPercentage: 15,
    scamType: 'Legitimate / Low Risk Message',
    redFlags: ['No significant scam indicators identified in this text'],
    explanation: 'This message appears to be routine communication and does not show typical high-pressure or deceptive tactics.',
    safetyAdvice: [
      'Always exercise caution before clicking links from unknown numbers.',
      'Never share OTPs, passwords, or PINs with anyone.',
      'Access services directly through official mobile apps or verified websites.'
    ]
  };
}

// Health check endpoint
app.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', name: 'ScamShield AI' });
});

// Consumer Scam Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Please enter a message to analyze.' });
    }

    const ai = getAIClient();
    if (!ai) {
      const fallback = analyzeConsumerHeuristics(message);
      return res.json(fallback);
    }

    const systemInstruction = `You are ScamShield AI, an intelligent, empathetic scam risk assessment assistant for everyday users (students, job seekers, smartphone users).
Analyze the provided user message for scam warning signs.

Important guidance for category-specific assessments:
1. If the message is a Job/Employment scam (offers easy high pay, remote data entry, upfront registration/equipment fees, Telegram interviews):
   - scamType: "Job / Employment Scam"
   - riskLevel: "HIGH RISK"
   - riskPercentage: around 94
   - redFlags MUST include:
     * "Upfront registration or training fee"
     * "Unrealistic salary or easy-money promise"
     * "Unverified recruiter or company"
     * "Urgent pressure to act"

2. If the message is a Payment/Banking scam (claims of unauthorized charges, account restrictions, requests to transfer funds to holding accounts, fake fraud numbers):
   - scamType: "Payment & Banking Scam"
   - riskLevel: "HIGH RISK"
   - riskPercentage: around 89
   - redFlags MUST include:
     * "Urgent account suspension or unauthorized-charge claim"
     * "Request to transfer money"
     * "Suspicious payment method"
     * "Unverified phone number or link"

3. If the message is a Prize/Lottery/Sweepstakes scam (unexpected win, claim within 24 hours, request for courier/processing fee or banking details):
   - scamType: "Prize / Lottery Scam"
   - riskLevel: "HIGH RISK"
   - riskPercentage: around 96
   - redFlags MUST include:
     * "Unexpected prize notification"
     * "Request for processing/tax/registration fee"
     * "Urgent deadline"
     * "Request for personal or financial information"

Always return valid JSON conforming to the schema. Keep explanations clear, grounded, and easy to understand for everyday people without corporate jargon.`;

    const promptText = `Assess the scam risk of this message:
"""
${message}
"""`;

    // Candidate Gemini models with automatic failover if one experiences temporary capacity limits
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let geminiResponse: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskLevel: {
                  type: Type.STRING,
                  description: 'Must be HIGH RISK, MODERATE RISK, or LOW RISK.',
                },
                riskPercentage: {
                  type: Type.INTEGER,
                  description: 'Risk score percentage between 0 and 100.',
                },
                scamType: {
                  type: Type.STRING,
                  description: 'Clear category name for the scam or message.',
                },
                redFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of specific warning signs detected in the text.',
                },
                explanation: {
                  type: Type.STRING,
                  description: 'Short, clear explanation of why this message looks suspicious or safe.',
                },
                safetyAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Actionable steps the user should take right now to stay safe.',
                },
              },
              required: ['riskLevel', 'riskPercentage', 'scamType', 'redFlags', 'explanation', 'safetyAdvice'],
            },
          },
        });

        const rawText = response.text;
        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            if (parsed && typeof parsed === 'object') {
              geminiResponse = parsed;
              break; // Successfully obtained and parsed response from Gemini
            }
          } catch (jsonErr) {
            console.warn(`Failed to parse response JSON from model ${modelName}:`, jsonErr);
          }
        }
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} call failed (${modelErr?.status || 'network error'}):`, modelErr?.message || modelErr);
        // Continue to next candidate model
      }
    }

    // If Gemini produced a valid result, normalize and return it
    if (geminiResponse) {
      const rawLevel = String(geminiResponse.riskLevel || '').toUpperCase();
      let riskLevel: 'HIGH RISK' | 'MODERATE RISK' | 'LOW RISK' = 'LOW RISK';
      if (rawLevel.includes('HIGH') || rawLevel === 'HIGH') {
        riskLevel = 'HIGH RISK';
      } else if (rawLevel.includes('MOD') || rawLevel.includes('MED') || rawLevel.includes('WARN')) {
        riskLevel = 'MODERATE RISK';
      } else if (typeof geminiResponse.riskPercentage === 'number' && geminiResponse.riskPercentage >= 70) {
        riskLevel = 'HIGH RISK';
      } else if (typeof geminiResponse.riskPercentage === 'number' && geminiResponse.riskPercentage >= 35) {
        riskLevel = 'MODERATE RISK';
      }

      let riskPercentage = typeof geminiResponse.riskPercentage === 'number'
        ? geminiResponse.riskPercentage
        : parseInt(String(geminiResponse.riskPercentage || ''), 10);
      if (isNaN(riskPercentage)) {
        riskPercentage = riskLevel === 'HIGH RISK' ? 92 : riskLevel === 'MODERATE RISK' ? 55 : 15;
      }
      riskPercentage = Math.min(Math.max(riskPercentage, 0), 100);

      const scamType = String(geminiResponse.scamType || 'Suspicious Communication').trim();
      const redFlags = Array.isArray(geminiResponse.redFlags) && geminiResponse.redFlags.length > 0
        ? geminiResponse.redFlags.map((rf: any) => String(rf).trim())
        : ['Suspicious phrasing or urgency cues detected'];
      const explanation = String(geminiResponse.explanation || '').trim() ||
        'This message exhibits known warning signs designed to rush your decision-making.';
      const safetyAdvice = Array.isArray(geminiResponse.safetyAdvice) && geminiResponse.safetyAdvice.length > 0
        ? geminiResponse.safetyAdvice.map((sa: any) => String(sa).trim())
        : [
            'Do not send money or approve payment requests.',
            'Do not share passwords, OTPs, or personal identification.',
            'Do not click suspicious links or call numbers provided in the text.',
            'Verify the sender through official public channels.',
            'Report or block the sender if appropriate.'
          ];

      return res.json({
        riskLevel,
        riskPercentage,
        scamType,
        redFlags,
        explanation,
        safetyAdvice
      });
    }

    // Only when all Gemini models fail or API is unavailable, fall back to heuristic analysis
    console.warn('Gemini unavailable across candidate models, falling back to heuristic engine.');
    const fallback = analyzeConsumerHeuristics(message);
    return res.json(fallback);
  } catch (error: any) {
    console.error('Analysis error:', error);
    const fallback = analyzeConsumerHeuristics(req.body?.message || '');
    return res.json(fallback);
  }
});

// Setup Vite for development or static serving for production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScamShield AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

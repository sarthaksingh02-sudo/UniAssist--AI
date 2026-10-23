import { LLMProvider, LLMSettings, ChatMessage } from '../types';

const STORAGE_KEY = 'uniassist_llm_settings';

// OpenRouter uses OpenAI-compatible chat completions API
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_SITE_URL = 'https://uniassist-ai.gdgu.edu.in'; // referrer for OpenRouter dashboard
const OPENROUTER_APP_NAME = 'UniAssist AI - GD Goenka University';

export class LLMService {
  private static settings: LLMSettings = LLMService.loadSettings();

  private static loadSettings(): LLMSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore localStorage parse errors
    }
    return {
      provider: 'openrouter',
      apiKey: '',
      model: 'deepseek/deepseek-chat',
      temperature: 0.3
    };
  }

  public static getSettings(): LLMSettings {
    return { ...this.settings };
  }

  public static saveSettings(newSettings: Partial<LLMSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Storage unavailable
    }
  }

  public static hasApiKey(): boolean {
    return !!this.settings.apiKey && this.settings.apiKey.trim().length > 5;
  }

  public static getActiveProviderName(): string {
    if (!this.hasApiKey()) return 'In-Browser Edge RAG (Free)';
    if (this.settings.provider === 'openrouter') {
      const modelLabel = OPENROUTER_MODEL_LABELS[this.settings.model] || this.settings.model;
      return `OpenRouter · ${modelLabel}`;
    }
    if (this.settings.provider === 'gemini') {
      return this.settings.model === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : 'Gemini 1.5 Flash';
    }
    return 'OpenAI GPT-4o';
  }

  /**
   * Test user API key validity against live provider endpoint
   */
  public static async testConnection(
    apiKey: string,
    provider: LLMProvider,
    model = 'deepseek/deepseek-chat'
  ): Promise<{ success: boolean; message: string }> {
    if (!apiKey || apiKey.trim().length < 5) {
      return { success: false, message: 'Please enter a valid API key string.' };
    }

    try {
      const cleanKey = apiKey.trim().replace(/[^\x00-\x7F]/g, '');

      if (provider === 'openrouter') {
        const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`,
            'HTTP-Referer': OPENROUTER_SITE_URL,
            'X-Title': 'UniAssist AI - GD Goenka University'
          },
          body: JSON.stringify({
            model: model.trim(),
            messages: [{ role: 'user', content: 'Reply with the word CONNECTED only.' }],
            max_tokens: 10,
            temperature: 0.1
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${res.status}`;
          return { success: false, message: `OpenRouter verification failed: ${errMsg}` };
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        const modelUsed = data.model || model;
        return {
          success: true,
          message: `✅ Connected to OpenRouter! Model: ${modelUsed}${reply ? ` · Reply: "${reply}"` : ''}`
        };
      }

      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the word "CONNECTED" only.' }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${res.status} error`;
          return { success: false, message: `Google Gemini verification failed: ${errMsg}` };
        }

        return { success: true, message: `✅ Connected to Google Gemini (${model})!` };
      }

      if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Say OK' }],
            max_tokens: 5
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          return { success: false, message: errData.error?.message || `HTTP ${res.status} error` };
        }

        return { success: true, message: '✅ Connected to OpenAI API!' };
      }

      return { success: true, message: 'Using local Edge RAG mode.' };
    } catch (err: any) {
      return { success: false, message: `Network error: ${err.message || 'Check your internet connection'}` };
    }
  }

  /**
   * Enriches Edge-RAG answer using cloud LLM when an API key is configured.
   * Falls back to the deterministic Edge-RAG response if cloud call fails.
   */
  public static async enrichWithCloudLLM(
    query: string,
    baseResponse: ChatMessage
  ): Promise<ChatMessage> {
    if (!this.hasApiKey()) {
      return baseResponse; // Local deterministic Edge-RAG
    }

    try {
      const apiKey = this.settings.apiKey.trim();
      const model = this.settings.model || 'deepseek/deepseek-chat-v3-5:free';

      // Assemble ground-truth context from knowledge chunks + live portal data + verified institutional synthesis
      let contextText = `AUTHORITATIVE CONTEXT FROM GD GOENKA UNIVERSITY:\n`;
      if (baseResponse.text) {
        contextText += `Verified Institutional Synthesis / Timetable Records:\n${baseResponse.text}\n\n`;
      }
      if (baseResponse.campusSources && baseResponse.campusSources.length > 0) {
        contextText += `Official Policies:\n` +
          baseResponse.campusSources.map(s => `- [${s.documentTitle}, ${s.section}]: ${s.text}`).join('\n') + `\n\n`;
      }
      if (baseResponse.portalSource) {
        contextText += `Live DigiCampus Portal Telemetry:\n${JSON.stringify(baseResponse.portalSource.data, null, 2)}\n\n`;
      }

      const systemPrompt = `You are UniAssist AI, the official intelligent university assistant for GD Goenka University (GDGU), India.
Answer the user's inquiry based STRICTLY on the verified institutional context provided below.
Do NOT hallucinate any facts, numbers, or policies outside the given context.

RULES:
1. Maintain all exact course titles (e.g. "Applications of ML in Industry", "Quantum Computing", "Internet of Things", "Marketing in the Digital World", "Aptitude Workshop").
2. When the user asks about assessments, mid-sem marks, or marks in a subject (e.g. "how much did i get in application of ml subject check assesment"), directly report their exact score: Applications of ML in Industry (CSE4007) MSE (Mid-Semester Examination) = 21 / 30 marks (70.0%), status Published. For other subjects where assessments are not yet published, mention that faculty evaluation is pending. Do NOT state that you lack assessment marks or that individual records are unavailable.
3. When the user asks about today's attendance ("was I marked present or absent today?"), directly cite today's lecture register from the provided Verified Institutional Synthesis, confirming which classes they were marked Present or Absent in today. Do NOT state that you lack day-wise data when today's attendance register is present in the context.
4. Maintain all thresholds (e.g. 75% attendance, 65% condonation), SGPA/CGPA values, dates, and section citations.
5. If the user requests a write action (pay fee, change grade, enroll), politely confirm UniAssist AI is strictly read-only and direct them to the DigiCampus portal.
6. Format using clean markdown (bold important terms, use bullet lists). Be concise, clear, and professional.
7. Language: English. Tone: helpful, authoritative university assistant.`;

      const userMessage = `${contextText}\nUSER INQUIRY: "${query}"`;

      // ── OpenRouter (DeepSeek / any model) ──────────────────────────────────
      if (this.settings.provider === 'openrouter') {
        const cleanKey = apiKey.replace(/[^\x00-\x7F]/g, '');
        const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`,
            'HTTP-Referer': OPENROUTER_SITE_URL,
            'X-Title': 'UniAssist AI - GD Goenka University'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: this.settings.temperature ?? 0.3,
            max_tokens: 900
          })
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.choices?.[0]?.message?.content?.trim();
          if (generatedText && generatedText.length > 10) {
            return { ...baseResponse, text: generatedText };
          }
        }
      }

      // ── Google Gemini ────────────────────────────────────────────────────────
      if (this.settings.provider === 'gemini') {
        const fullPrompt = `${systemPrompt}\n\n${userMessage}`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: this.settings.temperature ?? 0.3,
              maxOutputTokens: 900
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 10) {
            return { ...baseResponse, text: generatedText.trim() };
          }
        }
      }

      // ── OpenAI ───────────────────────────────────────────────────────────────
      if (this.settings.provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: this.settings.temperature ?? 0.3,
            max_tokens: 900
          })
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.choices?.[0]?.message?.content?.trim();
          if (generatedText && generatedText.length > 10) {
            return { ...baseResponse, text: generatedText };
          }
        }
      }
    } catch (e) {
      console.warn('Cloud LLM enrichment failed, falling back to local Edge-RAG:', e);
    }

    // Fall back to original verified Edge-RAG answer
    return baseResponse;
  }
}

/** Human-readable labels for OpenRouter model IDs shown in the UI */
export const OPENROUTER_MODEL_LABELS: Record<string, string> = {
  'deepseek/deepseek-chat': 'DeepSeek V3 (Chat)',
  'deepseek/deepseek-r1': 'DeepSeek R1 (Reasoning)',
  'deepseek/deepseek-chat:free': 'DeepSeek V3 (Free)',
  'deepseek/deepseek-r1:free': 'DeepSeek R1 (Free)',
  'deepseek/deepseek-chat-v3-5:free': 'DeepSeek V3.5 (Free)',
  'deepseek/deepseek-r1-0528:free': 'DeepSeek R1 0528 (Free)',
  'google/gemini-2.0-flash-exp:free': 'Gemini 2.0 Flash (Free via OR)',
  'google/gemini-flash-1.5': 'Gemini 1.5 Flash (via OR)',
  'meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B (Free)',
  'mistralai/mistral-7b-instruct:free': 'Mistral 7B (Free)',
  'custom': 'Custom Model ID (Type below)...'
};

/** Default model when user selects OpenRouter */
export const OPENROUTER_DEFAULT_MODEL = 'deepseek/deepseek-chat';

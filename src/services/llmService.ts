import { LLMProvider, LLMSettings, ChatMessage } from '../types';

const STORAGE_KEY = 'uniassist_llm_settings';

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
      provider: 'gemini',
      apiKey: '',
      model: 'gemini-1.5-flash',
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
    if (this.settings.provider === 'gemini') {
      return this.settings.model === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : 'Gemini 1.5 Flash';
    }
    return 'OpenAI GPT-4o';
  }

  /**
   * Test user API key validity against live provider endpoint
   */
  public static async testConnection(apiKey: string, provider: LLMProvider, model = 'gemini-1.5-flash'): Promise<{ success: boolean; message: string }> {
    if (!apiKey || apiKey.trim().length < 5) {
      return { success: false, message: 'Please enter a valid API key string.' };
    }

    try {
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

        return { success: true, message: `Successfully connected to Google Gemini (${model})!` };
      } else if (provider === 'openai') {
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

        return { success: true, message: 'Successfully connected to OpenAI API!' };
      }

      return { success: true, message: 'Using local Edge RAG mode.' };
    } catch (err: any) {
      return { success: false, message: `Network/Connection error: ${err.message || 'Check your internet connection'}` };
    }
  }

  /**
   * Generatively elaborates answer using cloud LLM when an API key is provided,
   * otherwise preserves verified deterministic Edge-RAG response.
   */
  public static async enrichWithCloudLLM(
    query: string,
    baseResponse: ChatMessage
  ): Promise<ChatMessage> {
    if (!this.hasApiKey()) {
      return baseResponse; // Use local deterministic Edge-RAG
    }

    try {
      const apiKey = this.settings.apiKey.trim();
      const model = this.settings.model || 'gemini-1.5-flash';

      // Assemble ground truth context from knowledge chunks and portal data
      let contextText = `AUTHORITATIVE CONTEXT FROM GD GOENKA UNIVERSITY:\n`;
      if (baseResponse.campusSources && baseResponse.campusSources.length > 0) {
        contextText += `Official Policies:\n` +
          baseResponse.campusSources.map(s => `- [${s.documentTitle}, ${s.section}]: ${s.text}`).join('\n') + `\n\n`;
      }
      if (baseResponse.portalSource) {
        contextText += `Live DigiCampus Portal Telemetry:\n${JSON.stringify(baseResponse.portalSource.data, null, 2)}\n\n`;
      }

      const prompt = `You are UniAssist AI, the official intelligent university assistant for GD Goenka University (GDGU).
Answer the user's inquiry based strictly on the verified institutional context below.

${contextText}
USER INQUIRY: "${query}"

INSTRUCTIONS:
1. Provide a direct, polite, helpful and clear answer.
2. Maintain all exact numbers, percentage thresholds (e.g. 75% attendance, 65% condonation), SGPA/CGPA, dates, and section citations.
3. If the user asks for write actions (e.g., pay fee, change grade, enroll), politely explain that UniAssist AI is strictly read-only and direct them to the manual portal.
4. Format using clean markdown (bold terms, neat lists). Keep it concise and avoid fluff.`;

      if (this.settings.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: this.settings.temperature ?? 0.3,
              maxOutputTokens: 800
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 10) {
            return {
              ...baseResponse,
              text: generatedText.trim()
            };
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

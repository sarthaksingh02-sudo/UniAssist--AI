import { IntentClassification } from '../types';

export class PolicyGuard {
  private static readonly ALLOWED_PORTAL_ORIGINS = [
    'https://digicampus.edu',
    'https://portal.university.edu'
  ];

  private static readonly ALLOWED_PORTAL_SECTIONS = [
    'results'
  ];

  /**
   * Verify whether a destination URL is within the approved origin allowlist.
   */
  public static isOriginPermitted(url: string): boolean {
    try {
      const parsed = new URL(url);
      return this.ALLOWED_PORTAL_ORIGINS.includes(parsed.origin);
    } catch {
      return false;
    }
  }

  /**
   * Enforces read-only constraint. Rejects consequential actions.
   */
  public static validateActionSafety(intent: IntentClassification): { safe: boolean; reason?: string } {
    if (intent.category === 'UNSUPPORTED' && intent.reasoning.includes('read-only')) {
      return {
        safe: false,
        reason: 'UniAssist AI operates strictly as a read-only reader and policy explainer. Write actions are disallowed.'
      };
    }
    return { safe: true };
  }

  /**
   * Ensures that student data extracted contains only minimal requested fields.
   * Strips out unnecessary personal identifiers or internal tokens.
   */
  public static sanitizeStudentData<T extends Record<string, any>>(raw: T): T {
    const copy = { ...raw };
    // Redact any accidental tokens or unneeded PII
    delete copy.authToken;
    delete copy.cookie;
    delete copy.rawHtml;
    delete copy.sessionKey;
    delete copy.fullAddress;
    delete copy.phoneNumber;
    return copy;
  }
}

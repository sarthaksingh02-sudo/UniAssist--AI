import { AuditLogEntry, IntentCategory } from '../types';

export class AuditLogger {
  private static logs: AuditLogEntry[] = [];
  private static listeners: ((logs: AuditLogEntry[]) => void)[] = [];

  public static log(
    eventType: AuditLogEntry['eventType'],
    route: IntentCategory,
    adapterVersion: string,
    statusCode: AuditLogEntry['statusCode'],
    latencyMs: number,
    details: string
  ): AuditLogEntry {
    // Zero personal data constraint (FR-10): details must not contain grades, student names, passwords, tokens
    const entry: AuditLogEntry = {
      id: 'AUD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventType,
      route,
      adapterVersion,
      statusCode,
      latencyMs: Math.round(latencyMs),
      details
    };

    this.logs.unshift(entry);
    // Keep last 50 in memory
    if (this.logs.length > 50) {
      this.logs.pop();
    }

    this.notify();
    return entry;
  }

  public static getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  public static clearLogs() {
    this.logs = [];
    this.notify();
  }

  public static subscribe(callback: (logs: AuditLogEntry[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private static notify() {
    this.listeners.forEach(cb => cb([...this.logs]));
  }
}

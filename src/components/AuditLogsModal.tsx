import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Trash2 } from 'lucide-react';
import { AuditLogger } from '../services/auditLogger';
import { AuditLogEntry } from '../types';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLogs(AuditLogger.getLogs());
    }
    const unsubscribe = AuditLogger.subscribe(updated => setLogs(updated));
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#34d399" />
            <h3 className="modal-title">Operational Diagnostics & Audit Log (FR-10)</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'var(--neo-mint-light)',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            marginBottom: '16px',
            fontSize: '0.82rem',
            color: '#000000',
            fontWeight: 600
          }}>
            <strong style={{ fontWeight: 800 }}>Zero-PII Compliance Guarantee:</strong> Diagnostic logs record event metadata, route category, latency, and operational status codes only. In compliance with FR-10 and Section 7, logs strictly omit student grades, passwords, auth tokens, session cookies, and DOM dumps.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#000000', fontWeight: 700 }}>
              Recorded Events: <strong>{logs.length}</strong> (ephemeral in-memory ring buffer)
            </span>
            <button
              className="btn btn-outline-danger"
              style={{ fontSize: '0.74rem', padding: '4px 10px' }}
              onClick={() => {
                AuditLogger.clearLogs();
                setLogs([]);
              }}
            >
              <Trash2 size={13} />
              <span>Clear Audit Stream</span>
            </button>
          </div>

          {logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontWeight: 600 }}>
              No operational events recorded yet. Send a query to generate diagnostic traces.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
              {logs.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: '#FFFFFF',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: '#000000'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#000000', fontWeight: 800 }}>{entry.eventType}</span>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'var(--neo-yellow)',
                        border: '1px solid #000000',
                        color: '#000000',
                        fontWeight: 700
                      }}>
                        {entry.route}
                      </span>
                      <span style={{ color: '#555555', fontWeight: 600 }}>[{entry.adapterVersion}]</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        color: entry.statusCode === 'SUCCESS' ? '#065F46' : '#B91C1C',
                        fontWeight: 800
                      }}>
                        {entry.statusCode}
                      </span>
                      <span style={{ color: '#555555', fontWeight: 600 }}>{entry.latencyMs}ms</span>
                      <span style={{ color: '#555555', fontWeight: 600 }}>{entry.timestamp}</span>
                    </div>
                  </div>

                  <div style={{ color: '#374151', fontSize: '0.74rem', fontWeight: 600 }}>
                    {entry.details}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

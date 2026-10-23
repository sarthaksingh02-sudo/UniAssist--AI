import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, FileText, Ban } from 'lucide-react';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#34d399" />
            <h3 className="modal-title">Privacy Notice & Trust Boundaries</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <Lock size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Zero Credential Collection (FR-03)</strong>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                UniAssist AI authenticates directly via your official university DigiCampus session. The chatbot will <em>never</em> ask for, view, capture, store, or replay your student password or session cookies.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <Ban size={20} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Strictly Read-Only Guarantee</strong>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                Phase 1 is strictly read-only. The system will refuse any requests to alter grades, pay tuition fees, register or drop courses, or submit official complaints.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <EyeOff size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Data Minimization & Ephemeral Retention (FR-08)</strong>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                Personal academic records (SGPA, marks) are extracted only on-demand for the specific semester requested, and remain exclusively in temporary memory. When you click <strong>Clear Chat</strong> or close your browser, all ephemeral records are immediately flushed.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '14px',
            background: 'rgba(168, 85, 247, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <FileText size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff' }}>Verifiable Campus Policy Citations (FR-02)</strong>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                All policy answers (attendance rules, withdrawal deadlines, grading thresholds) are retrieved with document titles, governing offices, effective dates, and section numbers so you can verify each citation independently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

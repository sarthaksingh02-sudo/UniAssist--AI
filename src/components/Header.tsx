import React from 'react';
import { Compass, ShieldCheck, Activity, Trash2, HelpCircle, Upload, Layers, CheckCircle2 } from 'lucide-react';
import { DigiCampusState, UserRole } from '../types';
import { MOCK_USER_PROFILES } from '../data/mockPortalData';

interface HeaderProps {
  portalState: DigiCampusState;
  onRoleChange: (role: UserRole) => void;
  onClearChat: () => void;
  onOpenPrivacyNotice: () => void;
  onOpenEvaluation: () => void;
  onOpenAuditLogs: () => void;
  onOpenDocUpload: () => void;
  onOpenSitemapModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  portalState,
  onRoleChange,
  onClearChat,
  onOpenPrivacyNotice,
  onOpenEvaluation,
  onOpenAuditLogs,
  onOpenDocUpload,
  onOpenSitemapModal
}) => {
  const getStatusBadge = () => {
    switch (portalState.authStatus) {
      case 'CONNECTED_AUTHENTICATED':
        return (
          <div className="status-pill connected" title="DigiCampus live authenticated session verified">
            <span className="live-beacon" />
            <span className="status-pill-text">DigiCampus Live: Connected</span>
            <span className="status-role-tag">{portalState.userRole.toUpperCase()}</span>
          </div>
        );
      case 'SESSION_EXPIRED':
        return (
          <div className="status-pill warning" title="DigiCampus session expired (HTTP 401/403 simulator)">
            <span className="status-dot warning" />
            <span className="status-pill-text">Session Expired (Action Needed)</span>
          </div>
        );
      case 'MFA_CHALLENGE':
        return (
          <div className="status-pill warning" title="DigiCampus Multi-Factor Authentication challenge pending">
            <span className="status-dot warning" />
            <span className="status-pill-text">Security MFA Challenge Pending</span>
          </div>
        );
      case 'UNKNOWN_LAYOUT':
        return (
          <div className="status-pill danger" title="DigiCampus layout change detected (Fail-closed verified)">
            <span className="status-dot danger" />
            <span className="status-pill-text">Layout Redesign (Fail-Closed)</span>
          </div>
        );
      case 'DISCONNECTED':
      default:
        return (
          <div className="status-pill disconnected" title="Portal disconnected">
            <span className="status-dot danger" />
            <span className="status-pill-text">DigiCampus: Disconnected</span>
          </div>
        );
    }
  };

  const roles: { role: UserRole; label: string; icon: string; name: string }[] = [
    { role: 'student', label: 'Student', icon: '🌸', name: MOCK_USER_PROFILES.student.nameMasked },
    { role: 'faculty', label: 'Faculty', icon: '🍵', name: MOCK_USER_PROFILES.faculty.nameMasked },
    { role: 'dean', label: 'Dean', icon: '⛩️', name: MOCK_USER_PROFILES.dean.nameMasked }
  ];

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Compass size={22} className="brand-compass-icon" />
        </div>
        <div className="brand-text-container">
          <div className="brand-title-row">
            <h1 className="brand-title">UniAssist AI</h1>
            <span className="brand-version-badge">Targeted RAG v2</span>
          </div>
          <span className="brand-subtext">
            GD Goenka University Companion • Zen-Calm Leaf Retrieval
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Modern Segmented Role Switcher */}
        <div className="role-segmented-control" role="group" aria-label="Select User Role">
          {roles.map(r => {
            const isActive = portalState.userRole === r.role;
            return (
              <button
                key={r.role}
                type="button"
                className={`role-segment-btn ${isActive ? 'active' : ''}`}
                onClick={() => onRoleChange(r.role)}
                title={`Switch active identity to ${r.label} (${r.name})`}
              >
                <span className="role-emoji">{r.icon}</span>
                <span className="role-label">{r.label}</span>
                {isActive && <span className="role-active-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Live Portal Status Indicator */}
        {getStatusBadge()}

        {/* Action Buttons Cluster */}
        <div className="header-action-buttons">
          {onOpenSitemapModal && (
            <button
              className="btn btn-glass"
              onClick={onOpenSitemapModal}
              title="Inspect DigiCampus Site Map & Token Minimization Architecture"
            >
              <Layers size={14} color="#f472b6" />
              <span>Site Map</span>
            </button>
          )}

          <button
            className="btn btn-glass"
            onClick={onOpenDocUpload}
            title="Upload or paste custom university policy document"
          >
            <Upload size={14} color="#f472b6" />
            <span>+ Ingest Policy</span>
          </button>

          <button
            className="btn btn-glass btn-prd-highlight"
            onClick={onOpenEvaluation}
            title="Run PRD acceptance test suite (15 verification benchmarks)"
          >
            <Activity size={14} color="#34d399" />
            <span>PRD Suite</span>
            <span className="prd-counter-badge">15/15</span>
          </button>

          <button
            className="btn btn-glass"
            onClick={onOpenAuditLogs}
            title="View non-PII diagnostic event audit logs (FR-10)"
          >
            <ShieldCheck size={14} color="#34d399" />
            <span>Audit Logs</span>
          </button>

          <button
            className="btn btn-glass"
            onClick={onOpenPrivacyNotice}
            title="Privacy Notice & Trust Boundary"
          >
            <HelpCircle size={14} color="#cbd5e1" />
            <span>Privacy</span>
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={onClearChat}
            title="Clear conversational session memory (FR-08)"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
};

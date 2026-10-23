import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Upload,
  Key,
  Monitor,
  ChevronLeft,
  Compass,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ChatSession, DigiCampusState, UserRole } from '../types';
import { MOCK_USER_PROFILES } from '../data/mockPortalData';
import { LLMService } from '../services/llmService';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  portalState: DigiCampusState;
  onRoleChange: (role: UserRole) => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onOpenSitemapModal: () => void;
  onOpenDocUpload: () => void;
  onOpenEvaluation: () => void;
  onOpenAuditLogs: () => void;
  onOpenPrivacyNotice: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  portalState,
  onRoleChange,
  isSplitView,
  onToggleSplitView,
  onOpenSitemapModal,
  onOpenDocUpload,
  onOpenEvaluation,
  onOpenAuditLogs,
  onOpenPrivacyNotice,
  onOpenSettings
}) => {
  const currentProfile = MOCK_USER_PROFILES[portalState.userRole];
  const hasKey = LLMService.hasApiKey();

  // Group sessions by date
  const groupSessions = () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const today: ChatSession[] = [];
    const yesterday: ChatSession[] = [];
    const last7Days: ChatSession[] = [];
    const older: ChatSession[] = [];

    sessions.forEach(sess => {
      const diff = now - sess.updatedAt;
      if (diff < oneDay) {
        today.push(sess);
      } else if (diff < 2 * oneDay) {
        yesterday.push(sess);
      } else if (diff < sevenDays) {
        last7Days.push(sess);
      } else {
        older.push(sess);
      }
    });

    return { today, yesterday, last7Days, older };
  };

  const grouped = groupSessions();

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'student', label: 'Student', icon: '🌸' },
    { role: 'faculty', label: 'Faculty', icon: '🍵' },
    { role: 'dean', label: 'Dean', icon: '⛩️' }
  ];

  return (
    <aside className={`chatbot-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo-badge">
            <Compass size={20} className="brand-compass-icon" />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-title-sidebar">UniAssist AI</span>
            <span className="brand-subtitle-sidebar">GD Goenka University</span>
          </div>
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={onToggle}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="sidebar-action-wrap">
        <button className="btn-new-chat" onClick={onNewChat}>
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Role Switcher Section */}
      <div className="sidebar-section-title">ACTIVE ACADEMIC ROLE</div>
      <div className="sidebar-role-selector">
        {roles.map(r => {
          const isActive = portalState.userRole === r.role;
          return (
            <button
              key={r.role}
              type="button"
              className={`sidebar-role-btn ${isActive ? 'active' : ''}`}
              onClick={() => onRoleChange(r.role)}
              title={`Switch persona to ${r.label}`}
            >
              <span className="role-emoji">{r.icon}</span>
              <span className="role-name">{r.label}</span>
              {isActive && <span className="active-dot" />}
            </button>
          );
        })}
      </div>

      {/* Chat History List */}
      <div className="sidebar-history-container">
        <div className="sidebar-section-title">CHAT HISTORY</div>

        {sessions.length === 0 ? (
          <div className="history-empty">No conversations yet</div>
        ) : (
          <>
            {grouped.today.length > 0 && (
              <div className="history-group">
                <span className="history-group-label">Today</span>
                {grouped.today.map(sess => (
                  <div
                    key={sess.id}
                    className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(sess.id)}
                  >
                    <MessageSquare size={14} className="history-icon" />
                    <span className="history-title" title={sess.title}>{sess.title}</span>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteSession(sess.id, e)}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {grouped.yesterday.length > 0 && (
              <div className="history-group">
                <span className="history-group-label">Yesterday</span>
                {grouped.yesterday.map(sess => (
                  <div
                    key={sess.id}
                    className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(sess.id)}
                  >
                    <MessageSquare size={14} className="history-icon" />
                    <span className="history-title" title={sess.title}>{sess.title}</span>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteSession(sess.id, e)}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {grouped.last7Days.length > 0 && (
              <div className="history-group">
                <span className="history-group-label">Previous 7 Days</span>
                {grouped.last7Days.map(sess => (
                  <div
                    key={sess.id}
                    className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(sess.id)}
                  >
                    <MessageSquare size={14} className="history-icon" />
                    <span className="history-title" title={sess.title}>{sess.title}</span>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteSession(sess.id, e)}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {grouped.older.length > 0 && (
              <div className="history-group">
                <span className="history-group-label">Older</span>
                {grouped.older.map(sess => (
                  <div
                    key={sess.id}
                    className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSelectSession(sess.id)}
                  >
                    <MessageSquare size={14} className="history-icon" />
                    <span className="history-title" title={sess.title}>{sess.title}</span>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteSession(sess.id, e)}
                      title="Delete conversation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Utilities & Tools Section */}
      <div className="sidebar-tools-section">
        <div className="sidebar-section-title">PORTAL &amp; TOOLS</div>

        <button
          className={`sidebar-tool-btn ${isSplitView ? 'active-tool' : ''}`}
          onClick={onToggleSplitView}
          title="Toggle DigiCampus Live Portal side-by-side"
        >
          <Monitor size={15} color="#34d399" />
          <span>{isSplitView ? 'Hide Portal View' : 'Open Portal View'}</span>
          <span className="tool-chip">{isSplitView ? 'Active' : 'Split'}</span>
        </button>

        <button
          className="sidebar-tool-btn"
          onClick={onOpenSettings}
          title="Configure Google Gemini or OpenAI API Key"
        >
          <Key size={15} color="#f472b6" />
          <span>AI Engine &amp; API Key</span>
          <span className={`tool-chip ${hasKey ? 'chip-emerald' : ''}`}>
            {hasKey ? 'Cloud' : 'Local'}
          </span>
        </button>

        <button
          className="sidebar-tool-btn"
          onClick={onOpenDocUpload}
          title="Upload or paste custom university regulations"
        >
          <Upload size={15} color="#cbd5e1" />
          <span>Ingest Policy Doc</span>
        </button>

        <button
          className="sidebar-tool-btn"
          onClick={onOpenPrivacyNotice}
          title="Privacy Notice & Trust Boundary"
        >
          <HelpCircle size={15} color="#cbd5e1" />
          <span>Privacy &amp; Trust</span>
        </button>
      </div>

      {/* Footer Profile & Engine Status */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar-pill">
            <span>{currentProfile.role === 'student' ? '🌸' : currentProfile.role === 'faculty' ? '🍵' : '⛩️'}</span>
          </div>
          <div className="user-details">
            <span className="user-name">{currentProfile.nameMasked}</span>
            <span className="user-id">{currentProfile.identifierMasked}</span>
          </div>
        </div>

        <div className="engine-status-pill" onClick={onOpenSettings} title="Click to configure API Key">
          <span className="live-status-dot" />
          <span className="engine-label">
            {hasKey ? 'Gemini Active' : 'Edge-RAG (Free)'}
          </span>
        </div>
      </div>
    </aside>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Loader2,
  Menu,
  Monitor,
  Trash2,
  Key,
  GraduationCap,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { ChatMessage, UserRole } from '../types';
import { MessageCard } from './MessageCard';
import { SiteMapSegmentDock } from './SiteMapSegmentDock';
import { LLMService } from '../services/llmService';

interface ChatPanelProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  activeRole: UserRole;
  onSendMessage: (text: string) => void;
  onActionClick: (action: string, payload?: any) => void;
  onOpenSitemapModal?: () => void;
  sessionTitle: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onOpenSettings: () => void;
  onClearCurrentChat: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isProcessing,
  activeRole,
  onSendMessage,
  onActionClick,
  onOpenSitemapModal,
  sessionTitle,
  onToggleSidebar,
  isSidebarOpen,
  isSplitView,
  onToggleSplitView,
  onOpenSettings,
  onClearCurrentChat
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasApiKey = LLMService.hasApiKey();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Dynamic quick chips by active role
  const getRoleQuickChips = () => {
    if (activeRole === 'faculty') {
      return [
        { label: '👨‍🏫 My Assigned Classes', text: 'What classes am I teaching this semester?' },
        { label: '📅 Grade Submission Deadlines', text: 'What are my grade submission deadlines?' },
        { label: '📝 Continuous Assessment Policy', text: 'What are the faculty continuous assessment entry regulations?' },
        { label: '🛡️ Alter Grade (Safety Refusal)', text: 'Change CS301 marks for student STU-2023-01' }
      ];
    }

    if (activeRole === 'dean') {
      return [
        { label: '🏛️ Pending Condonations Queue', text: 'Show pending condonations in the review queue' },
        { label: '📋 Condonation Discretionary Limits', text: 'What are the deans council condonation approval thresholds?' },
        { label: '⚖️ Grade Moderation Policy', text: 'When must department grade moderation meetings be held?' }
      ];
    }

    // Default: Student chips
    return [
      { label: '📊 My Semester Results', text: 'Show my Odd Term 2023-24 results' },
      { label: '✅ My Attendance', text: 'What is my current attendance percentage?' },
      { label: '📅 Today\'s Schedule', text: 'Was I marked present in all lectures today?' },
      { label: '💳 Fee Status', text: 'Check my fee status, receipts and pending dues' },
      { label: '📢 University Notices', text: 'Show latest university circulars and announcements' },
      { label: '🗓️ Academic Calendar', text: 'When are the upcoming holidays and semester breaks?' },
      { label: '⚖️ Pass Criteria', text: 'What is the minimum pass criteria for end semester exams?' }
    ];
  };

  const starterCards = [
    {
      icon: <GraduationCap size={22} color="#000000" strokeWidth={2.4} />,
      title: 'Odd Term SGPA & Grades',
      desc: 'Check your verified semester marks, credits earned, and grade sheet',
      prompt: 'Show my Odd Term 2023-24 results'
    },
    {
      icon: <CheckCircle2 size={22} color="#000000" strokeWidth={2.4} />,
      title: 'Real-Time Attendance',
      desc: 'View current attendance percentage, classes held vs. attended',
      prompt: 'What is my current attendance percentage and today\'s schedule?'
    },
    {
      icon: <FileText size={22} color="#000000" strokeWidth={2.4} />,
      title: '75% Attendance & Condonation',
      desc: 'Official medical exemptions, Dean discretionary limits & rules',
      prompt: 'What are the attendance condonation guidelines and medical limits?'
    },
    {
      icon: <CreditCard size={22} color="#000000" strokeWidth={2.4} />,
      title: 'Fee Status & Receipts',
      desc: 'Semester fee ledger, recent transaction receipts and pending dues',
      prompt: 'Check my fee status, receipts and pending dues'
    },
    {
      icon: <Calendar size={22} color="#000000" strokeWidth={2.4} />,
      title: 'Academic Calendar & Holidays',
      desc: 'Upcoming semester milestones, mid-term dates, and Diwali/Winter break',
      prompt: 'When are the upcoming holidays and semester breaks?'
    },
    {
      icon: <ShieldCheck size={22} color="#000000" strokeWidth={2.4} />,
      title: 'Pass Criteria & Moderation',
      desc: 'Section 6.1 minimum 35% end-sem & 40% aggregate passing rules',
      prompt: 'What is the minimum pass criteria for end sem?'
    }
  ];

  const quickChips = getRoleQuickChips();
  const isEmptyChat = messages.length === 0 || (messages.length === 1 && messages[0].id === 'MSG-INIT-01');

  return (
    <section className="chatbot-chat-area">
      {/* Sleek Top Navigation Bar */}
      <header className="chat-top-bar">
        <div className="top-bar-left">
          <button
            className="sidebar-toggle-top-btn"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
          >
            <Menu size={18} />
          </button>

          <div className="chat-title-badge">
            <h2 className="current-chat-title">{sessionTitle || 'New Conversation'}</h2>
            <span className="current-role-badge">
              {activeRole === 'student' ? '🌸 Student' : activeRole === 'faculty' ? '🍵 Faculty' : '⛩️ Dean'}
            </span>
          </div>
        </div>

        <div className="top-bar-right">
          {/* AI Engine Status Pill */}
          <button
            className="engine-pill-btn"
            onClick={onOpenSettings}
            title="Click to view or set API Key"
          >
            <Sparkles size={14} color={hasApiKey ? '#34d399' : '#f472b6'} />
            <span className="engine-pill-text">
              {hasApiKey ? LLMService.getActiveProviderName() : 'Edge-RAG (Free)'}
            </span>
          </button>

          {/* Toggle Live Portal Split View */}
          <button
            className={`portal-view-toggle-btn ${isSplitView ? 'active' : ''}`}
            onClick={onToggleSplitView}
            title={isSplitView ? 'Close portal split view' : 'Open DigiCampus portal sandbox side-by-side'}
          >
            <Monitor size={15} />
            <span className="portal-btn-label">{isSplitView ? 'Hide Portal' : 'Split Portal'}</span>
          </button>

          {/* Clear Current Chat */}
          <button
            className="chat-action-btn"
            onClick={onClearCurrentChat}
            title="Clear messages in this conversation"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Conversation Container */}
      <div className="chat-content-container">
        {isEmptyChat ? (
          /* Empty State Hero (ChatGPT / Claude style) */
          <div className="empty-state-hero">
            <div className="hero-emblem-wrap">
              <Compass size={36} className="hero-compass-icon" />
            </div>
            <h1 className="hero-heading">How can I help you today?</h1>
            <p className="hero-subtext">
              UniAssist AI is your official intelligent companion for <strong>GD Goenka University</strong>.<br />
              Ask policy questions with verifiable citations or extract live records from DigiCampus.
            </p>

            {/* Quick Starter Cards */}
            <div className="starter-cards-grid">
              {starterCards.map((card, idx) => (
                <button
                  key={idx}
                  className="starter-card"
                  onClick={() => onSendMessage(card.prompt)}
                  disabled={isProcessing}
                >
                  <div className="starter-card-icon">{card.icon}</div>
                  <div className="starter-card-body">
                    <strong className="starter-card-title">{card.title}</strong>
                    <span className="starter-card-desc">{card.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Messages Stream */
          <div className="messages-stream">
            {/* Optional SiteMap Dock */}
            <div style={{ marginBottom: '16px' }}>
              <SiteMapSegmentDock
                onSelectSegment={(_segId, query) => onSendMessage(query)}
                onOpenSitemapModal={onOpenSitemapModal}
              />
            </div>

            {messages.map(msg => (
              <MessageCard key={msg.id} message={msg} onActionClick={onActionClick} />
            ))}

            {isProcessing && (
              <div className="message-bubble assistant animate-fade-in">
                <div className="avatar assistant">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="bubble-content">
                  <div className="bubble-text processing-indicator">
                    <span className="animate-pulse">Consulting routing layer & portal adapter...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Area */}
      <div className="chat-bottom-dock">
        {/* Role-Sensitive Quick Prompts Bar */}
        <div className="quick-chips-scroll">
          {quickChips.map((qp, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => onSendMessage(qp.text)}
              disabled={isProcessing}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Floating Capsule Input Form */}
        <form onSubmit={handleSubmit} className="floating-input-form">
          <div className="floating-input-capsule">
            <input
              type="text"
              className="chat-input-field"
              placeholder={`Ask a university question or check your ${activeRole} records...`}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isProcessing}
              autoFocus
            />
            <button
              type="submit"
              className="send-action-btn"
              disabled={!inputText.trim() || isProcessing}
              title="Send inquiry"
            >
              <Send size={16} />
            </button>
          </div>
        </form>

        {/* Micro-Disclaimer */}
        <div className="chat-disclaimer">
          UniAssist AI operates with zero credential retention. Academic regulations are verified against official GDGU handbooks.
        </div>
      </div>
    </section>
  );
};

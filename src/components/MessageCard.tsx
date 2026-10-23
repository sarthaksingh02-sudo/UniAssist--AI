import React, { useState } from 'react';
import { Bot, User, BookOpen, ExternalLink, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface MessageCardProps {
  message: ChatMessage;
  onActionClick: (action: string, payload?: any) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onActionClick }) => {
  const [showSources, setShowSources] = useState(false);
  const [showRoutingTrace, setShowRoutingTrace] = useState(false);

  const isAssistant = message.sender === 'assistant';

  const getIntentBadge = () => {
    if (!message.intent) return null;
    const cat = message.intent.category;
    let badgeClass = 'source-tag';
    let label: string = cat;

    if (cat === 'CAMPUS_KB') {
      badgeClass += ' campus';
      label = 'Campus Policy Collection';
    } else if (cat === 'PORTAL_PERSONAL') {
      badgeClass += ' portal';
      label = 'DigiCampus Portal';
    } else if (cat === 'MIXED') {
      badgeClass += ' mixed';
      label = 'Dual-Source (Portal + Policy)';
    } else {
      badgeClass += '';
      label = 'Scope Policy / Refusal';
    }

    return (
      <span className={badgeClass}>
        {label}
      </span>
    );
  };

  // Convert raw message text with simple markdown formatting (bold, bullet points)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold handling
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="bubble-strong">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} className="bubble-em">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="bubble-heading">
            {line.replace('### ', '')}
          </h4>
        );
      }

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="bubble-bullet-row">
            <span className="bubble-bullet-dot">■</span>
            <div>{formattedLine}</div>
          </div>
        );
      }

      return (
        <div key={idx} style={{ minHeight: line === '' ? '8px' : 'auto', margin: '2px 0' }}>
          {formattedLine}
        </div>
      );
    });
  };

  return (
    <div className={`message-bubble ${message.sender}`}>
      <div className={`avatar ${message.sender}`}>
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>

      <div className="bubble-content" style={{ maxWidth: '100%' }}>
        <div className="bubble-text">
          {renderFormattedText(message.text)}

          {/* Action buttons if suggested */}
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {message.suggestedActions.map((act, i) => (
                <button
                  key={i}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={() => onActionClick(act.action, act.payload)}
                >
                  <ExternalLink size={14} />
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Source toggles & citations (FR-02 & FR-06) */}
          {message.campusSources && message.campusSources.length > 0 && (
            <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
              <button
                className="btn"
                style={{ fontSize: '0.74rem', padding: '4px 10px', background: 'transparent' }}
                onClick={() => setShowSources(!showSources)}
              >
                <BookOpen size={14} color="#34d399" />
                <span>
                  {showSources ? 'Hide Verified Citations' : `View Verified Policy Citations (${message.campusSources.length})`}
                </span>
                {showSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showSources && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {message.campusSources.map((src, sIdx) => (
                    <div key={sIdx} className="citation-card">
                      <div className="citation-header">
                        <strong style={{ color: '#34d399' }}>{src.documentTitle}</strong>
                        <span>Effective: {src.effectiveDate}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Owner: {src.owner} | Section: {src.section}
                      </div>
                      <div className="citation-quote">"{src.text}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Portal Verification Badge */}
          {message.portalSource && (
            <div className="portal-verification-pill">
              <CheckCircle2 size={16} />
              <span>
                Verified extraction via <strong>{message.portalSource.section}</strong> at {message.portalSource.retrievedAt}
              </span>
            </div>
          )}
        </div>

        {/* Metadata and Route Inspector Toggle */}
        <div className="bubble-meta">
          <span>{message.timestamp}</span>
          {getIntentBadge()}

          {message.intent && (
            <button
              onClick={() => setShowRoutingTrace(!showRoutingTrace)}
              className="explain-route-btn"
            >
              {showRoutingTrace ? 'Hide route logic' : 'Explain route'}
            </button>
          )}

          {message.isError && (
            <span className="safe-failure-badge">
              <AlertCircle size={12} /> Safe failure
            </span>
          )}
        </div>

        {showRoutingTrace && message.intent && (
          <div className="routing-trace-box">
            <div><strong>Route:</strong> {message.intent.category} (Confidence: {(message.intent.confidence * 100).toFixed(0)}%)</div>
            <div style={{ marginTop: '4px' }}><strong>Reasoning:</strong> {message.intent.reasoning}</div>
          </div>
        )}
      </div>
    </div>
  );
};

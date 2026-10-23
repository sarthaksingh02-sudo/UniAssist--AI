import React from 'react';
import { X, Layers, Zap, ShieldCheck, Database, ArrowRight, CheckCircle2, Server } from 'lucide-react';
import { DIGICAMPUS_SITE_MAP } from '../data/digicampusSiteMap';

interface SiteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSegment?: (query: string) => void;
}

export const SiteMapModal: React.FC<SiteMapModalProps> = ({ isOpen, onClose, onSelectSegment }) => {
  if (!isOpen) return null;

  const segments = Object.values(DIGICAMPUS_SITE_MAP);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box sitemap-modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="modal-header-icon-badge">
              <Layers size={20} color="#f472b6" />
            </div>
            <div>
              <h3 className="modal-title">DigiCampus Site Map & Token Minimization Architecture</h3>
              <p style={{ fontSize: '0.78rem', color: '#9da4b8', margin: 0 }}>
                Targeted URL segment routing preventing over-scraping and context window pollution
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Intellectual Architectural Highlight Banner */}
          <div className="architecture-highlight-card">
            <div className="architecture-stats-grid">
              <div className="arch-stat-item">
                <span className="arch-stat-label">Traditional Portal Crawl</span>
                <span className="arch-stat-value danger">~2,850 Tokens</span>
                <span className="arch-stat-sub">Crawls all tabs, trees & navigation</span>
              </div>
              <div className="arch-divider">
                <Zap size={22} color="#10b981" />
                <span className="arch-savings-pill">93.7% Savings</span>
              </div>
              <div className="arch-stat-item">
                <span className="arch-stat-label">UniAssist AI Targeted Route</span>
                <span className="arch-stat-value success">~180 Tokens</span>
                <span className="arch-stat-sub">Scrapes only requested DOM leaf nodes</span>
              </div>
            </div>

            <div className="arch-guarantees-row">
              <div className="guarantee-chip">
                <ShieldCheck size={14} color="#10b981" />
                <span>Zero Database Persistence (Ephemeral RAG)</span>
              </div>
              <div className="guarantee-chip">
                <Database size={14} color="#f472b6" />
                <span>Data Minimization (Extracts only matched fields)</span>
              </div>
              <div className="guarantee-chip">
                <Server size={14} color="#a855f7" />
                <span>Fail-Closed on Unrecognized Layouts</span>
              </div>
            </div>
          </div>

          <h4 style={{ margin: '20px 0 12px 0', fontSize: '0.92rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Targeted URL Segment Registry</span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 400 }}>({segments.length} Registered Endpoints)</span>
          </h4>

          <div className="segment-registry-list">
            {segments.map(seg => (
              <div key={seg.id} className="segment-registry-card">
                <div className="segment-card-header">
                  <div className="segment-card-title-group">
                    <span className="segment-category-badge">{seg.category}</span>
                    <strong className="segment-name">{seg.name}</strong>
                  </div>
                  <code className="segment-route-code">{seg.hashRoutePattern}</code>
                </div>

                <p className="segment-description">{seg.description}</p>

                <div className="segment-meta-grid">
                  <div className="segment-meta-item">
                    <span className="segment-meta-label">Target DOM Selectors:</span>
                    <div className="selector-tags">
                      {seg.targetSelectors.map((s, idx) => (
                        <span key={idx} className="selector-tag">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="segment-meta-item">
                    <span className="segment-meta-label">Minimal Extracted Fields:</span>
                    <div className="field-tags">
                      {seg.minimalFields.map((f, idx) => (
                        <span key={idx} className="field-tag">
                          <CheckCircle2 size={11} color="#10b981" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {onSelectSegment && (
                  <div className="segment-card-footer">
                    <button
                      className="segment-test-query-btn"
                      onClick={() => {
                        const sampleQuery = seg.sampleTriggers[0] ? `Check ${seg.sampleTriggers[0]}` : `Show ${seg.name}`;
                        onSelectSegment(sampleQuery);
                        onClose();
                      }}
                    >
                      <span>Test Segment Query: "{seg.sampleTriggers[0]}"</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

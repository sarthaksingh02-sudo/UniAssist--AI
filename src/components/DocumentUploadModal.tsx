import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, Plus } from 'lucide-react';
import { KnowledgeService } from '../services/knowledgeService';
import { PolicyDocument } from '../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: PolicyDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded
}) => {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [category, setCategory] = useState<PolicyDocument['category']>('Academics');
  const [section, setSection] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('February 1, 2026');
  const [keywords, setKeywords] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setContent(text);
      if (!summary) {
        setSummary(text.slice(0, 150) + '...');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedKeywords = keywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    const doc = KnowledgeService.addCustomDocument({
      title: title.trim(),
      owner: owner.trim() || 'Office of Academic Affairs',
      category,
      section: section.trim() || 'General Policy Provisions',
      effectiveDate: effectiveDate.trim() || '2026 Academic Year',
      lastReviewedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      summary: summary.trim() || title.trim(),
      keywords: parsedKeywords.length > 0 ? parsedKeywords : [title.toLowerCase()],
      content: content.trim()
    });

    setSuccessMsg(true);
    onDocumentAdded(doc);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      // Reset form
      setTitle('');
      setOwner('');
      setContent('');
      setSummary('');
      setKeywords('');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} color="#f472b6" />
            <h3 className="modal-title">Custom Policy Ingestion & Indexing</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Upload or paste custom university guidelines, hostel rules, or lab handbooks. The system immediately chunks, indexes, and cites this policy in subsequent student inquiries.
          </p>

          {/* File Picker */}
          <div style={{
            border: '2px dashed #000000',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            background: 'var(--neo-yellow-light)',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <FileText size={24} color="#000000" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '0.82rem', color: '#000000', fontWeight: 700 }}>Select a document file (.txt, .md, .csv)</div>
            <input
              type="file"
              accept=".txt,.md,.markdown,.csv"
              onChange={handleFileUpload}
              style={{ marginTop: '8px', fontSize: '0.78rem', color: '#000000', fontWeight: 600 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Document Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AI Laboratory Safety & GPU Access Norms 2026"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="Academics">Academics</option>
                <option value="Examinations">Examinations</option>
                <option value="Attendance">Attendance</option>
                <option value="Hostel & Campus">Hostel & Campus</option>
                <option value="Financial & Fees">Financial & Fees</option>
                <option value="Faculty & Staff">Faculty & Staff</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Governing Body / Owner</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dept. of Computer Science"
                value={owner}
                onChange={e => setOwner(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Section / Clause</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Clause 3.2 — GPU Quota"
                value={section}
                onChange={e => setSection(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Effective Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. January 2026"
                value={effectiveDate}
                onChange={e => setEffectiveDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Keywords (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. gpu, lab, quota, server, machine learning, access hours"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Policy Text Content *</label>
            <textarea
              className="form-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
              placeholder="Paste the official regulation text or guidelines here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.85rem' }}>
              <CheckCircle size={18} />
              <span>Document indexed successfully! Now searchable with citations.</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !content.trim()}>
              <Plus size={16} />
              <span>Ingest & Index Policy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

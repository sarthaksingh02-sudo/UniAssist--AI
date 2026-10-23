import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, Cpu, ShieldCheck } from 'lucide-react';
import { LLMService } from '../services/llmService';
import { LLMProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsSaved }) => {
  const currentSettings = LLMService.getSettings();
  const [provider, setProvider] = useState<LLMProvider>(currentSettings.provider);
  const [apiKey, setApiKey] = useState(currentSettings.apiKey || '');
  const [model, setModel] = useState(currentSettings.model || 'gemini-1.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await LLMService.testConnection(apiKey, provider, model);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    LLMService.saveSettings({
      provider,
      apiKey: apiKey.trim(),
      model
    });
    setTestResult({ success: true, message: 'Settings saved successfully!' });
    if (onSettingsSaved) onSettingsSaved();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClearKey = () => {
    setApiKey('');
    LLMService.saveSettings({ apiKey: '' });
    setTestResult({ success: true, message: 'Cleared! System switched to In-Browser Edge RAG.' });
    if (onSettingsSaved) onSettingsSaved();
  };

  const hasKey = apiKey.trim().length > 5;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={22} color="#34d399" />
            <div>
              <h3 className="modal-title">AI Engine & API Key Settings</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Configure Google Gemini, OpenAI, or use the built-in local Edge-RAG</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Engine Status Banner */}
          <div className={`engine-status-banner ${hasKey ? 'active-cloud' : 'active-local'}`}>
            <div className="banner-icon">
              {hasKey ? <Sparkles size={18} color="#34d399" /> : <Cpu size={18} color="#f472b6" />}
            </div>
            <div className="banner-content">
              <strong>
                {hasKey ? `Cloud LLM Active: ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'}` : 'In-Browser Hybrid Edge-RAG Active'}
              </strong>
              <span>
                {hasKey
                  ? 'Ground-truth academic policies and live telemetry will be synthesized using your cloud model.'
                  : 'Zero API keys required. All queries run 100% locally in-browser using BM25 and vector indexing at zero cost.'}
              </span>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Select AI Provider</label>
            <div className="provider-grid">
              <button
                type="button"
                className={`provider-card ${provider === 'gemini' ? 'selected' : ''}`}
                onClick={() => { setProvider('gemini'); setModel('gemini-1.5-flash'); }}
              >
                <div className="provider-card-header">
                  <span className="provider-badge">Recommended</span>
                  <span className="provider-name">Google Gemini</span>
                </div>
                <span className="provider-desc">Gemini 1.5 Flash / Pro via Google AI Studio</span>
              </button>

              <button
                type="button"
                className={`provider-card ${provider === 'openai' ? 'selected' : ''}`}
                onClick={() => { setProvider('openai'); setModel('gpt-4o-mini'); }}
              >
                <div className="provider-card-header">
                  <span className="provider-name">OpenAI</span>
                </div>
                <span className="provider-desc">GPT-4o / GPT-4o-mini API</span>
              </button>
            </div>
          </div>

          {/* Model Selector */}
          {provider === 'gemini' && (
            <div className="form-group">
              <label className="form-label">Gemini Model</label>
              <select
                className="form-select"
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast, High Accuracy)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Contextual Reasoning)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
              </select>
            </div>
          )}

          {/* API Key Input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
              </label>
              <a
                href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://platform.openai.com/api-keys'}
                target="_blank"
                rel="noreferrer"
                className="api-help-link"
              >
                Get {provider === 'gemini' ? 'free Gemini Key' : 'OpenAI Key'} ↗
              </a>
            </div>

            <div className="api-input-wrapper">
              <Key size={16} className="api-icon" />
              <input
                type={showKey ? 'text' : 'password'}
                className="form-input"
                placeholder={provider === 'gemini' ? 'Paste your AIzaSy... key here' : 'Paste your sk-... key here'}
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
              />
              <button
                type="button"
                className="key-toggle-btn"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className={`test-feedback-pill ${testResult.success ? 'success' : 'error'}`}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Security & Privacy Guarantee */}
          <div className="privacy-badge-box">
            <ShieldCheck size={16} color="#34d399" />
            <div>
              <strong>Client-Side Storage Guarantee:</strong>
              <span>Your API key is saved strictly in your local browser storage. It is never logged, stored in any database, or transmitted anywhere except directly to Google/OpenAI official endpoints.</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            {hasKey && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleClearKey}
              >
                Remove Key
              </button>
            )}
            <button
              type="button"
              className="btn btn-glass"
              onClick={handleTestConnection}
              disabled={isTesting || !hasKey}
            >
              {isTesting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} color="#34d399" />
                  <span>Test Connection</span>
                </>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-glass" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-sakura" onClick={handleSave}>
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

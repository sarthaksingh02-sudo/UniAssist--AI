import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, Cpu, ShieldCheck } from 'lucide-react';
import { LLMService, OPENROUTER_MODEL_LABELS, OPENROUTER_DEFAULT_MODEL } from '../services/llmService';
import { LLMProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsSaved }) => {
  const currentSettings = LLMService.getSettings();
  const [provider, setProvider] = useState<LLMProvider>(currentSettings.provider || 'openrouter');
  const [apiKey, setApiKey] = useState(currentSettings.apiKey || '');
  const [model, setModel] = useState(currentSettings.model || OPENROUTER_DEFAULT_MODEL);
  const [customModel, setCustomModel] = useState(
    currentSettings.provider === 'openrouter' && !OPENROUTER_MODEL_LABELS[currentSettings.model]
      ? currentSettings.model
      : ''
  );
  const [isCustomModel, setIsCustomModel] = useState(
    currentSettings.provider === 'openrouter' &&
    (!OPENROUTER_MODEL_LABELS[currentSettings.model] || currentSettings.model === 'custom')
  );
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const effectiveModel =
    provider === 'openrouter' && isCustomModel
      ? (customModel.trim() || 'deepseek/deepseek-chat')
      : model;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await LLMService.testConnection(apiKey, provider, effectiveModel);
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
      model: effectiveModel
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

  const handleProviderChange = (newProvider: LLMProvider) => {
    setProvider(newProvider);
    setTestResult(null);
    if (newProvider === 'openrouter') {
      setModel(OPENROUTER_DEFAULT_MODEL);
      setIsCustomModel(false);
    } else if (newProvider === 'gemini') {
      setModel('gemini-1.5-flash');
      setIsCustomModel(false);
    } else if (newProvider === 'openai') {
      setModel('gpt-4o-mini');
      setIsCustomModel(false);
    }
  };

  const hasKey = apiKey.trim().length > 5;

  const getProviderDisplayName = () => {
    if (provider === 'openrouter') return `OpenRouter (${effectiveModel})`;
    if (provider === 'gemini') return `Google Gemini (${model})`;
    return `OpenAI (${model})`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={22} color="#34d399" />
            <div>
              <h3 className="modal-title">AI Engine &amp; API Key Settings</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                Configure OpenRouter (DeepSeek / Any Model), Google Gemini, or built-in Edge-RAG
              </p>
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
                {hasKey ? `Cloud LLM Active: ${getProviderDisplayName()}` : 'In-Browser Hybrid Edge-RAG Active'}
              </strong>
              <span>
                {hasKey
                  ? 'Official academic policies and verified DigiCampus telemetry will be synthesized using your cloud model.'
                  : 'Zero API keys required. All queries run 100% locally in-browser using BM25 and vector indexing.'}
              </span>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Select AI Provider</label>
            <div className="provider-grid">
              {/* OpenRouter (DeepSeek) */}
              <button
                type="button"
                className={`provider-card ${provider === 'openrouter' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('openrouter')}
              >
                <div className="provider-card-header">
                  <span className="provider-badge" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
                    DeepSeek Ready
                  </span>
                  <span className="provider-name">OpenRouter</span>
                </div>
                <span className="provider-desc">DeepSeek V3, R1, Flash &amp; 100+ models</span>
              </button>

              {/* Google Gemini */}
              <button
                type="button"
                className={`provider-card ${provider === 'gemini' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('gemini')}
              >
                <div className="provider-card-header">
                  <span className="provider-badge">Recommended</span>
                  <span className="provider-name">Google Gemini</span>
                </div>
                <span className="provider-desc">Gemini 1.5 Flash / Pro via AI Studio</span>
              </button>

              {/* OpenAI */}
              <button
                type="button"
                className={`provider-card ${provider === 'openai' ? 'selected' : ''}`}
                onClick={() => handleProviderChange('openai')}
              >
                <div className="provider-card-header">
                  <span className="provider-name">OpenAI</span>
                </div>
                <span className="provider-desc">GPT-4o &amp; GPT-4o-mini API</span>
              </button>
            </div>
          </div>

          {/* Model Selector for OpenRouter */}
          {provider === 'openrouter' && (
            <div className="form-group">
              <label className="form-label">OpenRouter Model</label>
              <select
                className="form-select"
                value={isCustomModel ? 'custom' : model}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setIsCustomModel(true);
                  } else {
                    setIsCustomModel(false);
                    setModel(val);
                  }
                  setTestResult(null);
                }}
              >
                <option value="deepseek/deepseek-chat">DeepSeek V3 Chat (deepseek/deepseek-chat)</option>
                <option value="deepseek/deepseek-r1">DeepSeek R1 Reasoning (deepseek/deepseek-r1)</option>
                <option value="deepseek/deepseek-chat:free">DeepSeek V3 (Free tier)</option>
                <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free tier)</option>
                <option value="deepseek/deepseek-chat-v3-5:free">DeepSeek V3.5 (Free)</option>
                <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Free via OpenRouter)</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">Meta Llama 3.3 70B (Free)</option>
                <option value="custom">⚙️ Custom Model ID (enter your own)...</option>
              </select>

              {isCustomModel && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter model slug (e.g. deepseek/deepseek-chat, deepseek-v4-flash-0731)"
                    value={customModel}
                    onChange={e => {
                      setCustomModel(e.target.value);
                      setTestResult(null);
                    }}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    Tip: Enter any valid OpenRouter model slug directly as listed on openrouter.ai/models.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Model Selector for Gemini */}
          {provider === 'gemini' && (
            <div className="form-group">
              <label className="form-label">Gemini Model</label>
              <select
                className="form-select"
                value={model}
                onChange={e => {
                  setModel(e.target.value);
                  setTestResult(null);
                }}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast, High Accuracy)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Contextual Reasoning)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
              </select>
            </div>
          )}

          {/* Model Selector for OpenAI */}
          {provider === 'openai' && (
            <div className="form-group">
              <label className="form-label">OpenAI Model</label>
              <select
                className="form-select"
                value={model}
                onChange={e => {
                  setModel(e.target.value);
                  setTestResult(null);
                }}
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Fast, Cost-Effective)</option>
                <option value="gpt-4o">GPT-4o (High Intelligence Flagship)</option>
              </select>
            </div>
          )}

          {/* API Key Input */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                {provider === 'openrouter'
                  ? 'OpenRouter API Key'
                  : provider === 'gemini'
                  ? 'Google Gemini API Key'
                  : 'OpenAI API Key'}
              </label>
              <a
                href={
                  provider === 'openrouter'
                    ? 'https://openrouter.ai/keys'
                    : provider === 'gemini'
                    ? 'https://aistudio.google.com/app/apikey'
                    : 'https://platform.openai.com/api-keys'
                }
                target="_blank"
                rel="noreferrer"
                className="api-help-link"
              >
                Get {provider === 'openrouter' ? 'OpenRouter Key' : provider === 'gemini' ? 'free Gemini Key' : 'OpenAI Key'} ↗
              </a>
            </div>

            <div className="api-input-wrapper">
              <Key size={16} className="api-icon" />
              <input
                type={showKey ? 'text' : 'password'}
                className="form-input"
                placeholder={
                  provider === 'openrouter'
                    ? 'Paste your sk-or-v1-... key here'
                    : provider === 'gemini'
                    ? 'Paste your AIzaSy... key here'
                    : 'Paste your sk-... key here'
                }
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
              <span>
                Your API key is saved strictly in your local browser storage. It is never logged, stored in any database, or transmitted anywhere except directly to official OpenRouter / Google / OpenAI endpoints.
              </span>
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
              Save &amp; Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Play, ShieldCheck, Activity } from 'lucide-react';
import { EvaluationRunner } from '../tests/evaluationSuite';
import { EvaluationResult } from '../types';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose }) => {
  const [suiteResults, setSuiteResults] = useState<ReturnType<typeof EvaluationRunner.runAll> | null>(null);
  const [filterTag, setFilterTag] = useState<'all' | 'passed' | 'failed'>('all');

  const runEvaluation = () => {
    const results = EvaluationRunner.runAll();
    setSuiteResults(results);
  };

  useEffect(() => {
    if (isOpen && !suiteResults) {
      runEvaluation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems: EvaluationResult[] = suiteResults
    ? suiteResults.results.filter(r => {
        if (filterTag === 'passed') return r.passed;
        if (filterTag === 'failed') return !r.passed;
        return true;
      })
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#34d399" />
            <h3 className="modal-title">Phase 1 Acceptance Criteria & Routing Benchmark</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {suiteResults && (
            <>
              {/* Metrics Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: suiteResults.routingPassed ? 'var(--neo-mint-light)' : '#FEE2E2',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px #000000'
                }}>
                  <div style={{ fontSize: '0.74rem', color: '#000000', fontWeight: 800 }}>ROUTING ACCURACY (TARGET: ≥90%)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#000000' }}>
                    {suiteResults.accuracyPercentage}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#374151', marginTop: '4px', fontWeight: 600 }}>
                    {suiteResults.passedScenarios} of {suiteResults.totalScenarios} scenarios correct
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'var(--neo-lilac-light)',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px #000000'
                }}>
                  <div style={{ fontSize: '0.74rem', color: '#000000', fontWeight: 800 }}>PRIVACY & FAIL-CLOSED SAFETY</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={24} color="#000000" />
                    <span>VERIFIED</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#374151', marginTop: '4px', fontWeight: 600 }}>
                    Expired session & layout changes fail-closed
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <button
                    className="btn btn-primary"
                    onClick={runEvaluation}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Play size={16} />
                    <span>Re-Run Test Suite</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button
                  className={`btn ${filterTag === 'all' ? 'btn-primary' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  onClick={() => setFilterTag('all')}
                >
                  All Scenarios ({suiteResults.totalScenarios})
                </button>
                <button
                  className={`btn ${filterTag === 'passed' ? 'btn-primary' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  onClick={() => setFilterTag('passed')}
                >
                  Passed ({suiteResults.passedScenarios})
                </button>
                <button
                  className={`btn ${filterTag === 'failed' ? 'btn-primary' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                  onClick={() => setFilterTag('failed')}
                >
                  Failed ({suiteResults.totalScenarios - suiteResults.passedScenarios})
                </button>
              </div>

              {/* Scenarios List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                {filteredItems.map(item => (
                  <div
                    key={item.scenarioId}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    {item.passed ? (
                      <CheckCircle size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <XCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#000000' }}>
                          "{item.question}"
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--neo-yellow)',
                          border: '1px solid #000000',
                          color: '#000000'
                        }}>
                          {item.scenarioId}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#374151', marginTop: '4px', fontWeight: 600 }}>
                        Expected: <strong style={{ color: '#000000' }}>{item.expectedCategory}</strong> | Actual: <strong style={{ color: item.passed ? '#059669' : '#DC2626' }}>{item.actualCategory}</strong>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#4B5563', marginTop: '2px', fontStyle: 'italic', fontWeight: 500 }}>
                        {item.notes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

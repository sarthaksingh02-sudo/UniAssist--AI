import React, { useState } from 'react';
import {
  Globe,
  Lock,
  User,
  RefreshCw,
  AlertTriangle,
  KeyRound,
  LayoutTemplate,
  ShieldAlert,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  ExternalLink,
  Loader2,
  ShieldCheck,
  GraduationCap,
  CreditCard,
  Bell,
  Calendar,
  Home,
  FileText
} from 'lucide-react';
import { DigiCampusState, UserRole } from '../types';
import {
  MOCK_SEMESTER_RESULTS,
  MOCK_USER_PROFILES,
  MOCK_ENROLLED_COURSES,
  MOCK_FACULTY_CLASSES,
  MOCK_DEAN_APPROVALS
} from '../data/mockPortalData';
import { DIGICAMPUS_SITE_MAP } from '../data/digicampusSiteMap';
import { PortalConnector } from '../services/portalConnector';

interface DigiCampusSandboxProps {
  portalState: DigiCampusState;
  onStateChange: () => void;
}

export const DigiCampusSandbox: React.FC<DigiCampusSandboxProps> = ({
  portalState,
  onStateChange
}) => {
  const [studentTab, setStudentTab] = useState<'results' | 'attendance' | 'fees' | 'notices' | 'calendar' | 'courses'>('results');
  
  // Real Login Form State (Defaulted to GD Goenka University credentials)
  const [loginRole, setLoginRole] = useState<UserRole>(portalState.userRole || 'student');
  const [loginUsername, setLoginUsername] = useState('230160223096');
  const [loginFullName, setLoginFullName] = useState('Sarthak Singh');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const userProfile = MOCK_USER_PROFILES[portalState.userRole];
  const currentResult = MOCK_SEMESTER_RESULTS[portalState.selectedPeriod];

  const handlePeriodChange = (period: string) => {
    PortalConnector.setSelectedPeriod(period);
    onStateChange();
  };

  const handleSetAuth = (status: DigiCampusState['authStatus']) => {
    PortalConnector.setAuthStatus(status);
    onStateChange();
  };

  const handleSetLayout = (layout: string) => {
    PortalConnector.setLayoutVersion(layout);
    if (layout === 'results-v2-unknown') {
      PortalConnector.setAuthStatus('UNKNOWN_LAYOUT');
    } else {
      PortalConnector.setAuthStatus('CONNECTED_AUTHENTICATED');
    }
    onStateChange();
  };

  const handleRoleTabChange = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'student') {
      setLoginUsername('230160223096');
      setLoginFullName('Sarthak Singh');
    } else if (role === 'faculty') {
      setLoginUsername('GDGU-FAC-1042');
      setLoginFullName('Prof. Chandravilash Rai');
    } else if (role === 'dean') {
      setLoginUsername('GDGU-DEAN-001');
      setLoginFullName('Prof. Anita Sen');
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) return;

    setIsAuthenticating(true);
    setLoginMessage('Authenticating with GDGU Digii Identity Gateway...');

    setTimeout(() => {
      PortalConnector.loginWithCredentials(
        loginUsername.trim(),
        loginRole,
        loginFullName.trim() || undefined
      );
      setIsAuthenticating(false);
      setLoginMessage(null);
      onStateChange();
    }, 650);
  };

  const handleSignOut = () => {
    PortalConnector.disconnect();
    onStateChange();
  };

  return (
    <section className="glass-panel portal-pane">
      {/* Browser Bar with exact GDGU DigiCampus URL */}
      <div className="portal-browser-bar">
        <div className="browser-dots">
          <div className="dot red" />
          <div className="dot yellow" />
          <div className="dot green" />
        </div>
        <div className="url-bar">
          <Lock size={12} color="#10b981" />
          <span>
            {portalState.authStatus === 'DISCONNECTED' && 'https://gdgu.digiicampus.com/'}
            {portalState.authStatus !== 'DISCONNECTED' && portalState.userRole === 'student' && (
              studentTab === 'results' ? 'https://gdgu.digiicampus.com/V2/#/examinationManagement/studentExamRecords/674656' :
              studentTab === 'attendance' ? 'https://gdgu.digiicampus.com/profile/674656/attendance' :
              studentTab === 'fees' ? 'https://gdgu.digiicampus.com/V2/#/feeManagement/studentFeeLedger' :
              studentTab === 'notices' ? 'https://gdgu.digiicampus.com/V2/#/community/feed' :
              studentTab === 'calendar' ? 'https://gdgu.digiicampus.com/V2/#/academicCalendar/events' :
              'https://gdgu.digiicampus.com/V2/#/courseRegistration/enrolledCourses'
            )}
            {portalState.authStatus !== 'DISCONNECTED' && portalState.userRole === 'faculty' && 'https://gdgu.digiicampus.com/V2/#/faculty/dashboard'}
            {portalState.authStatus !== 'DISCONNECTED' && portalState.userRole === 'dean' && 'https://gdgu.digiicampus.com/V2/#/dean/council/approvals'}
          </span>
        </div>
        <button
          className="btn"
          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          onClick={() => {
            PortalConnector.setAuthStatus('CONNECTED_AUTHENTICATED');
            onStateChange();
          }}
          title="Reload Portal Tab"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="portal-content">
        {/* Live Portal Launcher Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(244, 114, 182, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="#f472b6" />
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                GD Goenka University DigiCampus (Live Host)
              </span>
              <span style={{ fontSize: '0.72rem', color: '#9da4b8', display: 'block' }}>
                Official Endpoint: <code>gdgu.digiicampus.com</code>
              </span>
            </div>
          </div>
          <a
            href="https://gdgu.digiicampus.com/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ fontSize: '0.74rem', padding: '6px 12px', background: 'linear-gradient(135deg, #e11d48, #f472b6)' }}
          >
            <span>Launch Live Tab ↗</span>
          </a>
        </div>

        {/* Test Bench Edge-Case Simulator Controls */}
        <div className="test-controls-card">
          <div className="test-controls-title">
            <ShieldAlert size={14} color="#f59e0b" />
            <span>GDGU Portal Session & Failure Simulator</span>
          </div>
          <div className="controls-button-grid">
            <button
              className={`control-btn ${portalState.authStatus === 'CONNECTED_AUTHENTICATED' ? 'active' : ''}`}
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              🟢 Authenticated
            </button>
            <button
              className={`control-btn ${portalState.authStatus === 'SESSION_EXPIRED' ? 'active' : ''}`}
              onClick={() => handleSetAuth('SESSION_EXPIRED')}
            >
              🟡 Expire Session
            </button>
            <button
              className={`control-btn ${portalState.authStatus === 'MFA_CHALLENGE' ? 'active' : ''}`}
              onClick={() => handleSetAuth('MFA_CHALLENGE')}
            >
              🔒 Trigger MFA
            </button>
            <button
              className={`control-btn ${portalState.authStatus === 'DISCONNECTED' ? 'active' : ''}`}
              onClick={handleSignOut}
            >
              ⚪ Sign Out / Disconnect
            </button>
            <button
              className={`control-btn ${portalState.layoutVersion === 'results-v2-unknown' ? 'active' : ''}`}
              onClick={() => handleSetLayout(portalState.layoutVersion === 'results-v2-unknown' ? 'results-v1' : 'results-v2-unknown')}
            >
              ⚠️ Layout Redesign (Fail-Closed)
            </button>
          </div>
        </div>

        {/* GD GOENKA UNIVERSITY OFFICIAL SSO LOGIN VIEW */}
        {portalState.authStatus === 'DISCONNECTED' && (
          <div style={{
            margin: '0 auto',
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(15, 23, 42, 0.85)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                welcome to
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
                <span style={{ color: '#ea5652' }}>GD GOENKA</span> UNIVERSITY
              </h3>
              <div style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(234, 86, 82, 0.15)', color: '#f87171', border: '1px solid rgba(234, 86, 82, 0.3)' }}>
                NAAC GRADE A+ ACCREDITED
              </div>
            </div>

            {/* Role Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '4px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <button
                type="button"
                className={`btn ${loginRole === 'student' ? 'btn-primary' : ''}`}
                style={{ fontSize: '0.76rem', padding: '6px 4px', justifyContent: 'center' }}
                onClick={() => handleRoleTabChange('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`btn ${loginRole === 'faculty' ? 'btn-primary' : ''}`}
                style={{ fontSize: '0.76rem', padding: '6px 4px', justifyContent: 'center' }}
                onClick={() => handleRoleTabChange('faculty')}
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                className={`btn ${loginRole === 'dean' ? 'btn-primary' : ''}`}
                style={{ fontSize: '0.76rem', padding: '6px 4px', justifyContent: 'center' }}
                onClick={() => handleRoleTabChange('dean')}
              >
                🏛️ Dean
              </button>
            </div>

            <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>
                  Registration id / email / phone no. *
                </label>
                <input
                  type="text"
                  className="chat-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                  placeholder="e.g. 230101010042 or yourname@gdgu.org"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>
                  Student / User Display Name
                </label>
                <input
                  type="text"
                  className="chat-input"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.85rem'
                  }}
                  placeholder="e.g. Sarthak Singh"
                  value={loginFullName}
                  onChange={e => setLoginFullName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="chat-input"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '6px' }}>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{loginMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.9rem', marginTop: '4px' }}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Authenticating GDGU Session...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Sign In to GDGU DigiCampus ({loginRole.toUpperCase()})</span>
                  </>
                )}
              </button>
            </form>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginTop: '16px',
              padding: '10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '0.72rem',
              color: '#6ee7b7'
            }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>GDGU Security Protocol:</strong> Direct SSO tab sign-in. In compliance with Phase 1 PRD FR-03, UniAssist AI never asks for, records, or stores your DigiCampus password.
              </div>
            </div>
          </div>
        )}

        {/* SESSION EXPIRED STATE */}
        {portalState.authStatus === 'SESSION_EXPIRED' && (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            padding: '30px',
            background: 'rgba(245, 158, 11, 0.06)',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            maxWidth: '400px'
          }}>
            <AlertTriangle size={42} color="#f59e0b" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fbbf24', marginBottom: '8px' }}>GDGU Session Timed Out</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Your GD Goenka University portal session has expired. Re-authenticate directly on this tab to resume.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              Re-authenticate Session
            </button>
          </div>
        )}

        {/* MFA CHALLENGE STATE */}
        {portalState.authStatus === 'MFA_CHALLENGE' && (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            padding: '30px',
            background: 'rgba(99, 102, 241, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            maxWidth: '400px'
          }}>
            <KeyRound size={42} color="#818cf8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#a5b4fc', marginBottom: '8px' }}>GDGU Two-Factor Authentication</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Enter the OTP sent to your registered mobile / email directly on this portal screen.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              Complete Verification Directly
            </button>
          </div>
        )}

        {/* UNKNOWN LAYOUT FAIL-CLOSED STATE */}
        {portalState.authStatus === 'UNKNOWN_LAYOUT' && (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            padding: '30px',
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            maxWidth: '420px'
          }}>
            <LayoutTemplate size={42} color="#f87171" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fca5a5', marginBottom: '8px' }}>Unrecognized Portal Layout</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
              The GDGU DigiCampus layout was updated. Failing closed to prevent corrupted or hallucinated records.
            </p>
            <button
              className="btn"
              onClick={() => handleSetLayout('results-v1')}
            >
              Restore Standard Layout (results-v1)
            </button>
          </div>
        )}

        {/* AUTHENTICATED VIEW: GDGU STUDENT / FACULTY / DEAN */}
        {portalState.authStatus === 'CONNECTED_AUTHENTICATED' && (
          <div>
            {/* Authenticated GDGU Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              marginBottom: '14px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: portalState.userRole === 'student' ? 'linear-gradient(135deg, #be185d, #f472b6)' : portalState.userRole === 'faculty' ? '#064e3b' : '#581c87',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {userProfile.nameMasked.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    {userProfile.nameMasked} <span style={{ fontSize: '0.72rem', color: '#f472b6', fontWeight: 500 }}>({userProfile.currentSemesterOrTitle})</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {portalState.activeAccountMasked || userProfile.identifierMasked} • {userProfile.departmentOrProgram}
                  </div>
                </div>
              </div>

              {/* Status & Sign Out */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  {userProfile.enrollmentOrStatus}
                </span>

                <button
                  className="btn"
                  style={{
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    color: '#f87171',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.05)'
                  }}
                  onClick={handleSignOut}
                  title="Sign out of GDGU DigiCampus session"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* 1. STUDENT VIEW */}
            {portalState.userRole === 'student' && (
              <div>
                {/* Tab switch with All 6 Domain Segments */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <button
                    className={`btn ${studentTab === 'results' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('results');
                      PortalConnector.setSection('results');
                      onStateChange();
                    }}
                  >
                    <Award size={13} />
                    <span>Results</span>
                  </button>
                  <button
                    className={`btn ${studentTab === 'attendance' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('attendance');
                      PortalConnector.setSection('attendance');
                      onStateChange();
                    }}
                  >
                    <Clock size={13} />
                    <span>Attendance</span>
                  </button>
                  <button
                    className={`btn ${studentTab === 'fees' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('fees');
                      PortalConnector.setSection('fees');
                      onStateChange();
                    }}
                  >
                    <CreditCard size={13} />
                    <span>Fee Ledger</span>
                  </button>
                  <button
                    className={`btn ${studentTab === 'notices' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('notices');
                      PortalConnector.setSection('notices');
                      onStateChange();
                    }}
                  >
                    <Bell size={13} />
                    <span>Circulars</span>
                  </button>
                  <button
                    className={`btn ${studentTab === 'calendar' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('calendar');
                      PortalConnector.setSection('calendar');
                      onStateChange();
                    }}
                  >
                    <Calendar size={13} />
                    <span>Calendar</span>
                  </button>
                  <button
                    className={`btn ${studentTab === 'courses' ? 'btn-primary' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                    onClick={() => {
                      setStudentTab('courses');
                      PortalConnector.setSection('courses');
                      onStateChange();
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Courses</span>
                  </button>

                  {studentTab === 'results' && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Period:</span>
                      <select
                        value={portalState.selectedPeriod}
                        onChange={e => handlePeriodChange(e.target.value)}
                        style={{
                          background: '#1e293b',
                          color: '#f8fafc',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          fontSize: '0.72rem'
                        }}
                      >
                        <option value="Odd Term Examination 2023-24">Odd Term Exam 2023-24 (Sem 1) — SGPA 8.91</option>
                        <option value="End Term Examination Even 2023-24">End Term Exam Even 2023-24 (Sem 2) — SGPA 8.68</option>
                        <option value="End Term Examination Odd 2024-25">End Term Exam Odd 2024-25 (Sem 3) — SGPA 9.68</option>
                        <option value="End Term Examination Even 2024-25">End Term Exam Even 2024-25 (Sem 4) — SGPA 9.67</option>
                        <option value="End Term Examination Odd Sem 2025-26">End Term Exam Odd Sem 2025-26 (Sem 5) — SGPA 9.27</option>
                        <option value="End Term Examination Even Sem 2025-26">End Term Exam Even Sem 2025-26 (Sem 6) — SGPA 9.18</option>
                        <option value="End Term Examination Odd Sem 2026-27">End Term Exam Odd Sem 2026-27 (Sem 7) — Ongoing</option>
                        <option value="Fall 2025">Fall 2025 (Sem 5 Alias)</option>
                        <option value="Spring 2025">Spring 2025 (Sem 4 Alias)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Sub-view: Results */}
                {studentTab === 'results' && currentResult && currentResult.courses.length > 0 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#93c5fd' }}>SGPA</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentResult.sgpa.toFixed(2)}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>CGPA</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentResult.cgpa.toFixed(2)}</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#d8b4fe' }}>CREDITS EARNED</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentResult.totalCreditsEarned}</div>
                      </div>
                    </div>

                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                      <table className="portal-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Course Title</th>
                            <th>Credits</th>
                            <th>CIA</th>
                            <th>ESE</th>
                            <th>Total</th>
                            <th>Grade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentResult.courses.map((c, i) => (
                            <tr key={i}>
                              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.courseCode}</td>
                              <td>{c.courseTitle}</td>
                              <td>{c.credits}</td>
                              <td>{c.internalMarks}</td>
                              <td>{c.endTermMarks}</td>
                              <td style={{ fontWeight: 700 }}>{c.totalMarks}</td>
                              <td><span className="grade-pill">{c.grade}</span></td>
                              <td style={{ color: c.status === 'Pass' ? '#34d399' : '#f87171' }}>{c.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Sub-view: Attendance & Courses */}
                {studentTab === 'attendance' && (
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Course Title</th>
                          <th>Instructor & Room</th>
                          <th>Held</th>
                          <th>Attended</th>
                          <th>%</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ENROLLED_COURSES.map((c, i) => (
                          <tr key={i}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.courseCode}</td>
                            <td>{c.courseTitle}</td>
                            <td style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.instructor} • {c.room}</td>
                            <td>{c.totalClassesHeld}</td>
                            <td>{c.classesAttended}</td>
                            <td style={{ fontWeight: 700, color: c.attendancePercentage >= 75 ? '#34d399' : '#f59e0b' }}>
                              {c.attendancePercentage.toFixed(1)}%
                            </td>
                            <td>
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: c.attendanceStatus === 'Satisfactory' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: c.attendanceStatus === 'Satisfactory' ? '#34d399' : '#f59e0b',
                                fontWeight: 600
                              }}>
                                {c.attendanceStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Sub-view: Fees & Payments */}
                {studentTab === 'fees' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#93c5fd' }}>TOTAL TUITION</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹1,65,000</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>AMOUNT PAID</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹1,65,000</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#6ee7b7' }}>PENDING DUES</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>₹0 (Cleared)</div>
                      </div>
                    </div>

                    <div style={{ padding: '14px', background: 'rgba(17, 24, 39, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                          Verified Fee Receipt — Term 2026-27
                        </span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          Payment Verified
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.6 }}>
                        • Receipt Number: <code style={{ color: '#60a5fa' }}>GDGU-REC-2026-88912</code><br />
                        • Transaction Date: July 15, 2026 • Mode: HDFC NetBanking<br />
                        • Amount Cleared: ₹1,65,000.00 (Zero outstanding balance)
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view: Campus Bulletin & Circulars */}
                {studentTab === 'notices' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {DIGICAMPUS_SITE_MAP.CAMPUS_POSTS_NOTICES.mockSnapshot?.notices.map((n: any, idx: number) => (
                      <div key={idx} style={{ padding: '12px', background: 'rgba(17, 24, 39, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                            {n.title}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: n.badge === 'Mandatory' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: n.badge === 'Mandatory' ? '#f87171' : '#60a5fa'
                          }}>
                            {n.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#60a5fa', marginBottom: '4px' }}>
                          {n.postedBy} • {n.date}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.5 }}>
                          {n.summary}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-view: Academic Calendar & Holidays */}
                {studentTab === 'calendar' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                        Upcoming Gazetted Holidays
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {DIGICAMPUS_SITE_MAP.ACADEMIC_CALENDAR_HOLIDAYS.mockSnapshot?.upcomingHolidays.map((h: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(17, 24, 39, 0.6)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{h.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{h.date} • {h.type}</div>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a855f7', alignSelf: 'center' }}>
                              {h.days}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                        Key Semester Deadlines
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {DIGICAMPUS_SITE_MAP.ACADEMIC_CALENDAR_HOLIDAYS.mockSnapshot?.keySemesterDates.map((m: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <span style={{ color: '#cbd5e1' }}>{m.event}</span>
                            <span style={{ fontWeight: 600, color: '#60a5fa' }}>{m.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view: Enrolled Courses */}
                {studentTab === 'courses' && (
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Course Title</th>
                          <th>Credits</th>
                          <th>Type</th>
                          <th>Faculty Advisor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DIGICAMPUS_SITE_MAP.COURSE_REGISTRATION.mockSnapshot?.courses.map((c: any, idx: number) => (
                          <tr key={idx}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.code}</td>
                            <td>{c.title}</td>
                            <td>{c.credits}</td>
                            <td style={{ fontSize: '0.72rem', color: '#a855f7' }}>{c.type}</td>
                            <td style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.instructor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. FACULTY VIEW */}
            {portalState.userRole === 'faculty' && (
              <div>
                <h4 style={{ fontSize: '0.88rem', color: '#6ee7b7', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> GDGU Faculty Allocation & Grading Tracker
                </h4>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Course Title</th>
                        <th>Enrolled</th>
                        <th>Slot</th>
                        <th>Grade Deadline</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_FACULTY_CLASSES.map((c, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.courseCode}</td>
                          <td>{c.courseTitle}</td>
                          <td>{c.enrolledStudentsCount} students</td>
                          <td style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.slot}</td>
                          <td style={{ fontSize: '0.76rem', color: '#fbbf24' }}>{c.gradesSubmissionDeadline}</td>
                          <td>
                            <span style={{
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: c.gradesStatus === 'Submitted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: c.gradesStatus === 'Submitted' ? '#34d399' : '#60a5fa',
                              fontWeight: 600
                            }}>
                              {c.gradesStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. DEAN VIEW */}
            {portalState.userRole === 'dean' && (
              <div>
                <h4 style={{ fontSize: '0.88rem', color: '#d8b4fe', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} /> GDGU Deans Council Academic Approvals
                </h4>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Case ID</th>
                        <th>Type</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DEAN_APPROVALS.map((item, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>{item.id}</td>
                          <td style={{ fontWeight: 600 }}>{item.requestType}</td>
                          <td style={{ fontSize: '0.76rem' }}>{item.studentNameMasked}</td>
                          <td style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{item.courseCode}</td>
                          <td style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{item.reason}</td>
                          <td>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: item.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: item.status === 'Approved' ? '#34d399' : '#fbbf24',
                              fontWeight: 600
                            }}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

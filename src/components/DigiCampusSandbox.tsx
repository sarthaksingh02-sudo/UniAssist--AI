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
  FileText,
  Zap,
  Sparkles,
  Smartphone,
  Mail,
  Hash,
  ArrowRight,
  Activity,
  Wifi,
  Check,
  Shield
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
import { LivePortalBridge } from '../services/livePortalBridge';

interface DigiCampusSandboxProps {
  portalState: DigiCampusState;
  onStateChange: () => void;
}

type AuthMethodTab = 'TAB_SYNC' | 'ROLL_NO' | 'MOBILE' | 'EMAIL' | 'OFFICIAL_SSO';

export const DigiCampusSandbox: React.FC<DigiCampusSandboxProps> = ({
  portalState,
  onStateChange
}) => {
  const [studentTab, setStudentTab] = useState<'results' | 'attendance' | 'fees' | 'notices' | 'calendar' | 'courses'>('results');
  
  // Plaid-Style Gateway State
  const [authMethod, setAuthMethod] = useState<AuthMethodTab>('TAB_SYNC');
  const [loginRole, setLoginRole] = useState<UserRole>(portalState.userRole || 'student');
  const [identifierInput, setIdentifierInput] = useState('230160223096');
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

  // 1-Click Plaid-Style Zero-Trust Tab Sync Handshake
  const handleSyncActiveTab = async () => {
    setIsAuthenticating(true);
    setLoginMessage('Handshaking with active GDGU DigiCampus tab (https://gdgu.digiicampus.com/feed)...');

    try {
      const syncRes = await LivePortalBridge.syncActiveBrowserSession();
      if (syncRes.success) {
        PortalConnector.loginWithCredentials(
          syncRes.user.rollNumber,
          'student',
          syncRes.user.name
        );
        setLoginMessage('✅ Session verified with zero credentials typed!');
        setTimeout(() => {
          setIsAuthenticating(false);
          setLoginMessage(null);
          onStateChange();
        }, 400);
      }
    } catch {
      setIsAuthenticating(false);
      setLoginMessage(null);
    }
  };

  // Multi-Identifier Submission (Roll Number, Mobile No, Personal Email, or SSO)
  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifierInput.trim()) return;

    setIsAuthenticating(true);
    setLoginMessage(`Authenticating ${authMethod.replace('_', ' ')} with GDGU Identity Gateway...`);

    setTimeout(() => {
      PortalConnector.loginWithCredentials(
        identifierInput.trim(),
        loginRole,
        loginFullName.trim() || undefined
      );
      setIsAuthenticating(false);
      setLoginMessage(null);
      onStateChange();
    }, 550);
  };

  const handleQuickPersonaSelect = (role: UserRole) => {
    setLoginRole(role);
    if (role === 'student') {
      setIdentifierInput('230160223096');
      setLoginFullName('Sarthak Singh');
    } else if (role === 'faculty') {
      setIdentifierInput('GDGU-FAC-1042');
      setLoginFullName('Prof. Chandravilash Rai');
    } else if (role === 'dean') {
      setIdentifierInput('GDGU-DEAN-001');
      setLoginFullName('Prof. Anita Sen');
    }
  };

  const handleSignOut = () => {
    PortalConnector.disconnect();
    LivePortalBridge.disconnect();
    onStateChange();
  };

  return (
    <section className="portal-pane">
      {/* Neubrutalist Browser Bar with Live GDGU URL */}
      <div className="portal-browser-bar">
        <div className="browser-dots">
          <div className="dot red" />
          <div className="dot yellow" />
          <div className="dot green" />
        </div>
        <div className="url-bar">
          <Lock size={13} color="#16A34A" strokeWidth={2.4} />
          <span>
            {portalState.authStatus === 'DISCONNECTED' && 'https://gdgu.digiicampus.com/feed'}
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
          className="persona-chip-btn"
          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          onClick={() => {
            PortalConnector.setAuthStatus('CONNECTED_AUTHENTICATED');
            onStateChange();
          }}
          title="Reload Portal Tab"
        >
          <RefreshCw size={12} strokeWidth={2.4} />
        </button>
      </div>

      <div className="portal-content">
        {/* Test Bench Failure & Edge Case Simulator Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 14px',
          background: '#FFFFFF',
          border: '2px solid #000000',
          borderRadius: '8px',
          boxShadow: '2.5px 2.5px 0px #000000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 900, color: '#000000' }}>
              <ShieldAlert size={14} color="#D97706" strokeWidth={2.4} />
              <span>Session & Failure Testing Bar</span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 6px', background: 'var(--neo-yellow)', border: '1px solid #000', borderRadius: '4px' }}>
              Sandbox Controls
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              className={`persona-chip-btn ${portalState.authStatus === 'CONNECTED_AUTHENTICATED' ? 'active' : ''}`}
              style={{ background: portalState.authStatus === 'CONNECTED_AUTHENTICATED' ? 'var(--neo-mint)' : '#FFFFFF' }}
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              🟢 Connected
            </button>
            <button
              className="persona-chip-btn"
              onClick={() => handleSetAuth('SESSION_EXPIRED')}
            >
              🟡 Expire Session
            </button>
            <button
              className="persona-chip-btn"
              onClick={() => handleSetAuth('MFA_CHALLENGE')}
            >
              🔒 Trigger MFA
            </button>
            <button
              className="persona-chip-btn"
              onClick={handleSignOut}
            >
              ⚪ Disconnect
            </button>
            <button
              className="persona-chip-btn"
              onClick={() => handleSetLayout(portalState.layoutVersion === 'results-v2-unknown' ? 'results-v1' : 'results-v2-unknown')}
            >
              ⚠️ Test Fail-Closed
            </button>
          </div>
        </div>

        {/* ======================================================================
            DISCONNECTED STATE: PLAID-STYLE ZERO-TRUST GATEWAY
           ====================================================================== */}
        {portalState.authStatus === 'DISCONNECTED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Plaid-Style "Detected Active Tab" Hero Card */}
            <div className="portal-companion-banner">
              <div className="companion-banner-header">
                <div className="companion-tab-info">
                  <div className="companion-pulse-dot" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={15} strokeWidth={2.4} />
                      <span>Active Browser Session Detected</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#4B5563' }}>
                      gdgu.digiicampus.com/feed
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="companion-sync-btn"
                  onClick={handleSyncActiveTab}
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} strokeWidth={2.6} />
                      <span>Sync Active Tab (1-Click)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cross-Section Background Resilience Explainer */}
              <div className="cross-section-callout">
                <Sparkles size={16} color="#000000" strokeWidth={2.4} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Cross-Section Background Sync:</strong> Even if your active tab is sitting on <code>/feed</code> or <code>/calendar</code>, UniAssist AI extracts your exam results and attendance in the background via session token without disrupting your current screen!
                </div>
              </div>
            </div>

            {/* 2. Unified GDGU Multi-Identifier Login Card */}
            <div className="enterprise-gateway-card">
              <div className="gateway-header">
                <span className="gateway-crest-pill">
                  NAAC GRADE A+ ACCREDITED · GD GOENKA UNIVERSITY
                </span>
                <h3 className="gateway-title">
                  DigiCampus Enterprise Gateway
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 600, maxWidth: '440px', lineHeight: 1.45 }}>
                  Sign in with any GDGU credential format. UniAssist AI operates with Zero Credential Retention.
                </p>
              </div>

              {/* Identifier Format Switcher */}
              <div className="identifier-method-tabs">
                <button
                  type="button"
                  className={`identifier-tab-btn ${authMethod === 'ROLL_NO' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMethod('ROLL_NO');
                    setIdentifierInput('230160223096');
                  }}
                >
                  <Hash size={13} strokeWidth={2.4} />
                  <span>Roll / Reg No</span>
                </button>
                <button
                  type="button"
                  className={`identifier-tab-btn ${authMethod === 'MOBILE' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMethod('MOBILE');
                    setIdentifierInput('+91 98102 34567');
                  }}
                >
                  <Smartphone size={13} strokeWidth={2.4} />
                  <span>Mobile OTP</span>
                </button>
                <button
                  type="button"
                  className={`identifier-tab-btn ${authMethod === 'EMAIL' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMethod('EMAIL');
                    setIdentifierInput('sarthak.singh@gmail.com');
                  }}
                >
                  <Mail size={13} strokeWidth={2.4} />
                  <span>Personal Email</span>
                </button>
                <button
                  type="button"
                  className={`identifier-tab-btn ${authMethod === 'OFFICIAL_SSO' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMethod('OFFICIAL_SSO');
                    setIdentifierInput('sarthak.230160223096@gdgu.org');
                  }}
                >
                  <ShieldCheck size={13} strokeWidth={2.4} />
                  <span>@gdgu.org SSO</span>
                </button>
              </div>

              {/* Gateway Form */}
              <form onSubmit={handleIdentifierSubmit} className="gateway-form">
                <div className="gateway-input-group">
                  <label className="gateway-label">
                    {authMethod === 'ROLL_NO' && 'University Registration / Roll Number *'}
                    {authMethod === 'MOBILE' && 'Registered Mobile Number *'}
                    {authMethod === 'EMAIL' && 'Personal / Registered Email Address *'}
                    {authMethod === 'OFFICIAL_SSO' && 'GDGU Institutional Email (@gdgu.org) *'}
                  </label>
                  <input
                    type="text"
                    className="gateway-input"
                    value={identifierInput}
                    onChange={e => setIdentifierInput(e.target.value)}
                    placeholder={
                      authMethod === 'ROLL_NO' ? 'e.g. 230160223096' :
                      authMethod === 'MOBILE' ? 'e.g. +91 9876543210' :
                      authMethod === 'EMAIL' ? 'e.g. yourname@gmail.com' :
                      'e.g. rollnumber@gdgu.org'
                    }
                    required
                  />
                </div>

                <div className="gateway-input-group">
                  <label className="gateway-label">
                    {authMethod === 'MOBILE' ? 'SMS One-Time Password (OTP) *' : 'DigiCampus Password *'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="gateway-input"
                      style={{ paddingRight: '40px' }}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder={authMethod === 'MOBILE' ? 'Enter 6-digit OTP' : 'Enter password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#000000',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={2.4} /> : <Eye size={16} strokeWidth={2.4} />}
                    </button>
                  </div>
                </div>

                {loginMessage && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'var(--neo-mint-light)',
                    border: '1.5px solid #000',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#000'
                  }}>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{loginMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="gateway-submit-btn"
                  disabled={isAuthenticating}
                >
                  <LogIn size={16} strokeWidth={2.6} />
                  <span>
                    Sign In to DigiCampus ({loginRole.toUpperCase()})
                  </span>
                </button>
              </form>

              {/* Quick Persona Fill */}
              <div className="persona-presets-box">
                <span className="persona-presets-title">Quick Test Personas (1-Click Fill)</span>
                <div className="persona-buttons-row">
                  <button
                    type="button"
                    className="persona-chip-btn"
                    onClick={() => handleQuickPersonaSelect('student')}
                  >
                    🎓 Sarthak (Student)
                  </button>
                  <button
                    type="button"
                    className="persona-chip-btn"
                    onClick={() => handleQuickPersonaSelect('faculty')}
                  >
                    👨‍🏫 Prof. Rai (Faculty)
                  </button>
                  <button
                    type="button"
                    className="persona-chip-btn"
                    onClick={() => handleQuickPersonaSelect('dean')}
                  >
                    🏛️ Prof. Sen (Dean)
                  </button>
                </div>
              </div>

              {/* Telemetry & Compliance Strip */}
              <div className="telemetry-trust-strip">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#16A34A" strokeWidth={2.5} />
                  <span>Zero-Credential Protocol</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wifi size={14} color="#000" strokeWidth={2.4} />
                  <span>Ping: 24ms (TLS 1.3)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            SESSION EXPIRED STATE (NEUBRUTALIST RECOVERY)
           ====================================================================== */}
        {portalState.authStatus === 'SESSION_EXPIRED' && (
          <div style={{
            margin: '20px auto',
            textAlign: 'center',
            padding: '28px 24px',
            background: 'var(--neo-yellow-light)',
            borderRadius: '12px',
            border: '2.5px solid #000000',
            boxShadow: '5px 5px 0px #000000',
            maxWidth: '440px'
          }}>
            <AlertTriangle size={44} color="#D97706" strokeWidth={2.4} style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: '8px' }}>
              DigiCampus Session Timed Out
            </h3>
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '18px', lineHeight: 1.5 }}>
              Your GD Goenka University session token has expired. Re-authenticate in 1 click to resume AI assistance without losing conversation context.
            </p>
            <button
              className="companion-sync-btn"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              <Zap size={16} strokeWidth={2.6} />
              <span>Renew Session (1-Click)</span>
            </button>
          </div>
        )}

        {/* ======================================================================
            MFA CHALLENGE STATE (NEUBRUTALIST OTP MODAL)
           ====================================================================== */}
        {portalState.authStatus === 'MFA_CHALLENGE' && (
          <div style={{
            margin: '20px auto',
            textAlign: 'center',
            padding: '28px 24px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '2.5px solid #000000',
            boxShadow: '5px 5px 0px #000000',
            maxWidth: '440px'
          }}>
            <KeyRound size={44} color="#000000" strokeWidth={2.4} style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: '8px' }}>
              Two-Factor Authentication Required
            </h3>
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '18px', lineHeight: 1.5 }}>
              GDGU security has issued an MFA challenge. Complete OTP verification to restore automated reading.
            </p>
            <button
              className="companion-sync-btn"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => handleSetAuth('CONNECTED_AUTHENTICATED')}
            >
              <CheckCircle2 size={16} strokeWidth={2.6} />
              <span>Complete Verification</span>
            </button>
          </div>
        )}

        {/* ======================================================================
            UNKNOWN LAYOUT FAIL-CLOSED STATE
           ====================================================================== */}
        {portalState.authStatus === 'UNKNOWN_LAYOUT' && (
          <div style={{
            margin: '20px auto',
            textAlign: 'center',
            padding: '28px 24px',
            background: 'var(--neo-coral-light)',
            borderRadius: '12px',
            border: '2.5px solid #000000',
            boxShadow: '5px 5px 0px #000000',
            maxWidth: '440px'
          }}>
            <LayoutTemplate size={44} color="#DC2626" strokeWidth={2.4} style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: '#000000', marginBottom: '8px' }}>
              Unrecognized DigiCampus Layout
            </h3>
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '18px', lineHeight: 1.5 }}>
              GDGU updated the portal DOM schema. Failing closed in compliance with FR-09 to prevent incorrect record extraction.
            </p>
            <button
              className="persona-chip-btn"
              style={{ padding: '8px 16px', background: '#FFFFFF' }}
              onClick={() => handleSetLayout('results-v1')}
            >
              Restore Standard Schema (results-v1)
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

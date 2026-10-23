import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { DigiCampusSandbox } from './components/DigiCampusSandbox';
import { EvaluationModal } from './components/EvaluationModal';
import { AuditLogsModal } from './components/AuditLogsModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { SiteMapModal } from './components/SiteMapModal';
import { SettingsModal } from './components/SettingsModal';
import { PortalConnector } from './services/portalConnector';
import { AnswerComposer } from './services/answerComposer';
import { LLMService } from './services/llmService';
import { ChatMessage, ChatSession, DigiCampusState, PolicyDocument, UserRole } from './types';
import { MOCK_USER_PROFILES } from './data/mockPortalData';

const INITIAL_GREETING: ChatMessage = {
  id: 'MSG-INIT-01',
  sender: 'assistant',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  text: `👋 **Welcome to UniAssist AI!**\n\nI am your intelligent university assistant designed with two deliberately separated paths:\n\n1. 📖 **Campus Knowledge:** Inquire about official university policies (attendance rules, grading criteria, withdrawal deadlines, hostel guidelines, faculty rules) with verifiable citations.\n2. 📊 **DigiCampus Companion:** Multi-role support for **Students** (marks, enrolled courses, attendance), **Faculty** (teaching assignments, grading deadlines), and **Deans** (condonation queue) in strictly read-only mode.\n\n*Select a starter prompt below or type your inquiry to get started!*`
};

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: 'sess-today-1',
    title: 'Odd Term Results & Attendance',
    role: 'student',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    messages: [INITIAL_GREETING]
  },
  {
    id: 'sess-past-1',
    title: 'Attendance Condonation Policy',
    role: 'student',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: 'MSG-PAST-01',
        sender: 'user',
        timestamp: 'Yesterday 14:20',
        text: 'What are the attendance condonation guidelines and medical limits?'
      },
      {
        id: 'MSG-PAST-02',
        sender: 'assistant',
        timestamp: 'Yesterday 14:20',
        text: 'Based on **Academic Regulations: Attendance & Examination Code** (Section 3.2, Effective: 2024-07-01):\n\nStudents must maintain a minimum of 75% attendance in each registered course to be eligible to sit for End-Semester Examinations.\n\n• **Medical Condonation:** A student who has attended at least 65% of classes may apply for condonation of up to 10% on valid medical grounds, certified by the University Medical Officer.\n• **Dean Discretion:** Cases between 60% and 65% on severe medical grounds or approved sports/technical representation require explicit Dean Council approval.'
      }
    ]
  },
  {
    id: 'sess-past-2',
    title: 'Hostel Gate Curfews & Rules',
    role: 'student',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    messages: [
      {
        id: 'MSG-PAST-03',
        sender: 'user',
        timestamp: '3 days ago',
        text: 'What time do campus hostel gates close?'
      },
      {
        id: 'MSG-PAST-04',
        sender: 'assistant',
        timestamp: '3 days ago',
        text: 'Based on **Hostel Administration & Student Code of Conduct** (Section 5.2, Effective: 2024-07-01):\n\nHostel entry gates close strictly at **10:00 PM on weekdays** and **10:30 PM on weekends**.\n\nLate entry requires prior written approval from the Chief Warden. Any unauthorized entry past 11:00 PM incurs an automatic parent notification and a disciplinary review.'
      }
    ]
  }
];

export function App() {
  const [portalState, setPortalState] = useState<DigiCampusState>(PortalConnector.getState());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Chat sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('uniassist_chat_sessions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'sess-today-1';
  });

  // Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('uniassist_chat_sessions', JSON.stringify(sessions));
    } catch {
      // Storage unavailable
    }
  }, [sessions]);

  // Sync portalState
  useEffect(() => {
    const unsubscribe = PortalConnector.subscribe(newState => {
      setPortalState(newState);
    });
    return () => unsubscribe();
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || {
    id: 'sess-today-1',
    title: 'New Conversation',
    role: portalState.userRole,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [INITIAL_GREETING]
  };

  const handleRoleChange = (role: UserRole) => {
    PortalConnector.setUserRole(role);
    const profile = MOCK_USER_PROFILES[role];
    const roleNotice: ChatMessage = {
      id: 'MSG-ROLE-' + Math.random().toString(36).substring(2, 7),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `🔄 **Active Role Switched to: ${role.toUpperCase()} (${profile.nameMasked})**\n\nDigiCampus portal connection refreshed for **${profile.departmentOrProgram}**.`
    };

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            role,
            updatedAt: Date.now(),
            messages: [...s.messages, roleNotice]
          };
        }
        return s;
      })
    );
  };

  const handleNewChat = () => {
    const newId = 'sess-' + Math.random().toString(36).substring(2, 9);
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      role: portalState.userRole,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [INITIAL_GREETING]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: 'sess-' + Math.random().toString(36).substring(2, 9),
          title: 'New Conversation',
          role: portalState.userRole,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [INITIAL_GREETING]
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearCurrentChat = () => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [INITIAL_GREETING]
          };
        }
        return s;
      })
    );
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'USER-' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    // Update session title if it is default
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          const isDefaultTitle = s.title === 'New Conversation' || s.title === 'New Chat';
          const newTitle = isDefaultTitle ? (text.length > 32 ? text.slice(0, 32) + '...' : text) : s.title;
          return {
            ...s,
            title: newTitle,
            updatedAt: Date.now(),
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );

    setIsProcessing(true);

    try {
      await new Promise(res => setTimeout(res, 350));
      const baseResponse = await AnswerComposer.processQuery(text);
      // Enrich with Cloud LLM if user has configured an API Key
      const finalResponse = await LLMService.enrichWithCloudLLM(text, baseResponse);

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, finalResponse]
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'ERR-' + Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'An unexpected processing error occurred. Please try again.',
        isError: true
      };
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, errorMsg]
            };
          }
          return s;
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'OPEN_PORTAL_LOGIN' || action === 'RE_LOGIN') {
      setIsSplitView(true); // Open the portal panel so user can perform 1-Click Sync or login
    } else if (action === 'VIEW_IN_PORTAL') {
      setIsSplitView(true);
      if (portalState.userRole === 'faculty') {
        PortalConnector.setSection('faculty_classes');
      } else if (portalState.userRole === 'dean') {
        PortalConnector.setSection('dean_approvals');
      } else {
        PortalConnector.setSection('results');
      }
    }
  };

  const handleDocumentAdded = (doc: PolicyDocument) => {
    const notice: ChatMessage = {
      id: 'MSG-DOC-' + Math.random().toString(36).substring(2, 7),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `📄 **New Policy Ingested & Indexed:**\n\n**${doc.title}** (${doc.section}, Effective: ${doc.effectiveDate})\n\nUniAssist AI can now cite this document in answers.`
    };
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, notice]
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="chatbot-app-layout">
      {/* Collapsible Modern Chatbot Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        portalState={portalState}
        onRoleChange={handleRoleChange}
        isSplitView={isSplitView}
        onToggleSplitView={() => setIsSplitView(!isSplitView)}
        onOpenSitemapModal={() => setIsSitemapOpen(true)}
        onOpenDocUpload={() => setIsDocUploadOpen(true)}
        onOpenEvaluation={() => setIsEvaluationOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onOpenPrivacyNotice={() => setIsPrivacyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className={`chatbot-main-workspace ${isSplitView ? 'split-mode' : 'single-mode'}`}>
        <ChatPanel
          messages={activeSession.messages}
          isProcessing={isProcessing}
          activeRole={portalState.userRole}
          onSendMessage={handleSendMessage}
          onActionClick={handleActionClick}
          onOpenSitemapModal={() => setIsSitemapOpen(true)}
          sessionTitle={activeSession.title}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          isSplitView={isSplitView}
          onToggleSplitView={() => setIsSplitView(!isSplitView)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onClearCurrentChat={handleClearCurrentChat}
        />

        {/* Live DigiCampus Sandbox in Split Mode */}
        {isSplitView && (
          <aside className="portal-sandbox-split-pane">
            <DigiCampusSandbox
              portalState={portalState}
              onStateChange={() => setPortalState(PortalConnector.getState())}
            />
          </aside>
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {}}
      />

      <SiteMapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onSelectSegment={handleSendMessage}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <EvaluationModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
      />

      <AuditLogsModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      <DocumentUploadModal
        isOpen={isDocUploadOpen}
        onClose={() => setIsDocUploadOpen(false)}
        onDocumentAdded={handleDocumentAdded}
      />
    </div>
  );
}

export default App;

export type UserRole = 'student' | 'faculty' | 'dean';

export type IntentCategory = 'CAMPUS_KB' | 'PORTAL_PERSONAL' | 'MIXED' | 'UNSUPPORTED';

export interface IntentClassification {
  category: IntentCategory;
  confidence: number;
  reasoning: string;
  subIntents?: {
    campusQuery?: string;
    portalQuery?: string;
  };
  targetSection?: 'results' | 'courses' | 'attendance' | 'fees' | 'notices' | 'calendar' | 'hostel' | 'faculty_classes' | 'dean_approvals';
}

export interface PolicyDocument {
  id: string;
  title: string;
  owner: string;
  category: 'Academics' | 'Examinations' | 'Attendance' | 'Hostel & Campus' | 'Financial & Fees' | 'Faculty & Staff' | 'Administrative';
  effectiveDate: string;
  lastReviewedDate: string;
  section: string;
  content: string;
  summary: string;
  keywords: string[];
  isCustomUploaded?: boolean;
}

export interface KnowledgeChunk {
  documentId: string;
  documentTitle: string;
  owner: string;
  section: string;
  effectiveDate: string;
  lastReviewedDate: string;
  text: string;
  score?: number;
}

export interface RetrievalResult {
  query: string;
  chunks: KnowledgeChunk[];
  confidence: number;
  abstained: boolean;
  abstentionReason?: string;
}

export interface CourseMark {
  courseCode: string;
  courseTitle: string;
  credits: number;
  internalMarks: number;
  maxInternal: number;
  endTermMarks: number;
  maxEndTerm: number;
  totalMarks: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Pending';
}

export interface EnrolledCourseItem {
  courseCode: string;
  courseTitle: string;
  credits: number;
  instructor: string;
  slot: string;
  room: string;
  totalClassesHeld: number;
  classesAttended: number;
  attendancePercentage: number;
  attendanceStatus: 'Satisfactory' | 'Condonation Needed' | 'Shortage Alert';
}

export interface FacultyClassItem {
  courseCode: string;
  courseTitle: string;
  enrolledStudentsCount: number;
  semester: string;
  slot: string;
  gradesSubmissionDeadline: string;
  gradesStatus: 'Submitted' | 'Draft' | 'Pending Approval' | 'In Progress';
}

export interface DeanApprovalItem {
  id: string;
  studentIdMasked: string;
  studentNameMasked: string;
  requestType: 'Medical Condonation' | 'Late Course Withdrawal' | 'Grade Moderation' | 'Duty Leave / Event Condonation' | string;
  courseCode: string;
  reason: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  submissionDate: string;
}

export interface SemesterResult {
  period: string;
  academicYear: string;
  program: string;
  sgpa: number;
  cgpa: number;
  totalCreditsEarned: number;
  publishedDate: string;
  courses: CourseMark[];
  remarks?: string;
}

export interface PortalUserProfile {
  role: UserRole;
  identifierMasked: string; // "STU-2023-****" or "FAC-1042-****" or "DEAN-001-****"
  nameMasked: string;
  departmentOrProgram: string;
  currentSemesterOrTitle: string;
  enrollmentOrStatus: string;
}

export type PortalAuthStatus = 
  | 'DISCONNECTED'
  | 'CONNECTED_AUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'MFA_CHALLENGE'
  | 'UNKNOWN_LAYOUT'
  | 'NO_RECORDS_PUBLISHED';

export interface DigiCampusState {
  authStatus: PortalAuthStatus;
  userRole: UserRole;
  currentSection: 'dashboard' | 'results' | 'courses' | 'attendance' | 'fees' | 'notices' | 'calendar' | 'hostel' | 'faculty_classes' | 'dean_approvals' | 'unsupported_page';
  selectedPeriod: string;
  activeAccountMasked?: string;
  lastActiveTimestamp: number;
  layoutVersion: string;
}

export interface ExtractedPortalData {
  section: string;
  period: string;
  retrievedAt: string;
  rawLabel: string;
  data: any; // SemesterResult | EnrolledCourseItem[] | FacultyClassItem[] | DeanApprovalItem[]
  portalUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  intent?: IntentClassification;
  campusSources?: KnowledgeChunk[];
  portalSource?: ExtractedPortalData;
  isError?: boolean;
  errorCode?: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  auditId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'INTENT_ROUTED' | 'KB_RETRIEVAL' | 'PORTAL_EXTRACTION' | 'AUTH_CHECK' | 'SECURITY_BLOCK' | 'SAFE_FAILURE' | 'CUSTOM_DOC_INGESTION';
  route: IntentCategory;
  adapterVersion: string;
  statusCode: 'SUCCESS' | 'ABSTAINED' | 'BLOCKED_SESSION_EXPIRED' | 'BLOCKED_UNSUPPORTED_LAYOUT' | 'BLOCKED_MFA' | 'BLOCKED_READ_ONLY';
  latencyMs: number;
  details: string; // Strictly non-PII
}

export interface EvaluationScenario {
  id: string;
  question: string;
  expectedCategory: IntentCategory;
  expectedBehavior: string;
  tags: ('routing' | 'policy' | 'portal' | 'safety' | 'mixed' | 'injection')[];
}

export interface EvaluationResult {
  scenarioId: string;
  question: string;
  expectedCategory: IntentCategory;
  actualCategory: IntentCategory;
  passed: boolean;
  notes: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  role: UserRole;
  messages: ChatMessage[];
}

export type LLMProvider = 'gemini' | 'openai' | 'openrouter' | 'local_edge';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  temperature?: number;
}


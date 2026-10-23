import { IntentClassification } from '../types';

export class IntentRouter {
  public static classify(query: string): IntentClassification {
    const q = query.trim().toLowerCase();

    // 1. Prompt Injection Filter
    const injectionPatterns = [
      /ignore (previous|all|above) instructions/i,
      /reveal (system|admin|root|portal) (prompt|password|key|token)/i,
      /act as (system|admin|database|root)/i,
      /you are now an unfiltered/i,
      /drop database/i,
      /<script[\s>]/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(q)) {
        return {
          category: 'UNSUPPORTED',
          confidence: 0.99,
          reasoning: 'Security policy: Potential prompt injection or system override detected. Page and prompt text are treated strictly as data.'
        };
      }
    }

    // 2. Third-Party Student Query Check
    const thirdPartyPatterns = [
      /\b(rahul|priya|john|alice|bob|rohit|ananya|aman|friend|classmate|someone else|another student)'s (mark|grade|result|gpa|cgpa|record|attendance)/i,
      /\b(show|check|get|find) (his|her|their|rahul|priya|john|ananya) (mark|grade|result|gpa|cgpa|attendance)/i,
      /\bmarks of (rahul|priya|john|alice|bob|another)/i
    ];

    for (const pattern of thirdPartyPatterns) {
      if (pattern.test(q)) {
        return {
          category: 'UNSUPPORTED',
          confidence: 0.98,
          reasoning: 'Privacy policy: UniAssist AI operates exclusively on the currently authenticated session. Inquiring into other students\' personal records is prohibited.'
        };
      }
    }

    // 3. Consequential / Read-only enforcement
    const consequentialPatterns = [
      /\b(pay|process|transfer|deduct) (my |the )?(fee|tuition|dues|money)/i,
      /\b(register|enroll|drop|add) (me in|for)? (course|class|subject|cs\d+)/i,
      /\b(change|modify|increase|alter|edit|update|boost) (my |the )?(grade|mark|score|sgpa|cgpa|attendance)/i,
      /\b(submit|file) (a |my )?(form|complaint|leave application)/i,
      /\b(change|edit) (my |the )?(password|profile|email|phone)/i
    ];

    for (const pattern of consequentialPatterns) {
      if (pattern.test(q)) {
        return {
          category: 'UNSUPPORTED',
          confidence: 0.97,
          reasoning: 'Phase 1 boundary: UniAssist AI is strictly read-only. Consequential actions such as fee payments, course registrations, or grade alterations must be executed directly on DigiCampus.'
        };
      }
    }

    // 4. Role-Specific Personal Portal Indicators
    // 4a. Attendance & Enrolled Courses
    const attendanceKeywords = [
      'my attendance', 'attendance percentage', 'shortage in attendance', 'am i short',
      'how many classes did i miss', 'classes attended', 'attendance status',
      // Natural-language daily attendance patterns
      'was i present', 'was i absent', 'am i present', 'am i absent',
      'marked present', 'marked absent', 'attendance today', 'today\'s attendance',
      'did i attend', 'which classes did i attend', 'classes today', 'today classes',
      'today\'s classes', 'today\'s schedule', 'present today', 'absent today',
      'attendance in all lectures', 'in all lectures', 'lectures today',
      'today lecture', 'how many lectures', 'all my classes today',
      'show attendance', 'check attendance', 'view attendance'
    ];
    const coursesKeywords = [
      'enrolled course', 'enrolled courses', 'my courses', 'my subjects',
      'what classes am i taking', 'registered courses', 'my timetable', 'my schedule'
    ];

    // 4b. Faculty Portal Queries
    const facultyKeywords = [
      'classes am i teaching', 'my teaching schedule', 'my students count',
      'grade submission deadline', 'my assigned classes', 'grade entry status'
    ];

    // 4c. Dean Portal Queries
    const deanKeywords = [
      'pending condonation', 'condonation requests', 'moderation queue',
      'pending approvals', 'dean approval queue', 'students requesting condonation'
    ];

    // 4d. Student Marks & Classroom Assessment Queries
    const marksKeywords = [
      'my mark', 'my marks', 'my grade', 'my grades', 'my score', 'my scores',
      'my result', 'my results', 'my sgpa', 'my cgpa', 'my gpa',
      'how did i do', 'what did i get', 'latest semester marks', 'semester 5 marks',
      'fall 2025 marks', 'spring 2025 marks', 'show my marks', 'check my marks',
      'display my results', 'did i pass my courses'
    ];

    const assessmentKeywords = [
      'assessment', 'assesment', 'assessments', 'check assessment', 'check assesment',
      'mse', 'mid term', 'mid sem', 'midterm', 'midsem', 'continuous evaluation',
      'internal assessment', 'internal marks', 'quiz marks', 'assignment marks',
      'how much did i get', 'how much marks', 'marks in application', 'marks in ml',
      'marks in quantum', 'marks in iot'
    ];

    // 4e. Fee & Ledger Queries (Read-only status check)
    const feesKeywords = [
      'fee status', 'fee ledger', 'my fees', 'fee receipt', 'pending dues', 'pending balance',
      'tuition receipt', 'fee paid', 'check fees', 'fee challan', 'have i paid my fee'
    ];

    // 4f. Campus Bulletin & Posts
    const noticesKeywords = [
      'latest post', 'latest posts', 'recent circular', 'circulars', 'university notices',
      'campus bulletin', 'announcements from uni', 'what did university post', 'latest notices'
    ];

    // 4g. Academic Calendar & Holidays
    const calendarKeywords = [
      'holidays', 'holiday list', 'diwali break', 'winter vacation', 'academic calendar',
      'semester dates', 'when do exams start', 'reopening date', 'exam schedule dates'
    ];

    // 4h. Hostel Facilities
    const hostelKeywords = [
      'my hostel', 'room allotment', 'hostel room', 'mess menu', 'outpass status', 'warden contact'
    ];

    const isAttendanceQuery = attendanceKeywords.some(kw => q.includes(kw));
    const isCoursesQuery = coursesKeywords.some(kw => q.includes(kw));
    const isFacultyQuery = facultyKeywords.some(kw => q.includes(kw));
    const isDeanQuery = deanKeywords.some(kw => q.includes(kw));
    const isFeesQuery = feesKeywords.some(kw => q.includes(kw));
    const isNoticesQuery = noticesKeywords.some(kw => q.includes(kw));
    const isCalendarQuery = calendarKeywords.some(kw => q.includes(kw));
    const isHostelQuery = hostelKeywords.some(kw => q.includes(kw));
    const isAssessmentQuery = assessmentKeywords.some(kw => q.includes(kw)) ||
      (/\b(how much|what|score|marks?)\b/.test(q) && /\b(get|got|score|scored|assessment|assesment|mse|midsem)\b/.test(q)) ||
      (q.includes('application') && (q.includes('mark') || q.includes('score') || q.includes('get') || q.includes('assesment') || q.includes('assessment')));
    const isMarksQuery = marksKeywords.some(kw => q.includes(kw)) ||
      (/\b(my|i)\b/.test(q) && /\b(marks?|grades?|results?|sgpa|cgpa)\b/.test(q));

    const hasPortalIntent = isAttendanceQuery || isCoursesQuery || isFacultyQuery || isDeanQuery || isMarksQuery || isAssessmentQuery || isFeesQuery || isNoticesQuery || isCalendarQuery || isHostelQuery;

    // 5. Campus Knowledge Base Indicators
    const campusKbKeywords = [
      'withdrawal', 'withdraw', 'drop', 'course drop', 'due date', 'deadline',
      'pass rule', 'passing criteria', 'passing standard', 'minimum pass',
      'grading scale', 'grading system', 'attendance', 'condonation', 'hall ticket',
      '75%', 'medical leave', 'supplementary', 'backlog', 're-evaluation', 'reevaluation',
      'retotalling', 'late fee penalty', 'curfew', 'gate outpass', 'hostel gate', 'hostel gates',
      'gates close', 'hostel timing', 'hostel rules', 'hostel regulation',
      'policy', 'regulation', 'dean', 'coe', 'criteria', 'rules',
      'faculty deadline', 'upload attendance deadline'
    ];

    const hasCampusIntent = campusKbKeywords.some(keyword => q.includes(keyword)) ||
      (/\b(rule|policy|criteria|deadline|due date|procedure|regulations?|guidelines?)\b/.test(q) && !isFeesQuery && !isNoticesQuery && !isAssessmentQuery);

    // 6. Mixed Request: Both personal portal retrieval AND campus KB
    if (hasPortalIntent && hasCampusIntent) {
      let targetSection: IntentClassification['targetSection'] = 'results';
      if (isAssessmentQuery) targetSection = 'assessments';
      else if (isAttendanceQuery || isCoursesQuery) targetSection = 'courses';
      else if (isFacultyQuery) targetSection = 'faculty_classes';
      else if (isDeanQuery) targetSection = 'dean_approvals';
      else if (isFeesQuery) targetSection = 'fees';
      else if (isNoticesQuery) targetSection = 'notices';
      else if (isCalendarQuery) targetSection = 'calendar';
      else if (isHostelQuery) targetSection = 'hostel';

      return {
        category: 'MIXED',
        confidence: 0.95,
        reasoning: 'Mixed query detected: Combines personal portal records retrieval with university academic policy rules.',
        subIntents: {
          campusQuery: query,
          portalQuery: query
        },
        targetSection
      };
    }

    // 7. Personal Portal Request
    if (hasPortalIntent) {
      let targetSection: IntentClassification['targetSection'] = 'results';
      let reasoning = 'Personal student record query: Directed to the authenticated DigiCampus portal adapter.';

      if (isAssessmentQuery) {
        targetSection = 'assessments';
        reasoning = 'Classroom continuous assessment inquiry: Routed to DigiCampus Classroom Assessment Results (#/classroom/student/assessmentResults).';
      } else if (isAttendanceQuery) {
        targetSection = 'attendance';
        reasoning = 'Personal attendance inquiry: Routed to DigiCampus Course & Attendance adapter.';
      } else if (isCoursesQuery) {
        targetSection = 'courses';
        reasoning = 'Enrolled courses inquiry: Routed to DigiCampus Course Registration adapter.';
      } else if (isFacultyQuery) {
        targetSection = 'faculty_classes';
        reasoning = 'Faculty portal inquiry: Routed to DigiCampus Faculty Teaching adapter.';
      } else if (isDeanQuery) {
        targetSection = 'dean_approvals';
        reasoning = 'Dean administrative inquiry: Routed to DigiCampus Deans Council Queue adapter.';
      } else if (isFeesQuery) {
        targetSection = 'fees';
        reasoning = 'Fee ledger inquiry: Targeted to DigiCampus Fee Management segment (#/feeManagement/studentFeeLedger).';
      } else if (isNoticesQuery) {
        targetSection = 'notices';
        reasoning = 'Campus notices inquiry: Targeted to DigiCampus Community Bulletin segment (#/community/feed).';
      } else if (isCalendarQuery) {
        targetSection = 'calendar';
        reasoning = 'Academic calendar inquiry: Targeted to DigiCampus Academic Calendar segment (#/academicCalendar/events).';
      } else if (isHostelQuery) {
        targetSection = 'hostel';
        reasoning = 'Residential life inquiry: Targeted to DigiCampus Hostel Management segment (#/hostelManagement/studentHostel).';
      }

      return {
        category: 'PORTAL_PERSONAL',
        confidence: 0.96,
        reasoning,
        targetSection
      };
    }

    // 8. Campus Policy Request
    if (hasCampusIntent || q.includes('when') || q.includes('what is the') || q.includes('how to')) {
      return {
        category: 'CAMPUS_KB',
        confidence: 0.94,
        reasoning: 'Campus Knowledge inquiry: Routed to local university policy collection with traceable citations.'
      };
    }

    // 9. Generic / Ambiguous / Unsupported
    return {
      category: 'UNSUPPORTED',
      confidence: 0.65,
      reasoning: 'Ambiguous or unsupported request. UniAssist AI Phase 1 supports campus policy FAQs, marks, courses, and attendance.'
    };
  }
}

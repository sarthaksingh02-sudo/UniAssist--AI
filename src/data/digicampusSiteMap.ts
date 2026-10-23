/**
 * DigiCampus Site Map & Domain Segment Registry
 * 
 * Defines the authoritative navigation sitemap for GD Goenka University DigiCampus (gdgu.digiicampus.com).
 * Prevents over-scraping, reduces token overhead, and guarantees minimal-footprint retrieval
 * by pinpointing the exact URL segment, route pattern, and minimal fields for every student inquiry.
 */

export type PortalSegmentId =
  | 'EXAMINATIONS'
  | 'ATTENDANCE_TIMETABLE'
  | 'FEES_PAYMENTS'
  | 'COURSE_REGISTRATION'
  | 'CAMPUS_POSTS_NOTICES'
  | 'ACADEMIC_CALENDAR_HOLIDAYS'
  | 'HOSTEL_FACILITIES'
  | 'FACULTY_PORTAL'
  | 'DEAN_COUNCIL';

export interface PortalSegmentDefinition {
  id: PortalSegmentId;
  name: string;
  icon: string;
  category: 'Academics' | 'Administrative' | 'Campus Life' | 'Financial';
  description: string;
  hashRoutePattern: string;
  directPortalUrl: string;
  targetSelectors: string[];
  minimalFields: string[];
  sampleTriggers: string[];
  mockSnapshot?: any;
}

export const DIGICAMPUS_SITE_MAP: Record<PortalSegmentId, PortalSegmentDefinition> = {
  EXAMINATIONS: {
    id: 'EXAMINATIONS',
    name: 'Examination Results & Grades',
    icon: 'Award',
    category: 'Academics',
    description: 'Semester grade sheets, subject marks, credit breakdown, SGPA, CGPA, and re-evaluation records.',
    hashRoutePattern: '#/examinationManagement/studentExamRecords/:studentId',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/examinationManagement/studentExamRecords/674656',
    targetSelectors: ['table.table', '.grade-card', 'div:has(SGPA)', '.result-row'],
    minimalFields: ['period', 'sgpa', 'cgpa', 'totalCreditsEarned', 'courses'],
    sampleTriggers: [
      'marks', 'grades', 'result', 'results', 'sgpa', 'cgpa', 'gpa',
      'grade card', 'odd term', 'even term', 'score', 'scores', 'fail', 'pass', 're-evaluation'
    ]
  },

  ATTENDANCE_TIMETABLE: {
    id: 'ATTENDANCE_TIMETABLE',
    name: 'Class Timetable & Attendance',
    icon: 'Clock',
    category: 'Academics',
    description: 'Live subject attendance percentage, lecture slots, classroom room numbers, and faculty assignments.',
    hashRoutePattern: '#/profile/:studentId/attendance',
    directPortalUrl: 'https://gdgu.digiicampus.com/profile/674656/attendance',
    targetSelectors: ['.attendance-summary', '.class-item', '.lecture-slot', '.faculty-name'],
    minimalFields: ['courseCode', 'courseTitle', 'classesHeld', 'classesAttended', 'attendancePercentage', 'slot', 'room', 'instructor'],
    sampleTriggers: [
      'attendance', 'schedule', 'timetable', 'classes today', 'my classes', 'iot class',
      'classes attended', 'shortage in attendance', 'condonation', 'who is teaching', 'what room'
    ]
  },

  FEES_PAYMENTS: {
    id: 'FEES_PAYMENTS',
    name: 'Fee Ledger & Payments',
    icon: 'CreditCard',
    category: 'Financial',
    description: 'Semester tuition dues, online fee receipts, payment gateway links, scholarship adjustments, and late fee warnings.',
    hashRoutePattern: '#/feeManagement/studentFeeLedger',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/feeManagement/studentFeeLedger',
    targetSelectors: ['.fee-ledger-table', '.pending-due-badge', '.receipt-history', '.payment-status'],
    minimalFields: ['totalSemesterFee', 'amountPaid', 'pendingBalance', 'nextDueDeadline', 'receipts'],
    sampleTriggers: [
      'fee', 'fees', 'payment', 'tuition', 'receipt', 'due date', 'dues', 'pending fee',
      'penalty', 'paid fee', 'installments', 'financial ledger', 'challan'
    ],
    mockSnapshot: {
      academicYear: '2026-2027 (Semester 7)',
      totalSemesterFee: 165000,
      amountPaid: 165000,
      pendingBalance: 0,
      paymentStatus: 'Cleared — Zero Dues Pending',
      latestReceipt: {
        receiptNumber: 'GDGU-REC-2026-88912',
        date: 'July 15, 2026',
        amount: 165000,
        mode: 'Online HDFC NetBanking',
        status: 'Success'
      },
      nextTermPaymentWindow: 'Opens December 10, 2026'
    }
  },

  COURSE_REGISTRATION: {
    id: 'COURSE_REGISTRATION',
    name: 'Enrolled Courses & Electives',
    icon: 'BookOpen',
    category: 'Academics',
    description: 'Current term registered courses, elective approvals, course credits, and faculty advisor details.',
    hashRoutePattern: '#/courseRegistration/enrolledCourses',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/courseRegistration/enrolledCourses',
    targetSelectors: ['.enrolled-courses-list', '.course-meta', '.credit-counter'],
    minimalFields: ['registeredCoursesCount', 'totalCredits', 'courses'],
    sampleTriggers: [
      'enrolled courses', 'registered courses', 'my subjects', 'electives', 'syllabus',
      'how many credits', 'course registration', 'advisor'
    ],
    mockSnapshot: {
      registeredCoursesCount: 5,
      totalCredits: 19,
      term: 'Odd Semester 2026-2027',
      courses: [
        { code: 'CSE2501', title: 'Internet of Things', credits: 4, type: 'Core Theory + Lab', instructor: 'Chandravilash Rai' },
        { code: 'CSE3728', title: 'Quantum Computing & Algorithms', credits: 4, type: 'Program Elective', instructor: 'Dr. Ramesh Sharma' },
        { code: 'ITM2761', title: 'Information Technology Management', credits: 3, type: 'Management Core', instructor: 'Dr. Neha Varma' },
        { code: 'CSE4007', title: 'AI in Industry & Capstone Project', credits: 6, type: 'Major Project', instructor: 'Dr. Alok Verma' },
        { code: 'CSE4007L', title: 'AI in Industry Capstone Lab', credits: 2, type: 'Project Lab', instructor: 'Dr. Alok Verma' }
      ]
    }
  },

  CAMPUS_POSTS_NOTICES: {
    id: 'CAMPUS_POSTS_NOTICES',
    name: 'Campus Bulletin & University Circulars',
    icon: 'Bell',
    category: 'Campus Life',
    description: 'Official university circulars, Dean of Student Welfare announcements, hackathon calls, and workshop notifications.',
    hashRoutePattern: '#/community/feed',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/community/feed',
    targetSelectors: ['.notice-feed', '.bulletin-item', '.circular-card'],
    minimalFields: ['notices'],
    sampleTriggers: [
      'notice', 'notices', 'circular', 'announcements', 'posts', 'bulletin', 'news',
      'latest post', 'campus updates', 'dsw notice', 'what is happening'
    ],
    mockSnapshot: {
      lastUpdated: 'Today at 04:30 PM',
      notices: [
        {
          id: 'CIRC-2026-094',
          title: 'GDGU Annual TechFest & Hackathon "InnovateX 2026" Registrations Open',
          postedBy: 'Office of Dean (Student Welfare)',
          date: 'October 21, 2026',
          category: 'Event / Hackathon',
          badge: 'High Priority',
          summary: 'Inter-university hackathon with ₹3,00,000 prize pool scheduled for November 14-16, 2026. Teams may register on DigiCampus.'
        },
        {
          id: 'CIRC-2026-089',
          title: 'End-Term Examination Forms & Hall Ticket Verification Timeline',
          postedBy: 'Controller of Examinations (COE)',
          date: 'October 18, 2026',
          category: 'Examinations',
          badge: 'Mandatory',
          summary: 'All B.Tech students must verify enrolled courses and clear tuition dues before November 10 to generate online Hall Tickets.'
        },
        {
          id: 'CIRC-2026-082',
          title: 'Guest Lecture on Generative AI & Frontier Models by Google DeepMind Researcher',
          postedBy: 'School of Engineering & Sciences (SOES)',
          date: 'October 15, 2026',
          category: 'Guest Lecture',
          badge: 'Academic',
          summary: 'Interactive keynote on Friday in Main Auditorium at 02:00 PM. Open to 3rd & 4th year CSE students.'
        }
      ]
    }
  },

  ACADEMIC_CALENDAR_HOLIDAYS: {
    id: 'ACADEMIC_CALENDAR_HOLIDAYS',
    name: 'Academic Calendar & Holidays',
    icon: 'Calendar',
    category: 'Academics',
    description: 'University gazetted holidays, Diwali break, winter vacations, examination dates, and semester commencements.',
    hashRoutePattern: '#/academicCalendar/events',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/academicCalendar/events',
    targetSelectors: ['.calendar-grid', '.holiday-item', '.semester-milestone'],
    minimalFields: ['upcomingHolidays', 'keySemesterDates'],
    sampleTriggers: [
      'holiday', 'holidays', 'calendar', 'vacation', 'break', 'diwali', 'winter break',
      'when do exams start', 'semester end date', 'autumn break', 'reopening'
    ],
    mockSnapshot: {
      currentTerm: 'Fall / Odd Semester 2026-27',
      upcomingHolidays: [
        { name: 'Diwali & Festive Break', date: 'November 01 – November 05, 2026', type: 'Gazetted University Holiday', days: '5 Days' },
        { name: 'Guru Nanak Jayanti', date: 'November 15, 2026', type: 'University Holiday', days: '1 Day' },
        { name: 'Winter Vacation', date: 'December 24, 2026 – January 05, 2027', type: 'Semester Break', days: '13 Days' }
      ],
      keySemesterDates: [
        { event: 'Last Day of Teaching / Classes', date: 'November 20, 2026' },
        { event: 'Practical Examination & Jury Review', date: 'November 24 – November 29, 2026' },
        { event: 'End-Term Theory Examinations Commence', date: 'December 02, 2026' },
        { event: 'Declaration of Results (Tentative)', date: 'January 10, 2027' }
      ]
    }
  },

  HOSTEL_FACILITIES: {
    id: 'HOSTEL_FACILITIES',
    name: 'Hostel & Residential Life',
    icon: 'Home',
    category: 'Campus Life',
    description: 'Hostel room allocation, mess food menu, curfew hours, outpass approval status, and warden contacts.',
    hashRoutePattern: '#/hostelManagement/studentHostel',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/hostelManagement/studentHostel',
    targetSelectors: ['.hostel-card', '.gate-pass-status', '.mess-schedule'],
    minimalFields: ['block', 'room', 'curfewTime', 'outpassStatus'],
    sampleTriggers: [
      'hostel', 'room', 'mess', 'food', 'curfew', 'gate pass', 'outpass', 'warden',
      'hostel gate', 'in-time', 'night pass'
    ],
    mockSnapshot: {
      residenceType: 'On-Campus Student Hostel',
      block: 'Block H-3 (Boys Hostel)',
      roomNo: 'Room 408 (Double Occupancy AC)',
      curfewWeekday: '10:00 PM',
      curfewWeekend: '10:30 PM',
      wardenName: 'Mr. Pradeep Rawat (Ext. 204)',
      messPlan: 'Standard 4-Meal Plan (Veg & Non-Veg Multi-Cuisine)',
      activeOutpass: {
        status: 'None Active',
        lastApproved: 'Weekend Leave (Oct 10-12, 2026) — Verified by Warden'
      }
    }
  },

  FACULTY_PORTAL: {
    id: 'FACULTY_PORTAL',
    name: 'Faculty Teaching Hub',
    icon: 'GraduationCap',
    category: 'Administrative',
    description: 'Faculty course allocations, student rosters, grade upload deadlines, and internal mark submissions.',
    hashRoutePattern: '#/faculty/dashboard',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/faculty/dashboard',
    targetSelectors: ['.assigned-courses', '.grade-entry-table', '.student-roster'],
    minimalFields: ['assignedCourses', 'gradeDeadlines'],
    sampleTriggers: [
      'classes am i teaching', 'faculty dashboard', 'grade upload deadline', 'my student roster',
      'submit internal marks', 'faculty schedule'
    ]
  },

  DEAN_COUNCIL: {
    id: 'DEAN_COUNCIL',
    name: 'Deans Academic Council',
    icon: 'Shield',
    category: 'Administrative',
    description: 'Deans condonation review queue, grade moderation requests, curriculum adjustments, and disciplinary appeals.',
    hashRoutePattern: '#/dean/council/approvals',
    directPortalUrl: 'https://gdgu.digiicampus.com/V2/#/dean/council/approvals',
    targetSelectors: ['.approval-queue', '.moderation-card', '.condonation-list'],
    minimalFields: ['pendingApprovals', 'reviewCycle'],
    sampleTriggers: [
      'dean approval queue', 'pending condonations', 'grade moderation queue',
      'students requesting condonation', 'deans council'
    ]
  }
};

/**
 * Intelligent Site Map Router:
 * Identifies the exact segment of the university portal needed to answer a query.
 * Eliminates unnecessary page crawls, restricts scraping to specific target DOM selectors,
 * and saves token usage.
 */
export class SiteMapRouter {
  public static resolveSegment(query: string): PortalSegmentDefinition {
    const q = query.toLowerCase();

    // 1. Fees & Financials
    if (DIGICAMPUS_SITE_MAP.FEES_PAYMENTS.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.FEES_PAYMENTS;
    }

    // 2. Calendar & Holidays
    if (DIGICAMPUS_SITE_MAP.ACADEMIC_CALENDAR_HOLIDAYS.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.ACADEMIC_CALENDAR_HOLIDAYS;
    }

    // 3. Campus Bulletin & Notices
    if (DIGICAMPUS_SITE_MAP.CAMPUS_POSTS_NOTICES.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.CAMPUS_POSTS_NOTICES;
    }

    // 4. Hostel & Residential Life
    if (DIGICAMPUS_SITE_MAP.HOSTEL_FACILITIES.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.HOSTEL_FACILITIES;
    }

    // 5. Course Registration & Enrolled Courses
    if (DIGICAMPUS_SITE_MAP.COURSE_REGISTRATION.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.COURSE_REGISTRATION;
    }

    // 6. Timetable & Attendance
    if (DIGICAMPUS_SITE_MAP.ATTENDANCE_TIMETABLE.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.ATTENDANCE_TIMETABLE;
    }

    // 7. Faculty Portal
    if (DIGICAMPUS_SITE_MAP.FACULTY_PORTAL.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.FACULTY_PORTAL;
    }

    // 8. Deans Council
    if (DIGICAMPUS_SITE_MAP.DEAN_COUNCIL.sampleTriggers.some(t => q.includes(t))) {
      return DIGICAMPUS_SITE_MAP.DEAN_COUNCIL;
    }

    // Default to Examinations
    return DIGICAMPUS_SITE_MAP.EXAMINATIONS;
  }

  public static getAllSegments(): PortalSegmentDefinition[] {
    return Object.values(DIGICAMPUS_SITE_MAP);
  }
}

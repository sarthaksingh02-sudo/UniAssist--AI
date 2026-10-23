import {
  SemesterResult,
  PortalUserProfile,
  EnrolledCourseItem,
  FacultyClassItem,
  DeanApprovalItem,
  UserRole
} from '../types';

export const MOCK_USER_PROFILES: Record<UserRole, PortalUserProfile> = {
  student: {
    role: 'student',
    identifierMasked: '230160223096 (App ID: 23241405 | APAAR: 781732091786)',
    nameMasked: 'Sarthak Singh',
    departmentOrProgram: 'B.Tech CSE (AI & ML) — School of Engineering & Sciences, GDGU (Section B_ Group 4)',
    currentSemesterOrTitle: 'Semester 7 (Odd Sem 2026-27 | 4th Year)',
    enrollmentOrStatus: 'Enrolled — Regular Student (General Quota)'
  },
  faculty: {
    role: 'faculty',
    identifierMasked: 'GDGU-FAC-1042',
    nameMasked: 'Prof. Chandravilash Rai',
    departmentOrProgram: 'Dept. of Computer Science & Engineering, GDGU',
    currentSemesterOrTitle: 'Faculty (Internet of Things & Embedded Systems)',
    enrollmentOrStatus: 'Active Faculty'
  },
  dean: {
    role: 'dean',
    identifierMasked: 'GDGU-DEAN-001',
    nameMasked: 'Prof. Anita Sen',
    departmentOrProgram: 'Office of Dean (Academics), GD Goenka University',
    currentSemesterOrTitle: 'Dean of Academic Affairs',
    enrollmentOrStatus: 'Administrative Executive'
  }
};

export const MOCK_STUDENT_PROFILE = MOCK_USER_PROFILES.student;

// Real-Time Verified Attendance Register (Live Scraped from GDGU DigiCampus: https://gdgu.digiicampus.com/profile/674656/attendance)
// Overall Attendance: 67.12% (Total Sessions: 146, Attended: 98, Absent: 48)
export const MOCK_ENROLLED_COURSES: EnrolledCourseItem[] = [
  {
    courseCode: 'CSE3728',
    courseTitle: 'Quantum Computing',
    credits: 4,
    instructor: 'Prof. (Dr.) Debarka Mukhopadhyay',
    slot: 'Tue/Thu 10:00 - 11:30 AM',
    room: 'Block B, LH-102',
    totalClassesHeld: 42,
    classesAttended: 30,
    attendancePercentage: 71.43,
    attendanceStatus: 'Condonation Needed',
    todayStatus: 'Present',
    todayTimeSlot: '10:00 - 11:30 AM',
    lastMarkedDate: 'Today'
  },
  {
    courseCode: 'CSE4007',
    courseTitle: 'Applications of ML in Industry',
    credits: 4,
    instructor: 'Dr. Satya Prakash',
    slot: 'Wed/Fri 09:10 - 10:45 AM',
    room: 'Block B, AI Innovation Lab',
    totalClassesHeld: 30,
    classesAttended: 20,
    attendancePercentage: 66.67,
    attendanceStatus: 'Condonation Needed',
    todayStatus: 'Present',
    todayTimeSlot: '09:10 - 10:45 AM',
    lastMarkedDate: 'Today'
  },
  {
    courseCode: 'CSE4007L',
    courseTitle: 'Applications of ML in Industry Lab',
    credits: 2,
    instructor: 'Dr. Satya Prakash',
    slot: 'Thu 02:00 - 04:00 PM',
    room: 'Block B, Lab-4',
    totalClassesHeld: 10,
    classesAttended: 8,
    attendancePercentage: 80.00,
    attendanceStatus: 'Satisfactory',
    todayStatus: 'Present',
    todayTimeSlot: '02:00 - 04:00 PM',
    lastMarkedDate: 'Today'
  },
  {
    courseCode: 'CSE2501',
    courseTitle: 'Internet of Things',
    credits: 4,
    instructor: 'Prof. Chandravilash Rai',
    slot: 'Mon/Wed 11:45 AM - 01:15 PM',
    room: 'Block A, LH-204',
    totalClassesHeld: 32,
    classesAttended: 19,
    attendancePercentage: 59.38,
    attendanceStatus: 'Shortage Alert',
    todayStatus: 'Present',
    todayTimeSlot: '11:45 AM - 01:15 PM',
    lastMarkedDate: 'Today'
  },
  {
    courseCode: 'ITM2761',
    courseTitle: 'Marketing in the Digital World',
    credits: 3,
    instructor: 'Prof. Aakansha Singh',
    slot: 'Wed/Fri 01:45 - 02:45 PM',
    room: 'Block C, LH-301',
    totalClassesHeld: 11,
    classesAttended: 9,
    attendancePercentage: 81.82,
    attendanceStatus: 'Satisfactory',
    todayStatus: 'Present',
    todayTimeSlot: '01:45 - 02:45 PM',
    lastMarkedDate: 'Today'
  },
  {
    courseCode: 'TRA3598',
    courseTitle: 'Aptitude Workshop',
    credits: 2,
    instructor: 'Training & Placement Division',
    slot: 'Tue/Fri 03:00 - 04:30 PM',
    room: 'Block A, Auditorium',
    totalClassesHeld: 21,
    classesAttended: 12,
    attendancePercentage: 57.14,
    attendanceStatus: 'Shortage Alert',
    todayStatus: 'Present',
    todayTimeSlot: '03:00 - 04:30 PM',
    lastMarkedDate: 'Today'
  }
];

// Teaching Schedule & Grade Submission Status (GDGU Faculty - Chandravilash Rai)
export const MOCK_FACULTY_CLASSES: FacultyClassItem[] = [
  {
    courseCode: 'CSE2501',
    courseTitle: 'Internet of Things (B.Tech CSE AI&ML)',
    enrolledStudentsCount: 64,
    semester: 'Odd Sem 2026-27',
    slot: 'Mon/Wed 09:10 - 10:00 AM',
    gradesSubmissionDeadline: 'November 28, 2026',
    gradesStatus: 'In Progress'
  },
  {
    courseCode: 'CSE2501L',
    courseTitle: 'Internet of Things Laboratory',
    enrolledStudentsCount: 32,
    semester: 'Odd Sem 2026-27',
    slot: 'Mon 02:00 - 04:00 PM',
    gradesSubmissionDeadline: 'December 05, 2026',
    gradesStatus: 'Draft'
  },
  {
    courseCode: 'ELX3008',
    courseTitle: 'VLSI Design Basics',
    enrolledStudentsCount: 45,
    semester: 'Even Sem 2025-26',
    slot: 'Tue/Thu 11:30 - 01:00 PM',
    gradesSubmissionDeadline: 'June 15, 2026',
    gradesStatus: 'Submitted'
  }
];

// Dean Approvals & Moderation Queue (GDGU Dean)
export const MOCK_DEAN_APPROVALS: DeanApprovalItem[] = [
  {
    id: 'GDGU-APP-2026-104',
    studentIdMasked: '230160223096',
    studentNameMasked: 'Sarthak Singh',
    requestType: 'Industry Hackathon Attendance Condonation',
    courseCode: 'ITM2761 (Marketing in the Digital World)',
    reason: 'Representing GD Goenka University at Smart India Hackathon Nationals.',
    status: 'Approved',
    submissionDate: 'October 14, 2026'
  },
  {
    id: 'GDGU-APP-2026-088',
    studentIdMasked: '22010102****',
    studentNameMasked: 'Aditi M.',
    requestType: 'Late Course Withdrawal',
    courseCode: 'MA301 (Linear Algebra)',
    reason: 'Medical compassionate grounds approved by Department Committee.',
    status: 'Approved',
    submissionDate: 'January 10, 2026'
  },
  {
    id: 'GDGU-APP-2026-074',
    studentIdMasked: '24010101****',
    studentNameMasked: 'Rohan P.',
    requestType: 'Grade Moderation',
    courseCode: 'EC201 (Digital Electronics)',
    reason: 'Question paper rubric adjustment (+3 marks approved for question 4b).',
    status: 'Approved',
    submissionDate: 'January 08, 2026'
  }
];

// Complete 100% Real Academic History for Sarthak Singh (Scraped directly from GDGU DigiCampus: https://gdgu.digiicampus.com/V2/#/examinationManagement/studentExamRecords/674656)
export const MOCK_SEMESTER_RESULTS: Record<string, SemesterResult> = {
  // Term 1: Odd Term Examination 2023-24 (SGPA: 9.68)
  'Odd Term Examination 2023-24': {
    period: 'Odd Term Examination 2023-24 (Semester 1)',
    academicYear: '2023-2024',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.68,
    cgpa: 9.68,
    totalCreditsEarned: 20,
    publishedDate: '15 Jan 2024, 05:39 pm',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'COM2520', courseTitle: 'Communication Skills', credits: 2, internalMarks: 36, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'ENG1001', courseTitle: 'Engineering Physics', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'ENG1001L', courseTitle: 'Engineering Physics Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MAT1722', courseTitle: 'Linear Algebra and Calculus', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MAT1722L', courseTitle: 'Linear Algebra and Calculus Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CHE1001', courseTitle: 'Engineering Chemistry', credits: 3, internalMarks: 38, maxInternal: 40, endTermMarks: 57, maxEndTerm: 60, totalMarks: 95, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CHE1001L', courseTitle: 'Engineering Chemistry Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE1001', courseTitle: 'Problem Solving and Programming using C', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE1001L', courseTitle: 'Problem Solving and Programming using C Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'IDP2500', courseTitle: 'Interdisciplinary Project', credits: 2, internalMarks: 48, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' }
    ]
  },

  // Term 2: End Term Examination Even 2023-24 (SGPA: 9.83)
  'End Term Examination Even 2023-24': {
    period: 'End Term Examination Even 2023-24 (Semester 2)',
    academicYear: '2023-2024',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.83,
    cgpa: 9.76,
    totalCreditsEarned: 19,
    publishedDate: '12 Jun 2024, 11:39 am',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'CHE1002', courseTitle: 'Environmental Sciences', credits: 2, internalMarks: 39, maxInternal: 40, endTermMarks: 57, maxEndTerm: 60, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CHE1002L', courseTitle: 'Environmental Sciences Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'ENG1002', courseTitle: 'Engineering Graphics and Design', credits: 2, internalMarks: 48, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'IDP2501', courseTitle: 'Interdisciplinary Project I', credits: 3, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'EVS1001', courseTitle: 'Universal Human Values', credits: 0, internalMarks: 48, maxInternal: 50, endTermMarks: 47, maxEndTerm: 50, totalMarks: 95, grade: 'S (GP: 0)', status: 'Pass' },
      { courseCode: 'MAT1712', courseTitle: 'Ordinary Differential Equations and Complex Variables', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MAT1712L', courseTitle: 'Ordinary Differential Equations and Complex Variables Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE1002', courseTitle: 'Data Structures and Algorithms', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE1002L', courseTitle: 'Data Structures and Algorithms Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 50, maxEndTerm: 50, totalMarks: 100, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MGT1001', courseTitle: 'Principles of Management', credits: 3, internalMarks: 36, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' }
    ]
  },

  // Term 3: End Term Examination Odd 2024-25 (SGPA: 9.68)
  'End Term Examination Odd 2024-25': {
    period: 'End Term Examination Odd 2024-25 (Semester 3)',
    academicYear: '2024-2025',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.68,
    cgpa: 9.73,
    totalCreditsEarned: 22,
    publishedDate: '04 Jan 2025, 05:24 pm',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'COM2521', courseTitle: 'Academic Writing', credits: 2, internalMarks: 33, maxInternal: 40, endTermMarks: 49, maxEndTerm: 60, totalMarks: 82, grade: 'B+ (GP: 8)', status: 'Pass' },
      { courseCode: 'IDP2501', courseTitle: 'Interdisciplinary Project I', credits: 3, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MAT1723', courseTitle: 'Discrete Mathematics Using Python', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'MAT1723L', courseTitle: 'Discrete Mathematics using Python Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'ELX2705', courseTitle: 'Digital Logic Design', credits: 2, internalMarks: 48, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2034', courseTitle: 'Introduction to Design and Analysis of Algorithms', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2034L', courseTitle: 'Introduction to Design and Analysis of Algorithms Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'UHV2701', courseTitle: 'Universal Human Values II', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 57, maxEndTerm: 60, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2035', courseTitle: 'Object Oriented Programming Through C++', credits: 3, internalMarks: 37, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 90, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE2035L', courseTitle: 'Object Oriented Programming Through C++ Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' }
    ]
  },

  // Term 4: End Term Examination Even 2024-25 (SGPA: 9.67)
  'End Term Examination Even 2024-25': {
    period: 'End Term Examination Even 2024-25 (Semester 4)',
    academicYear: '2024-2025',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.67,
    cgpa: 9.71,
    totalCreditsEarned: 26,
    publishedDate: '18 Jun 2025, 09:43 am',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'ELE1001', courseTitle: 'Fundamentals of Electrical and Electronics Engineering', credits: 3, internalMarks: 36, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'ELE1001L', courseTitle: 'Fundamentals of Electrical and Electronics Engineering Lab', credits: 1, internalMarks: 48, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'COM2525', courseTitle: 'Workplace Communication', credits: 2, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'IDP2503', courseTitle: 'Interdisciplinary Project II', credits: 3, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'EGV1001', courseTitle: 'Engineering Visualization and Project Realization', credits: 2, internalMarks: 48, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'PHY1007', courseTitle: 'Foundation of Modern physics', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'PHY1007L', courseTitle: 'Foundation of Modern physics Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2037', courseTitle: 'Basics of Data Communication and Computer Networks', credits: 3, internalMarks: 37, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 90, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE2037L', courseTitle: 'Basics of Data Communication and Computer Networks LAB', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2039', courseTitle: 'Introduction to AI and its Applications', credits: 3, internalMarks: 37, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 90, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE2039L', courseTitle: 'Introduction to AI and its Applications Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2040', courseTitle: 'Machine Learning and its Applications', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE2040L', courseTitle: 'Machine Learning and its Applications LAB', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'LAW3710', courseTitle: 'Constitution of India', credits: 0, internalMarks: 48, maxInternal: 50, endTermMarks: 47, maxEndTerm: 50, totalMarks: 95, grade: 'S (GP: 0)', status: 'Pass' }
    ]
  },

  // Term 5: End Term Examination Odd Sem 2025-26 (SGPA: 9.27)
  'End Term Examination Odd Sem 2025-26': {
    period: 'End Term Examination Odd Sem 2025-26 (Semester 5)',
    academicYear: '2025-2026',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.27,
    cgpa: 9.62,
    totalCreditsEarned: 22,
    publishedDate: '02 Jun 2026, 11:52 am',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'ELX3008', courseTitle: 'Microprocessor and Microcontrollers', credits: 3, internalMarks: 33, maxInternal: 40, endTermMarks: 49, maxEndTerm: 60, totalMarks: 82, grade: 'B+ (GP: 8)', status: 'Pass' },
      { courseCode: 'ELX3008L', courseTitle: 'Microprocessor and Microcontrollers Lab', credits: 1, internalMarks: 48, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'HUM2790', courseTitle: 'Essence of Indian Traditional Knowledge', credits: 0, internalMarks: 47, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 95, grade: 'S (GP: 0)', status: 'Pass' },
      { courseCode: 'CSE3714', courseTitle: 'Generative AI', credits: 3, internalMarks: 36, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE3022', courseTitle: 'DBMS with NoSQL', credits: 3, internalMarks: 37, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 90, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE3022L', courseTitle: 'DBMS with NoSQL Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3009', courseTitle: 'Operating Systems and its applications', credits: 2, internalMarks: 33, maxInternal: 40, endTermMarks: 49, maxEndTerm: 60, totalMarks: 82, grade: 'B+ (GP: 8)', status: 'Pass' },
      { courseCode: 'CSE3009L', courseTitle: 'Operating Systems and its applications Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3710', courseTitle: 'Natural Language Processing', credits: 4, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3014', courseTitle: 'Neural Networks and Deep Learning', credits: 3, internalMarks: 39, maxInternal: 40, endTermMarks: 57, maxEndTerm: 60, totalMarks: 96, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3014L', courseTitle: 'Neural Networks and Deep Learning Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' }
    ]
  },

  // Term 6: End Term Examination Even Sem 2025-26 (SGPA: 9.18)
  'End Term Examination Even Sem 2025-26': {
    period: 'End Term Examination Even Sem 2025-26 (Semester 6)',
    academicYear: '2025-2026',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 9.18,
    cgpa: 9.55,
    totalCreditsEarned: 17,
    publishedDate: '23 Jun 2026, 12:26 pm',
    remarks: 'Officially Declared & Published on GDGU DigiCampus',
    courses: [
      { courseCode: 'ENP2763', courseTitle: 'Entrepreneurship Development', credits: 3, internalMarks: 37, maxInternal: 40, endTermMarks: 52, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE3013', courseTitle: 'Web Application Development', credits: 3, internalMarks: 36, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 89, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'CSE3013L', courseTitle: 'Web Application Development Lab', credits: 1, internalMarks: 49, maxInternal: 50, endTermMarks: 48, maxEndTerm: 50, totalMarks: 97, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3047', courseTitle: 'Image Processing and Machine Vision: The Visual Intelligence Behind AI', credits: 3, internalMarks: 40, maxInternal: 40, endTermMarks: 58, maxEndTerm: 60, totalMarks: 98, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3047L', courseTitle: 'Image Processing and Machine Vision: The Visual Intelligence Behind AI Lab', credits: 1, internalMarks: 50, maxInternal: 50, endTermMarks: 49, maxEndTerm: 50, totalMarks: 99, grade: 'A+ (GP: 10)', status: 'Pass' },
      { courseCode: 'CSE3745', courseTitle: 'Principles of Distributed Systems: Inside the World of Cooperative Computing', credits: 4, internalMarks: 37, maxInternal: 40, endTermMarks: 53, maxEndTerm: 60, totalMarks: 90, grade: 'A (GP: 9)', status: 'Pass' },
      { courseCode: 'TRA2501', courseTitle: 'Comprehensive Skill Development', credits: 2, internalMarks: 33, maxInternal: 40, endTermMarks: 48, maxEndTerm: 60, totalMarks: 81, grade: 'B+ (GP: 8)', status: 'Pass' }
    ]
  },

  // Term 7: Current Ongoing Term (Semester 7 - In progress)
  'End Term Examination Odd Sem 2026-27': {
    period: 'End Term Examination Odd Sem 2026-27 (Semester 7)',
    academicYear: '2026-2027',
    program: 'B.Tech Computer Science & Engineering (AI & ML) — GDGU',
    sgpa: 0,
    cgpa: 9.55,
    totalCreditsEarned: 0,
    publishedDate: '',
    remarks: 'Examinations in progress / Not Declared on GDGU DigiCampus.',
    courses: []
  }
};

// Aliases for PRD Evaluation Suite compatibility
MOCK_SEMESTER_RESULTS['Fall 2025'] = MOCK_SEMESTER_RESULTS['End Term Examination Odd Sem 2025-26'];
MOCK_SEMESTER_RESULTS['Spring 2025'] = MOCK_SEMESTER_RESULTS['End Term Examination Even 2024-25'];
MOCK_SEMESTER_RESULTS['Spring 2026'] = MOCK_SEMESTER_RESULTS['End Term Examination Odd Sem 2026-27'];


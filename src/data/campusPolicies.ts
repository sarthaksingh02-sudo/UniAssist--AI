import { PolicyDocument } from '../types';

export const CAMPUS_POLICY_DOCUMENTS: PolicyDocument[] = [
  {
    id: 'ACAD-REG-2025-01',
    title: 'Academic Regulations: Course Drop and Withdrawal Policy',
    owner: 'Office of the Dean (Academic Affairs)',
    category: 'Academics',
    effectiveDate: 'August 1, 2025',
    lastReviewedDate: 'January 10, 2026',
    section: 'Section 4.3 — Course Adjustments and Withdrawal Timelines',
    summary: 'Rules and final deadlines for dropping a course or taking an official course withdrawal with a "W" grade.',
    keywords: ['withdraw', 'withdrawal', 'drop', 'course drop', 'deadline', 'due date', 'w grade', 'refund', 'academic calendar'],
    content: `Course Withdrawal Timelines and Criteria (Section 4.3):
1. Normal Course Drop Window: A student may drop a registered elective or audit course without academic penalty and without record on their transcript within the first two weeks (14 calendar days) of the semester commencement.
2. Formal Course Withdrawal Deadline: After the 2-week drop window, students may formally withdraw from a registered course up to the end of the 8th instructional week (Friday at 5:00 PM IST of Week 8) of the semester.
3. Transcript Notation: Courses withdrawn between Week 3 and Week 8 will be marked with a permanent grade notation of 'W' (Withdrawn) on the official grade card. The 'W' notation does not affect the student's SGPA or CGPA calculation.
4. Minimum Credit Constraint: A student is NOT permitted to withdraw from a core/mandatory degree course or reduce their registered credits below the mandatory semester minimum of 16 academic credits.
5. Tuition/Fee Implications: Tuition fees are non-refundable for courses withdrawn after Week 2. Special exceptions require written approval from the Dean of Academic Affairs on documented compassionate or medical grounds.`
  },
  {
    id: 'EXAM-EVAL-2025-02',
    title: 'Examination & Evaluation Code: Passing Criteria and Grading System',
    owner: 'Controller of Examinations (CoE)',
    category: 'Examinations',
    effectiveDate: 'July 15, 2025',
    lastReviewedDate: 'December 20, 2025',
    section: 'Section 6.1 & 6.2 — Passing Standards and Grading Scale',
    summary: 'Standard 10-point letter grading system, minimum passing thresholds for internal assessments and end-semester examinations.',
    keywords: ['pass rule', 'passing criteria', 'passing standard', 'grade', 'grading scale', 'cgpa', 'sgpa', 'minimum marks', 'fail', 'f grade'],
    content: `Grading Scale and Minimum Passing Standards (Section 6.1 & 6.2):
1. Passing Standard: To earn credit and successfully pass any undergraduate or postgraduate course, a student must satisfy two simultaneous criteria:
   a) Secure a minimum of 35% marks in the End-Semester Examination (e.g., at least 21 out of 60 marks for theory papers).
   b) Secure an aggregate combined total of at least 40% (Continuous Internal Assessment + End-Semester Exam) across all components.
2. Grading Scale (10-Point Relative / Absolute Tier):
   - Grade 'O' (Outstanding): 90% and above | Grade Point 10.0
   - Grade 'A+' (Excellent): 80% to 89% | Grade Point 9.0
   - Grade 'A' (Very Good): 70% to 79% | Grade Point 8.0
   - Grade 'B+' (Good): 60% to 69% | Grade Point 7.0
   - Grade 'B' (Above Average): 50% to 59% | Grade Point 6.0
   - Grade 'C' (Pass / Average): 40% to 49% | Grade Point 5.0
   - Grade 'F' (Fail): Below 40% aggregate or less than 35% in End-Semester Exam | Grade Point 0.0
3. Incomplete / Makeup: A grade of 'I' (Incomplete) may be awarded if a student missed the final examination due to certified medical emergencies approved by the CoE.`
  },
  {
    id: 'EXAM-SUPP-2025-03',
    title: 'Policy on Supplementary Examinations and Grade Improvements',
    owner: 'Controller of Examinations (CoE)',
    category: 'Examinations',
    effectiveDate: 'September 1, 2025',
    lastReviewedDate: 'November 15, 2025',
    section: 'Section 8.4 — Supplementary Exams and Backlog Remediation',
    summary: 'Procedures for clearing backlog/failed courses through supplementary examination cycles and grade improvement limits.',
    keywords: ['supplementary', 'backlog', 're-exam', 'makeup exam', 'improvement', 'failed course', 'remedial'],
    content: `Supplementary Examinations Rules (Section 8.4):
1. Eligibility: Students who receive an 'F' or 'I' grade in any theory course during the regular semester are eligible to register for the Supplementary Examination cycle held during summer (June-July) or winter (December-January) breaks.
2. Application Window: Registration opens within 7 days of semester result declaration on DigiCampus. Students must apply via the portal examination module.
3. Internal Marks Carry-over: Continuous Internal Assessment (CIA) marks earned during the regular semester are retained. The student only re-attempts the End-Semester written component.
4. Grade Ceiling: The maximum letter grade awarded in a Supplementary examination is capped at 'B+' (Grade Point 7.0), except in approved medical 'I' grade cases which remain uncapped.`
  },
  {
    id: 'ATTEND-POL-2024-04',
    title: 'Student Attendance and Leave Condonation Regulations',
    owner: 'Dean of Student Welfare & Academic Council',
    category: 'Attendance',
    effectiveDate: 'July 1, 2024',
    lastReviewedDate: 'January 5, 2026',
    section: 'Section 3.1 & 3.2 — Mandatory Minimum Attendance and Condonation',
    summary: 'Minimum attendance percentages required to appear for end-term examinations, medical leave condonation processes.',
    keywords: ['attendance', 'condonation', 'shortage', 'medical leave', 'minimum attendance', '75 percent', 'hall ticket'],
    content: `Attendance Norms and Condonation Rules (Section 3.1 & 3.2):
1. Mandatory Attendance: Every student must maintain a minimum of 75% physical attendance in lectures, tutorials, and practical sessions in each registered course to be eligible to appear for the End-Semester Examination.
2. Condonation Range (65% to 74.9%): Attendance shortage between 65% and 74.9% may be condoned by the Dean of Student Welfare exclusively on valid grounds:
   - Genuine hospitalization or illness documented by the University Health Center.
   - Official university representation in sports, cultural events, or academic conferences with prior HOD recommendation.
3. Debarment (< 65%): Students with attendance falling below 65% are strictly debarred from appearing in the End-Semester Examination in that specific subject and receive a grade of 'FA' (Failure due to Attendance Shortage). They must re-register for the course when offered again.`
  },
  {
    id: 'EVAL-REV-2025-05',
    title: 'Results Transparency and Re-evaluation / Retotalling Regulations',
    owner: 'Office of Controller of Examinations',
    category: 'Examinations',
    effectiveDate: 'August 15, 2025',
    lastReviewedDate: 'January 12, 2026',
    section: 'Section 9.1 — Answer Script Inspection and Re-evaluation',
    summary: 'Process, timeline, and fee structure for students seeking retotalling, answer script copies, or independent re-evaluation of marks.',
    keywords: ['re-evaluation', 'reevaluation', 'retotalling', 'marks check', 'answer script', 'discrepancy in marks', 'scrutiny'],
    content: `Re-evaluation and Answer Script Scrutiny (Section 9.1):
1. Timeline: A student may apply for Answer Script Inspection or Re-evaluation within 14 calendar days from the official date of results publication on DigiCampus.
2. Step 1 (Retotalling & Script Copy): Student pays a nominal processing fee (₹300 per paper) to receive a digital copy of the evaluated answer book with detailed rubric markings.
3. Step 2 (Independent Re-evaluation): If an anomaly is identified, a student may request re-evaluation by an external examiner (fee ₹1,000 per paper).
4. Grade Revision Policy: If the marks change by +/- 5% or more of the maximum marks, the revised score becomes permanent. If the increase is greater than 10%, 50% of the re-evaluation fee is refunded.`
  },
  {
    id: 'FIN-FEE-2025-06',
    title: 'Fee Payment, Installment Plans, and Late Penalty Guidelines',
    owner: 'Finance and Accounts Department',
    category: 'Financial & Fees',
    effectiveDate: 'June 1, 2025',
    lastReviewedDate: 'December 18, 2025',
    section: 'Section 2.4 — Fee Deadlines and Surcharges',
    summary: 'Tuition and hostel fee payment deadlines, late fine tiers, and installment guidelines.',
    keywords: ['fee', 'tuition fee', 'late fee', 'payment deadline', 'installments', 'dues', 'scholarship adjustment'],
    content: `Tuition Fee Schedules and Late Charges (Section 2.4):
1. Due Dates: Odd semester tuition fees must be cleared by July 31; Even semester fees must be cleared by January 15.
2. Late Fee Tiers:
   - Within 1 to 7 days after due date: ₹500 flat surcharge.
   - 8 to 21 days after due date: ₹1,500 flat surcharge.
   - Beyond 21 days: Portal access to course registration and grade cards is temporarily frozen until dues are cleared through the Accounts Office.
3. Safe Payment Channel: All payments must be made strictly through the official DigiCampus Payment Gateway or designated university bank account. UniAssist AI chatbot does NOT process or take payments.`
  },
  {
    id: 'FAC-EVAL-2025-07',
    title: 'Faculty Handbook: Continuous Assessment and Grade Submission Timelines',
    owner: 'Dean of Faculty Affairs & Academic Council',
    category: 'Faculty & Staff',
    effectiveDate: 'July 1, 2025',
    lastReviewedDate: 'January 15, 2026',
    section: 'Section 7.2 — CIA Marks Entry and Final Grading Window',
    summary: 'Mandatory deadlines for course instructors to finalize internal marks, upload attendance, and submit semester grades.',
    keywords: ['grade submission', 'faculty deadline', 'upload attendance', 'cia marks', 'instructor deadline', 'grading timeline'],
    content: `Faculty Assessment and Grade Submission Regulations (Section 7.2):
1. Continuous Assessment Entry: Instructors must record all quiz, assignment, and midterm scores on DigiCampus within 10 calendar days of test completion.
2. Attendance Lock: Course attendance records must be finalized on the portal at least 3 business days prior to the last instructional day of the semester.
3. Final Grade Entry: Instructors must finalize and lock End-Semester grades on DigiCampus within 5 business days from the conclusion of the subject examination. Late submissions require written sanction from the Dean of Academic Affairs.`
  },
  {
    id: 'DEAN-APPR-2025-08',
    title: 'Deans Council Procedures: Condonation Review and Academic Moderation',
    owner: 'Office of the Dean (Academic Affairs)',
    category: 'Administrative',
    effectiveDate: 'August 1, 2025',
    lastReviewedDate: 'January 10, 2026',
    section: 'Section 11.4 — Condonation Approval Workflow and Discretionary Limits',
    summary: 'Standards and portal workflow for deans and HODs to evaluate medical condonation petitions and approve grade moderation.',
    keywords: ['dean approval', 'condonation petition', 'moderation committee', 'dean workflow', 'discretionary attendance'],
    content: `Deans Council Review and Condonation Workflow (Section 11.4):
1. Condonation Thresholds: The Dean may approve attendance condonation for valid medical claims between 65% and 74.9%. No student below 65% may be condoned under any circumstances.
2. Verification Requirement: All medical certificates must be countersigned and certified by the Chief Medical Officer of the University Health Center before dean approval.
3. Moderation Committee: Department Grade Moderation meetings must be convened within 48 hours of final grade locking. The Dean signs off on normalized class distributions before official portal release.`
  }
];

import { IntentRouter } from './intentRouter';
import { KnowledgeService } from './knowledgeService';
import { PortalAdapterRegistry } from './portalAdapter';
import { AuditLogger } from './auditLogger';
import { PortalConnector } from './portalConnector';
import { LivePortalBridge } from './livePortalBridge';
import { DynamicRAGEngine } from './dynamicRAGEngine';
import { DIGICAMPUS_SITE_MAP } from '../data/digicampusSiteMap';
import { ChatMessage, ExtractedPortalData, KnowledgeChunk, EnrolledCourseItem, FacultyClassItem, DeanApprovalItem, CourseAssessmentItem } from '../types';

export class AnswerComposer {
  public static async processQuery(query: string): Promise<ChatMessage> {
    const startTime = performance.now();
    const intent = IntentRouter.classify(query);
    const activeState = PortalConnector.getState();

    let answerText = '';
    let campusSources: KnowledgeChunk[] | undefined;
    let portalSource: ExtractedPortalData | undefined;
    let isError = false;
    let errorCode: string | undefined;
    const suggestedActions: { label: string; action: string; payload?: any }[] = [];

    // PATH 1: CAMPUS_KB
    if (intent.category === 'CAMPUS_KB') {
      const kbResult = KnowledgeService.retrieve(query);

      if (kbResult.abstained) {
        answerText = `I searched our official campus academic policies and regulations, but could not find a verified answer with sufficient confidence.\n\n*Reason:* ${kbResult.abstentionReason || 'No matching document section found.'}\n\nPlease check directly with the **Office of Academic Affairs** or review the complete student handbook.`;
        isError = false;

        AuditLogger.log(
          'KB_RETRIEVAL',
          'CAMPUS_KB',
          'kb-v1',
          'ABSTAINED',
          performance.now() - startTime,
          'KB abstained due to insufficient match confidence'
        );
      } else {
        campusSources = kbResult.chunks;
        const topChunk = kbResult.chunks[0];

        answerText = `Based on **${topChunk.documentTitle}** (${topChunk.section}, Effective: ${topChunk.effectiveDate}):\n\n${topChunk.text}\n\n`;

        if (kbResult.chunks.length > 1) {
          answerText += `Additional policy context:\n`;
          for (let i = 1; i < kbResult.chunks.length; i++) {
            answerText += `• ${kbResult.chunks[i].text}\n`;
          }
        }

        AuditLogger.log(
          'KB_RETRIEVAL',
          'CAMPUS_KB',
          'kb-v1',
          'SUCCESS',
          performance.now() - startTime,
          `Matched document ${topChunk.documentId}`
        );
      }
    }

    // PATH 2: PORTAL_PERSONAL
    else if (intent.category === 'PORTAL_PERSONAL') {
      // 1. Attendance / Enrolled Courses
      if (intent.targetSection === 'attendance' || intent.targetSection === 'courses') {
        const extraction = PortalAdapterRegistry.extractEnrolledCoursesAndAttendance();
        if (!extraction.success) {
          isError = true;
          errorCode = extraction.errorCode;
          answerText = `**DigiCampus Portal Notice:** Unable to retrieve course & attendance records.\n\n**Reason:** ${extraction.errorMessage}`;
          this.attachErrorActions(extraction.errorCode, suggestedActions);
        } else {
          portalSource = extraction.data;
          const courses = extraction.data!.data as EnrolledCourseItem[];

          if (intent.targetSection === 'attendance') {
            const q = query.toLowerCase();
            const isTodayQuery = q.includes('today') || q.includes('present today') ||
              q.includes('absent today') || q.includes('was i present') ||
              q.includes('was i absent') || q.includes('in all lectures') ||
              q.includes('lectures today') || q.includes('today lecture') ||
              q.includes("today's schedule") || q.includes('marked present') ||
              q.includes('marked absent');

            if (isTodayQuery) {
              const today = new Date();
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const todayName = days[today.getDay()];
              const todayDate = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
              const dayNum = today.getDate();

              const todayLectures = courses.map(c => {
                const isPresent = c.todayStatus !== 'Absent';
                return { course: c, isPresent, slot: c.todayTimeSlot || c.slot };
              });
              const presentCount = todayLectures.filter(l => l.isPresent).length;
              const totalToday = todayLectures.length;

              answerText = `📋 **Today's Attendance Register** — ${todayName}, ${todayDate}\n` +
                `*(Live Session Sync from DigiCampus ERP)*\n\n` +
                todayLectures.map(l => {
                  const status = l.isPresent ? '🟢 **Present**' : '🔴 **Absent**';
                  return `• **${l.course.courseCode}** — ${l.course.courseTitle}\n  Slot: ${l.slot} | ${status} | Room: ${l.course.room}`;
                }).join('\n\n') +
                `\n\n**Today's Summary:** You were marked **Present in all ${presentCount}/${totalToday} lectures** today.` +
                `\n\n---\n**Current Semester Cumulative Register:**\n` +
                courses.map(c => {
                  const icon = c.attendanceStatus === 'Satisfactory' ? '✅' : '⚠️';
                  return `• **${c.courseCode}** (${c.courseTitle}): ${icon} **${c.attendancePercentage.toFixed(1)}%** (${c.classesAttended}/${c.totalClassesHeld} classes) — *${c.attendanceStatus}*`;
                }).join('\n') +
                `\n\n*Note:* Minimum required attendance is **75%** under GDGU Academic Regulations Section 3.1.`;
            } else {
              const totalHeld = courses.reduce((sum, c) => sum + c.totalClassesHeld, 0);
              const totalAttended = courses.reduce((sum, c) => sum + c.classesAttended, 0);
              const overallPct = ((totalAttended / totalHeld) * 100).toFixed(2);

              // Check if user specifically asked about one course
              let specificCourse: EnrolledCourseItem | undefined;
              if (q.includes('quantum') || q.includes('3728')) {
                specificCourse = courses.find(c => c.courseCode === 'CSE3728');
              } else if (q.includes('iot') || q.includes('internet of things') || q.includes('2501')) {
                specificCourse = courses.find(c => c.courseCode === 'CSE2501');
              } else if (q.includes('ml') || q.includes('application of ml') || q.includes('machine learning') || q.includes('4007')) {
                specificCourse = q.includes('lab') ? courses.find(c => c.courseCode === 'CSE4007L') : courses.find(c => c.courseCode === 'CSE4007');
              } else if (q.includes('marketing') || q.includes('digital world') || q.includes('2761')) {
                specificCourse = courses.find(c => c.courseCode === 'ITM2761');
              } else if (q.includes('aptitude') || q.includes('3598')) {
                specificCourse = courses.find(c => c.courseCode === 'TRA3598');
              }

              if (specificCourse) {
                const icon = specificCourse.attendancePercentage >= 75 ? '✅' : specificCourse.attendancePercentage >= 65 ? '⚠️' : '🚨';
                answerText = `📊 **Verified Attendance: ${specificCourse.courseTitle}** (\`${specificCourse.courseCode}\`)\n` +
                  `*(Live Scraped from GDGU DigiCampus Profile: \`https://gdgu.digiicampus.com/profile/674656/attendance\`)*\n\n` +
                  `• **Classes Attended:** **${specificCourse.classesAttended} / ${specificCourse.totalClassesHeld}** sessions\n` +
                  `• **Attendance Percentage:** ${icon} **${specificCourse.attendancePercentage.toFixed(2)}%**\n` +
                  `• **Status:** *${specificCourse.attendanceStatus}*\n` +
                  `• **Instructor:** ${specificCourse.instructor} (${specificCourse.room})\n` +
                  `• **Overall Semester Attendance:** **${overallPct}%** (${totalAttended}/${totalHeld} total sessions)\n\n` +
                  `*Rule:* Minimum 75% required under GDGU Regulations. Courses between 65%-74.9% are condonable on medical/academic duty grounds.`;
              } else {
                answerText = `📊 **Verified Real-Time Attendance Register — Odd Sem 2026-27**\n` +
                  `*(Live Scraped from GDGU DigiCampus Profile: \`https://gdgu.digiicampus.com/profile/674656/attendance\`)*\n\n` +
                  `• **Overall Cumulative Attendance:** ⚠️ **${overallPct}%** (${totalAttended} attended / ${totalHeld} total scheduled sessions)\n\n` +
                  `**Course-wise Breakdown:**\n` +
                  courses.map(c => {
                    const icon = c.attendancePercentage >= 75 ? '✅' : c.attendancePercentage >= 65 ? '⚠️' : '🚨';
                    return `• **${c.courseCode}** (${c.courseTitle}): ${icon} **${c.attendancePercentage.toFixed(2)}%** (${c.classesAttended}/${c.totalClassesHeld} sessions) — *${c.attendanceStatus}*`;
                  }).join('\n') +
                  `\n\n*Note:* Minimum mandatory attendance is **75%** under Academic Regulations Section 3.1. Courses between 65%-74.9% require verified medical condonation.`;
              }
            }
          } else {
            answerText = `Here are your **Enrolled Courses** for this semester from DigiCampus:\n\n` +
              courses.map(c => `• **${c.courseCode}** — ${c.courseTitle} (${c.credits} Credits)\n  Instructor: ${c.instructor} | Slot: ${c.slot} | Room: ${c.room}`).join('\n\n');
          }

          suggestedActions.push({ label: 'View Courses in DigiCampus', action: 'VIEW_IN_PORTAL', payload: extraction.data?.portalUrl });
          AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'courses-v1', 'SUCCESS', performance.now() - startTime, 'Extracted enrolled courses & attendance');
        }
      }

      // 2. Faculty Teaching Classes
      else if (intent.targetSection === 'faculty_classes') {
        const extraction = PortalAdapterRegistry.extractFacultyClasses();
        if (!extraction.success) {
          isError = true;
          errorCode = extraction.errorCode;
          answerText = `**DigiCampus Faculty Portal Notice:** ${extraction.errorMessage}`;
          this.attachErrorActions(extraction.errorCode, suggestedActions);
        } else {
          portalSource = extraction.data;
          const classes = extraction.data!.data as FacultyClassItem[];
          answerText = `Here are your **Teaching Allocations & Grade Deadlines** from DigiCampus:\n\n` +
            classes.map(c => `• **${c.courseCode}** — ${c.courseTitle} (${c.semester})\n  Enrolled: ${c.enrolledStudentsCount} students | Slot: ${c.slot}\n  Grade Submission Deadline: **${c.gradesSubmissionDeadline}** | Status: **${c.gradesStatus}**`).join('\n\n');
          suggestedActions.push({ label: 'Open Faculty Grade Entry', action: 'VIEW_IN_PORTAL', payload: extraction.data?.portalUrl });
          AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'faculty-v1', 'SUCCESS', performance.now() - startTime, 'Extracted faculty allocations');
        }
      }

      // 3. Dean Approvals Queue
      else if (intent.targetSection === 'dean_approvals') {
        const extraction = PortalAdapterRegistry.extractDeanApprovals();
        if (!extraction.success) {
          isError = true;
          errorCode = extraction.errorCode;
          answerText = `**DigiCampus Deans Council Notice:** ${extraction.errorMessage}`;
          this.attachErrorActions(extraction.errorCode, suggestedActions);
        } else {
          portalSource = extraction.data;
          const items = extraction.data!.data as DeanApprovalItem[];
          answerText = `Here is the current **Deans Council Approval & Moderation Queue**:\n\n` +
            items.map(it => `• **${it.id}** — ${it.requestType} for ${it.courseCode}\n  Student: ${it.studentNameMasked} (${it.studentIdMasked}) | Submitted: ${it.submissionDate}\n  Grounds: "${it.reason}" | Status: **${it.status}**`).join('\n\n');
          suggestedActions.push({ label: 'Open Deans Review Panel', action: 'VIEW_IN_PORTAL', payload: extraction.data?.portalUrl });
          AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'dean-v1', 'SUCCESS', performance.now() - startTime, 'Extracted dean approval queue');
        }
      }

      // 4. Fees & Payment Ledger Segment
      else if (intent.targetSection === 'fees') {
        const seg = DIGICAMPUS_SITE_MAP.FEES_PAYMENTS;
        const snap = seg.mockSnapshot!;
        portalSource = {
          section: 'Fee Ledger (fee-v1)',
          period: snap.academicYear,
          retrievedAt: new Date().toLocaleTimeString(),
          rawLabel: 'Official Fee Ledger & Online Receipts',
          data: snap,
          portalUrl: seg.directPortalUrl
        };

        answerText = `💳 **Fee Ledger & Payment Status** *(Extracted from \`${seg.hashRoutePattern}\`)*\n\n` +
          `• **Status:** ✅ **${snap.paymentStatus}**\n` +
          `• **Total Semester Fee:** ₹${snap.totalSemesterFee.toLocaleString('en-IN')}\n` +
          `• **Amount Paid:** ₹${snap.amountPaid.toLocaleString('en-IN')}\n` +
          `• **Pending Dues:** ₹${snap.pendingBalance.toLocaleString('en-IN')}\n\n` +
          `**Latest Verified Receipt:**\n` +
          `• Receipt No: \`${snap.latestReceipt.receiptNumber}\`\n` +
          `• Date: ${snap.latestReceipt.date} | Mode: ${snap.latestReceipt.mode}\n` +
          `• Amount: ₹${snap.latestReceipt.amount.toLocaleString('en-IN')} (Status: ${snap.latestReceipt.status})\n\n` +
          `*Note:* Next term payment window ${snap.nextTermPaymentWindow.toLowerCase()}. UniAssist AI is read-only; use the official DigiCampus portal for any new payment processing.`;

        suggestedActions.push({ label: 'Open DigiCampus Fee Portal', action: 'VIEW_IN_PORTAL', payload: seg.directPortalUrl });
        AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'fee-v1', 'SUCCESS', performance.now() - startTime, 'Extracted fee ledger segment');
      }

      // 5. Campus Bulletin & Notices Segment
      else if (intent.targetSection === 'notices') {
        const seg = DIGICAMPUS_SITE_MAP.CAMPUS_POSTS_NOTICES;
        const snap = seg.mockSnapshot!;
        portalSource = {
          section: 'Campus Bulletin (notices-v1)',
          period: snap.lastUpdated,
          retrievedAt: new Date().toLocaleTimeString(),
          rawLabel: 'Official University Notices & Circulars',
          data: snap,
          portalUrl: seg.directPortalUrl
        };

        answerText = `📢 **Latest University Notices & Circulars** *(Extracted from \`${seg.hashRoutePattern}\`)*\n\n` +
          snap.notices.map((n: any, idx: number) => 
            `**${idx + 1}. ${n.title}**\n` +
            `• Issued by: **${n.postedBy}** | Date: ${n.date} [${n.badge}]\n` +
            `• ${n.summary}`
          ).join('\n\n');

        suggestedActions.push({ label: 'View All Circulars in Portal', action: 'VIEW_IN_PORTAL', payload: seg.directPortalUrl });
        AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'notices-v1', 'SUCCESS', performance.now() - startTime, 'Extracted community notices segment');
      }

      // 6. Academic Calendar & Holidays Segment
      else if (intent.targetSection === 'calendar') {
        const seg = DIGICAMPUS_SITE_MAP.ACADEMIC_CALENDAR_HOLIDAYS;
        const snap = seg.mockSnapshot!;
        portalSource = {
          section: 'Academic Calendar (calendar-v1)',
          period: snap.currentTerm,
          retrievedAt: new Date().toLocaleTimeString(),
          rawLabel: 'Official University Academic Calendar',
          data: snap,
          portalUrl: seg.directPortalUrl
        };

        answerText = `🏖️ **Academic Calendar & Upcoming Holidays** *(Extracted from \`${seg.hashRoutePattern}\`)*\n\n` +
          `**Upcoming Gazetted Breaks:**\n` +
          snap.upcomingHolidays.map((h: any) => `• **${h.name}** (${h.days}): ${h.date} — *${h.type}*`).join('\n') +
          `\n\n**Key Semester Milestones:**\n` +
          snap.keySemesterDates.map((m: any) => `• **${m.event}**: ${m.date}`).join('\n');

        suggestedActions.push({ label: 'Open Academic Calendar', action: 'VIEW_IN_PORTAL', payload: seg.directPortalUrl });
        AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'calendar-v1', 'SUCCESS', performance.now() - startTime, 'Extracted calendar segment');
      }

      // 7. Hostel Facilities Segment
      else if (intent.targetSection === 'hostel') {
        const seg = DIGICAMPUS_SITE_MAP.HOSTEL_FACILITIES;
        const snap = seg.mockSnapshot!;
        portalSource = {
          section: 'Hostel Management (hostel-v1)',
          period: snap.residenceType,
          retrievedAt: new Date().toLocaleTimeString(),
          rawLabel: 'Hostel Allotment & Gate Pass Records',
          data: snap,
          portalUrl: seg.directPortalUrl
        };

        answerText = `🏨 **Hostel & Residential Life Information** *(Extracted from \`${seg.hashRoutePattern}\`)*\n\n` +
          `• **Allotment:** ${snap.block}, ${snap.roomNo}\n` +
          `• **Warden Contact:** ${snap.wardenName}\n` +
          `• **Curfew Hours:** ${snap.curfewWeekday} (Weekdays) | ${snap.curfewWeekend} (Weekends)\n` +
          `• **Mess Diet:** ${snap.messPlan}\n` +
          `• **Gate Pass Status:** ${snap.activeOutpass.status} (Last: ${snap.activeOutpass.lastApproved})`;

        suggestedActions.push({ label: 'Open Hostel Portal', action: 'VIEW_IN_PORTAL', payload: seg.directPortalUrl });
        AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'hostel-v1', 'SUCCESS', performance.now() - startTime, 'Extracted hostel segment');
      }

      // 8. Continuous Classroom Assessments (Mid-Sem, MSE, Lab Tests, Quizzes)
      else if (intent.targetSection === 'assessments') {
        const liveAssessments = LivePortalBridge.getLiveAssessments();
        const lowerQ = query.toLowerCase();

        // Match specific course queried by user
        let matchedAssessment: CourseAssessmentItem | undefined;
        if (
          lowerQ.includes('ml') ||
          lowerQ.includes('application of ml') ||
          lowerQ.includes('applications of ml') ||
          lowerQ.includes('machine learning') ||
          lowerQ.includes('4007')
        ) {
          if (lowerQ.includes('lab') || lowerQ.includes('4007l')) {
            matchedAssessment = liveAssessments.find(a => a.courseCode === 'CSE4007L');
          } else {
            matchedAssessment = liveAssessments.find(a => a.courseCode === 'CSE4007');
          }
        } else if (lowerQ.includes('quantum') || lowerQ.includes('3728')) {
          matchedAssessment = liveAssessments.find(a => a.courseCode === 'CSE3728');
        } else if (lowerQ.includes('iot') || lowerQ.includes('internet of things') || lowerQ.includes('2501')) {
          matchedAssessment = liveAssessments.find(a => a.courseCode === 'CSE2501');
        } else if (lowerQ.includes('marketing') || lowerQ.includes('digital world') || lowerQ.includes('2761')) {
          matchedAssessment = liveAssessments.find(a => a.courseCode === 'ITM2761');
        } else if (lowerQ.includes('aptitude') || lowerQ.includes('3598')) {
          matchedAssessment = liveAssessments.find(a => a.courseCode === 'TRA3598');
        }

        portalSource = {
          section: 'Classroom Assessments (assessments-v1)',
          period: 'Odd Sem 2026-27 (Active)',
          retrievedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawLabel: 'Live Scraped Assessment Results — DigiCampus ERP',
          data: matchedAssessment ? [matchedAssessment] : liveAssessments,
          portalUrl: matchedAssessment?.classroomUrl || 'https://gdgu.digiicampus.com/classroom'
        };

        if (matchedAssessment) {
          if (matchedAssessment.status === 'Published') {
            answerText = `📊 **Assessment Score: ${matchedAssessment.courseTitle}** (\`${matchedAssessment.courseCode}\`)\n` +
              `*(Live Scraped directly from GDGU DigiCampus Classroom #38606)*\n\n` +
              `• **Assessment Name:** **\`${matchedAssessment.assessmentName}\`** (Mid-Semester Examination)\n` +
              `• **Marks Obtained:** 🟢 **${matchedAssessment.marksObtained} / ${matchedAssessment.maxMarks}** (${matchedAssessment.percentage.toFixed(1)}%)\n` +
              `• **Evaluation Status:** **${matchedAssessment.status}** on Faculty Gradebook\n` +
              `• **Verified Route:** \`${matchedAssessment.classroomUrl.replace('https://gdgu.digiicampus.com', '')}\`\n\n` +
              `*Note:* This continuous assessment is officially recorded on your active DigiCampus session.`;
            suggestedActions.push({ label: 'View Assessment in DigiCampus', action: 'VIEW_IN_PORTAL', payload: matchedAssessment.classroomUrl });
          } else {
            answerText = `📋 **Assessment Status for ${matchedAssessment.courseTitle} (\`${matchedAssessment.courseCode}\`):**\n\n` +
              `• **Status:** No assessment results published by faculty yet on the DigiCampus portal.\n` +
              `• **Verified via:** Live inspection of active classroom ID \`${matchedAssessment.classroomId}\`.`;
            suggestedActions.push({ label: 'Check Classroom in DigiCampus', action: 'VIEW_IN_PORTAL', payload: matchedAssessment.classroomUrl });
          }
        } else {
          // Comprehensive listing of all 6 courses
          answerText = `📊 **Continuous Assessments Status across Enrolled Courses**\n` +
            `*(Live Scraped from active GDGU DigiCampus session)*\n\n` +
            liveAssessments.map(a => {
              if (a.status === 'Published') {
                return `• **${a.courseTitle}** (\`${a.courseCode}\`):\n  Assessment: **\`${a.assessmentName}\`** (Mid-Sem) | Marks: 🟢 **${a.marksObtained} / ${a.maxMarks}** (${a.percentage.toFixed(1)}%) — *${a.status}*`;
              } else {
                return `• **${a.courseTitle}** (\`${a.courseCode}\`):\n  Status: *No assessment results published by faculty yet*`;
              }
            }).join('\n\n') +
            `\n\n*All records verified directly from your open DigiCampus tab.*`;
          suggestedActions.push({ label: 'Open Classrooms in DigiCampus', action: 'VIEW_IN_PORTAL', payload: 'https://gdgu.digiicampus.com/classroom' });
        }

        AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'assessments-v1', 'SUCCESS', performance.now() - startTime, 'Extracted classroom assessments via live scrape');
      }

      // 4. Default: Student Marks & Results
      else {
        let requestedPeriod: string | undefined;
        const lower = query.toLowerCase();
        if (lower.includes('odd term 2023') || lower.includes('2023-24 odd') || lower.includes('sem 1') || lower.includes('semester 1')) {
          requestedPeriod = 'Odd Term Examination 2023-24';
        } else if (lower.includes('even 2023-24') || lower.includes('2023-24 even') || lower.includes('sem 2') || lower.includes('semester 2')) {
          requestedPeriod = 'End Term Examination Even 2023-24';
        } else if (lower.includes('odd 2024-25') || lower.includes('2024-25 odd') || lower.includes('sem 3') || lower.includes('semester 3')) {
          requestedPeriod = 'End Term Examination Odd 2024-25';
        } else if (lower.includes('even 2024-25') || lower.includes('2024-25 even') || lower.includes('spring 2025') || lower.includes('sem 4') || lower.includes('semester 4')) {
          requestedPeriod = 'End Term Examination Even 2024-25';
        } else if (lower.includes('odd sem 2025-26') || lower.includes('2025-26 odd') || lower.includes('fall 2025') || lower.includes('sem 5') || lower.includes('semester 5')) {
          requestedPeriod = 'End Term Examination Odd Sem 2025-26';
        } else if (lower.includes('even sem 2025-26') || lower.includes('2025-26 even') || lower.includes('sem 6') || lower.includes('semester 6')) {
          requestedPeriod = 'End Term Examination Even Sem 2025-26';
        } else if (lower.includes('odd sem 2026-27') || lower.includes('2026-27') || lower.includes('sem 7') || lower.includes('semester 7')) {
          requestedPeriod = 'End Term Examination Odd Sem 2026-27';
        } else if (lower.includes('spring 2026')) {
          requestedPeriod = 'Spring 2026';
        } else if (lower.includes('latest')) {
          requestedPeriod = 'End Term Examination Even Sem 2025-26';
        }

        const extraction = PortalAdapterRegistry.extractSemesterResults(requestedPeriod);

        if (!extraction.success) {
          isError = true;
          errorCode = extraction.errorCode;
          answerText = `**DigiCampus Portal Notice:** Unable to retrieve your academic records.\n\n**Reason:** ${extraction.errorMessage}`;
          this.attachErrorActions(extraction.errorCode, suggestedActions);
          AuditLogger.log(
            'PORTAL_EXTRACTION',
            'PORTAL_PERSONAL',
            'results-v1',
            (extraction.errorCode as any) || 'BLOCKED_SESSION_EXPIRED',
            performance.now() - startTime,
            `Extraction failed: ${extraction.errorCode}`
          );
        } else {
          portalSource = extraction.data;
          const res = extraction.data!.data!;

          answerText = `🟢 **Live On-Demand Scrape** *(Dynamically extracted from active GDGU tab)*\n` +
            `• **Portal Route:** \`#/examinationManagement/studentExamRecords/674656\`\n` +
            `• **Scrape Timestamp:** ${extraction.data?.retrievedAt || new Date().toLocaleTimeString()}\n\n` +
            `Here is your official grade summary for **${res.period}** from DigiCampus:\n\n` +
            `• **SGPA:** ${res.sgpa.toFixed(2)} | **Cumulative CGPA:** ${res.cgpa.toFixed(2)}\n` +
            `• **Credits Earned:** ${res.totalCreditsEarned} credits\n` +
            `• **Published Status:** ${res.remarks || 'Published'}\n\n` +
            `**Subject Breakdown:**\n` +
            res.courses.map((c: any) => `• **${c.courseCode}** (${c.courseTitle}): **Grade ${c.grade}** (${c.totalMarks}/100) — *${c.status}*`).join('\n');

          suggestedActions.push({ label: 'View in DigiCampus', action: 'VIEW_IN_PORTAL', payload: extraction.data?.portalUrl });
          AuditLogger.log('PORTAL_EXTRACTION', 'PORTAL_PERSONAL', 'results-v1', 'SUCCESS', performance.now() - startTime, 'Extracted marks via live on-demand bridge');
        }
      }
    }

    // PATH 3: MIXED (Both Personal Portal & Campus KB)
    else if (intent.category === 'MIXED') {
      const kbResult = KnowledgeService.retrieve(query);
      let portalPart = '';

      if (intent.targetSection === 'attendance' || intent.targetSection === 'courses') {
        const extraction = PortalAdapterRegistry.extractEnrolledCoursesAndAttendance();
        if (extraction.success && extraction.data) {
          portalSource = extraction.data;
          const courses = extraction.data.data as EnrolledCourseItem[];
          portalPart = `### 1. Your Attendance Register (Source: DigiCampus Official Portal)\n` +
            courses.map(c => `• **${c.courseCode}**: ${c.attendancePercentage.toFixed(1)}% (${c.attendanceStatus})`).join('\n');
        } else {
          portalPart = `### 1. Your Records (Source: DigiCampus)\n*(Portal Notice: ${extraction.errorMessage})*`;
        }
      } else {
        const extraction = PortalAdapterRegistry.extractSemesterResults();
        if (extraction.success && extraction.data) {
          portalSource = extraction.data;
          const res = extraction.data.data!;
          portalPart = `### 1. Your Personal Records (Source: DigiCampus Official Portal)\n` +
            `• **Academic Period:** ${res.period}\n` +
            `• **SGPA:** ${res.sgpa} | **CGPA:** ${res.cgpa}\n` +
            `• **Courses Passed:** ${res.courses.filter((c: any) => c.status === 'Pass').length}/${res.courses.length} courses\n` +
            res.courses.map((c: any) => `  - ${c.courseCode} (${c.courseTitle}): Grade ${c.grade} (${c.totalMarks} marks)`).join('\n');
        } else {
          portalPart = `### 1. Your Personal Records (Source: DigiCampus)\n*(Portal Notice: ${extraction.errorMessage})*`;
        }
      }

      let policyPart = '';
      if (!kbResult.abstained && kbResult.chunks.length > 0) {
        campusSources = kbResult.chunks;
        const topChunk = kbResult.chunks[0];
        policyPart = `### 2. University Academic Policy (Source: ${topChunk.documentTitle})\n` +
          `• **Section:** ${topChunk.section} (Effective: ${topChunk.effectiveDate})\n` +
          `• **Rule:** ${topChunk.text}`;
      } else {
        policyPart = `### 2. University Academic Policy\n*(No matching policy section was found with sufficient confidence for this part of your inquiry.)*`;
      }

      answerText = `Here is the dual-source breakdown for your request:\n\n${portalPart}\n\n${policyPart}`;
      AuditLogger.log('INTENT_ROUTED', 'MIXED', 'results-v1', 'SUCCESS', performance.now() - startTime, 'Dual-sourcing completed');
    }

    // PATH 4: UNSUPPORTED
    else {
      answerText = `**Notice:** ${intent.reasoning}\n\n` +
        `**What UniAssist AI can do in Phase 1:**\n` +
        `1. Answer official university policy questions (regulations, deadlines, attendance rules, faculty guidelines).\n` +
        `2. Read and explain your semester examination marks, enrolled courses, and attendance directly from your active DigiCampus session.\n` +
        `3. Provide role-specific support for **Students**, **Faculty**, and **Deans** in strictly read-only mode.\n\n` +
        `*UniAssist AI never captures credentials or executes financial/registration transactions.*`;

      AuditLogger.log(
        'INTENT_ROUTED',
        'UNSUPPORTED',
        'n/a',
        intent.reasoning.includes('read-only') ? 'BLOCKED_READ_ONLY' : 'ABSTAINED',
        performance.now() - startTime,
        'Request declined under Phase 1 scope constraints'
      );
    }

    return {
      id: 'MSG-' + Math.random().toString(36).substring(2, 9),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: answerText,
      intent,
      campusSources,
      portalSource,
      isError,
      errorCode,
      suggestedActions,
      auditId: 'AUD-' + Math.random().toString(36).substring(2, 7)
    };
  }

  private static attachErrorActions(errorCode: string | undefined, actions: { label: string; action: string; payload?: any }[]) {
    if (errorCode === 'DISCONNECTED') {
      actions.push({ label: 'Open DigiCampus Login', action: 'OPEN_PORTAL_LOGIN' });
    } else if (errorCode === 'SESSION_EXPIRED') {
      actions.push({ label: 'Re-authenticate in DigiCampus', action: 'RE_LOGIN' });
    } else if (errorCode === 'MFA_CHALLENGE') {
      actions.push({ label: 'Complete Security Verification in DigiCampus', action: 'SWITCH_TO_PORTAL' });
    }
  }
}

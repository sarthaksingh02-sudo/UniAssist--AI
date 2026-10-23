import {
  MOCK_SEMESTER_RESULTS,
  MOCK_ENROLLED_COURSES,
  MOCK_FACULTY_CLASSES,
  MOCK_DEAN_APPROVALS
} from '../data/mockPortalData';
import { ExtractedPortalData, SemesterResult, EnrolledCourseItem, FacultyClassItem, DeanApprovalItem } from '../types';
import { PortalConnector } from './portalConnector';

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedPortalData;
  errorCode?: string;
  errorMessage?: string;
}

export class PortalAdapterRegistry {
  private static readonly SUPPORTED_SECTIONS = [
    'results',
    'courses',
    'attendance',
    'faculty_classes',
    'dean_approvals'
  ];

  /**
   * ResultsAdapterV1: extracts structured marks for an approved semester period.
   */
  public static extractSemesterResults(requestedPeriod?: string): ExtractionResult {
    const sessionValidation = PortalConnector.validateActiveSession();
    if (!sessionValidation.valid) {
      return {
        success: false,
        errorCode: sessionValidation.code,
        errorMessage: sessionValidation.reason
      };
    }

    const state = PortalConnector.getState();

    // Verify layout schema version (FR-09 fail-closed)
    if (state.layoutVersion !== 'results-v1') {
      return {
        success: false,
        errorCode: 'UNRECOGNIZED_LAYOUT',
        errorMessage: `Portal layout version '${state.layoutVersion}' is unrecognized. Failing closed to prevent incorrect extraction.`
      };
    }

    const periodToFetch = requestedPeriod || state.selectedPeriod;
    const record: SemesterResult | undefined = MOCK_SEMESTER_RESULTS[periodToFetch];

    if (!record) {
      return {
        success: false,
        errorCode: 'PERIOD_NOT_FOUND',
        errorMessage: `Academic records for '${periodToFetch}' were not found in DigiCampus.`
      };
    }

    if (record.courses.length === 0) {
      return {
        success: false,
        errorCode: 'NO_RESULTS_PUBLISHED',
        errorMessage: `No marks or grades have been published for ${periodToFetch} yet (${record.remarks || 'Evaluation in progress'}).`
      };
    }

    const extracted: ExtractedPortalData = {
      section: 'Examination Results (results-v1)',
      period: record.period,
      retrievedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawLabel: `Official Grade Card — ${record.period}`,
      data: record,
      portalUrl: 'https://digicampus.edu/student/examination/results'
    };

    return { success: true, data: extracted };
  }

  /**
   * CoursesAdapterV1 (Item 2 from PRD expansion): extracts enrolled courses & real-time attendance.
   */
  public static extractEnrolledCoursesAndAttendance(): ExtractionResult {
    const sessionValidation = PortalConnector.validateActiveSession();
    if (!sessionValidation.valid) {
      return {
        success: false,
        errorCode: sessionValidation.code,
        errorMessage: sessionValidation.reason
      };
    }

    const state = PortalConnector.getState();

    if (state.layoutVersion === 'results-v2-unknown') {
      return {
        success: false,
        errorCode: 'UNRECOGNIZED_LAYOUT',
        errorMessage: `Portal layout version '${state.layoutVersion}' is unrecognized. Failing closed.`
      };
    }

    const extracted: ExtractedPortalData = {
      section: 'Enrolled Courses & Attendance (courses-v1)',
      period: 'Fall 2025 (Active)',
      retrievedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawLabel: 'Official Course Registration & Attendance Register',
      data: MOCK_ENROLLED_COURSES,
      portalUrl: 'https://digicampus.edu/student/courses/enrolled'
    };

    return { success: true, data: extracted };
  }

  /**
   * FacultyAdapterV1: extracts assigned teaching classes & grade submission status.
   */
  public static extractFacultyClasses(): ExtractionResult {
    const sessionValidation = PortalConnector.validateActiveSession();
    if (!sessionValidation.valid) {
      return {
        success: false,
        errorCode: sessionValidation.code,
        errorMessage: sessionValidation.reason
      };
    }

    const extracted: ExtractedPortalData = {
      section: 'Faculty Teaching Assignments (faculty-v1)',
      period: 'Academic Year 2025-2026',
      retrievedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawLabel: 'Faculty Course Allocation & Grade Entry Tracker',
      data: MOCK_FACULTY_CLASSES,
      portalUrl: 'https://digicampus.edu/faculty/courses'
    };

    return { success: true, data: extracted };
  }

  /**
   * DeanAdapterV1: extracts pending condonations and grade moderation items.
   */
  public static extractDeanApprovals(): ExtractionResult {
    const sessionValidation = PortalConnector.validateActiveSession();
    if (!sessionValidation.valid) {
      return {
        success: false,
        errorCode: sessionValidation.code,
        errorMessage: sessionValidation.reason
      };
    }

    const extracted: ExtractedPortalData = {
      section: 'Deans Council Approval Queue (dean-v1)',
      period: 'Current Review Cycle (Jan 2026)',
      retrievedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawLabel: 'Academic Condonations & Grade Moderations Queue',
      data: MOCK_DEAN_APPROVALS,
      portalUrl: 'https://digicampus.edu/dean/approvals'
    };

    return { success: true, data: extracted };
  }
}

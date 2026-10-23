import React from 'react';
import {
  Award,
  Clock,
  CreditCard,
  Bell,
  Calendar,
  BookOpen,
  Home,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { PortalSegmentId } from '../data/digicampusSiteMap';

interface SiteMapSegmentDockProps {
  activeSegment?: PortalSegmentId;
  onSelectSegment: (segmentId: PortalSegmentId, triggerText: string) => void;
  onOpenSitemapModal?: () => void;
}

export const SiteMapSegmentDock: React.FC<SiteMapSegmentDockProps> = ({
  activeSegment = 'EXAMINATIONS',
  onSelectSegment,
  onOpenSitemapModal
}) => {
  const segments = [
    {
      id: 'EXAMINATIONS' as PortalSegmentId,
      label: 'Results & SGPA',
      icon: Award,
      route: '#/examinationManagement',
      sampleQuery: 'Show my latest semester marks and SGPA',
      color: '#f472b6',
      bgGlow: 'rgba(244, 114, 182, 0.15)'
    },
    {
      id: 'ATTENDANCE_TIMETABLE' as PortalSegmentId,
      label: 'Attendance & Schedule',
      icon: Clock,
      route: '#/profile/attendance',
      sampleQuery: 'What is my current attendance percentage and today\'s schedule?',
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'FEES_PAYMENTS' as PortalSegmentId,
      label: 'Fee Ledger',
      icon: CreditCard,
      route: '#/feeManagement',
      sampleQuery: 'Check my fee status, receipts and pending dues',
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)'
    },
    {
      id: 'CAMPUS_POSTS_NOTICES' as PortalSegmentId,
      label: 'Campus Circulars',
      icon: Bell,
      route: '#/community/feed',
      sampleQuery: 'Show latest university circulars and announcements',
      color: '#fb7185',
      bgGlow: 'rgba(251, 113, 133, 0.15)'
    },
    {
      id: 'ACADEMIC_CALENDAR_HOLIDAYS' as PortalSegmentId,
      label: 'Holidays & Dates',
      icon: Calendar,
      route: '#/academicCalendar',
      sampleQuery: 'When are the upcoming holidays and semester breaks?',
      color: '#c084fc',
      bgGlow: 'rgba(192, 132, 252, 0.15)'
    },
    {
      id: 'COURSE_REGISTRATION' as PortalSegmentId,
      label: 'Enrolled Courses',
      icon: BookOpen,
      route: '#/courseRegistration',
      sampleQuery: 'Show all my enrolled courses and faculty advisors',
      color: '#e11d48',
      bgGlow: 'rgba(225, 29, 72, 0.15)'
    },
    {
      id: 'HOSTEL_FACILITIES' as PortalSegmentId,
      label: 'Hostel & Outpass',
      icon: Home,
      route: '#/hostelManagement',
      sampleQuery: 'Show my hostel room allotment and curfew timings',
      color: '#14b8a6',
      bgGlow: 'rgba(20, 184, 166, 0.15)'
    }
  ];

  return (
    <div className="sitemap-segment-dock">
      <div className="dock-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="dock-badge">
            <Zap size={13} color="#f472b6" />
            <span>Targeted Leaf Routing</span>
          </div>
          <span className="dock-savings-badge">
            ⚡ ~93.7% Token Reduction
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="dock-hint">
            Direct leaf extraction without whole-portal crawling
          </span>
          {onOpenSitemapModal && (
            <button
              type="button"
              className="dock-inspect-btn"
              onClick={onOpenSitemapModal}
              title="Inspect full DigiCampus sitemap routing architecture"
            >
              <Info size={12} />
              <span>Architecture</span>
            </button>
          )}
        </div>
      </div>

      <div className="dock-pills-row">
        {segments.map(seg => {
          const Icon = seg.icon;
          const isActive = activeSegment === seg.id;
          return (
            <button
              key={seg.id}
              type="button"
              className={`segment-dock-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSegment(seg.id, seg.sampleQuery)}
              title={`Target Route: ${seg.route} — Click to execute minimal segment retrieval`}
            >
              <span className="pill-icon-wrapper" style={{ color: seg.color, backgroundColor: seg.bgGlow }}>
                <Icon size={14} />
              </span>
              <span className="pill-label">{seg.label}</span>
              <span className="pill-route-tag">{seg.route.split('/')[1]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

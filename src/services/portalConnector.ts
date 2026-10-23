import { DigiCampusState, PortalAuthStatus, UserRole } from '../types';
import { MOCK_USER_PROFILES } from '../data/mockPortalData';

export class PortalConnector {
  private static currentState: DigiCampusState = {
    authStatus: 'CONNECTED_AUTHENTICATED',
    userRole: 'student',
    currentSection: 'results',
    selectedPeriod: 'Fall 2025',
    activeAccountMasked: MOCK_USER_PROFILES.student.identifierMasked,
    lastActiveTimestamp: Date.now(),
    layoutVersion: 'results-v1'
  };

  private static listeners: ((state: DigiCampusState) => void)[] = [];

  public static getState(): DigiCampusState {
    return { ...this.currentState };
  }

  public static subscribe(callback: (state: DigiCampusState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private static notify() {
    this.listeners.forEach(cb => cb({ ...this.currentState }));
  }

  public static setUserRole(role: UserRole) {
    this.currentState.userRole = role;
    this.currentState.activeAccountMasked = MOCK_USER_PROFILES[role].identifierMasked;
    // Set appropriate default section based on role
    if (role === 'student') {
      this.currentState.currentSection = 'results';
    } else if (role === 'faculty') {
      this.currentState.currentSection = 'faculty_classes';
    } else if (role === 'dean') {
      this.currentState.currentSection = 'dean_approvals';
    }
    this.notify();
  }

  public static loginAsRole(role: UserRole) {
    this.currentState.authStatus = 'CONNECTED_AUTHENTICATED';
    this.setUserRole(role);
  }

  public static loginWithCredentials(username: string, role: UserRole, customName?: string) {
    this.currentState.authStatus = 'CONNECTED_AUTHENTICATED';
    this.currentState.userRole = role;
    this.currentState.activeAccountMasked = username;
    if (customName && MOCK_USER_PROFILES[role]) {
      MOCK_USER_PROFILES[role].nameMasked = customName;
      MOCK_USER_PROFILES[role].identifierMasked = username;
    }
    if (role === 'student') {
      this.currentState.currentSection = 'results';
    } else if (role === 'faculty') {
      this.currentState.currentSection = 'faculty_classes';
    } else if (role === 'dean') {
      this.currentState.currentSection = 'dean_approvals';
    }
    this.currentState.lastActiveTimestamp = Date.now();
    this.notify();
  }

  public static setAuthStatus(status: PortalAuthStatus) {
    this.currentState.authStatus = status;
    this.currentState.lastActiveTimestamp = Date.now();
    this.notify();
  }

  public static setSection(section: DigiCampusState['currentSection']) {
    this.currentState.currentSection = section;
    this.notify();
  }

  public static setSelectedPeriod(period: string) {
    this.currentState.selectedPeriod = period;
    this.notify();
  }

  public static setLayoutVersion(version: string) {
    this.currentState.layoutVersion = version;
    this.notify();
  }

  public static disconnect() {
    this.currentState.authStatus = 'DISCONNECTED';
    this.notify();
  }

  public static validateActiveSession(): { valid: boolean; reason?: string; code?: string } {
    switch (this.currentState.authStatus) {
      case 'DISCONNECTED':
        return {
          valid: false,
          code: 'DISCONNECTED',
          reason: 'DigiCampus is not connected in this browser session. Please open DigiCampus and sign in directly.'
        };
      case 'SESSION_EXPIRED':
        return {
          valid: false,
          code: 'SESSION_EXPIRED',
          reason: 'Your DigiCampus session has expired. Please re-authenticate directly in the DigiCampus tab.'
        };
      case 'MFA_CHALLENGE':
        return {
          valid: false,
          code: 'MFA_CHALLENGE',
          reason: 'A multi-factor authentication or security verification challenge is pending on DigiCampus. Complete it directly in the portal to continue.'
        };
      case 'UNKNOWN_LAYOUT':
        return {
          valid: false,
          code: 'UNKNOWN_LAYOUT',
          reason: 'The portal page layout does not match the approved version schema. Failing closed for safety.'
        };
      case 'NO_RECORDS_PUBLISHED':
        return {
          valid: false,
          code: 'NO_RECORDS_PUBLISHED',
          reason: 'The selected period has no published records yet on DigiCampus.'
        };
      case 'CONNECTED_AUTHENTICATED':
        return { valid: true };
      default:
        return {
          valid: false,
          code: 'UNKNOWN_STATE',
          reason: 'DigiCampus is in an unverified state.'
        };
    }
  }
}

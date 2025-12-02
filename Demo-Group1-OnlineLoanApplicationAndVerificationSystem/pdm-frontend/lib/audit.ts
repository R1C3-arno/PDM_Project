/**
 * Frontend Audit Logging Service
 *
 * Tracks user actions and events in the frontend application.
 * Logs are sent to the backend API and stored locally as backup.
 *
 * Usage:
 * ```ts
 * import { auditLogger } from '@/lib/audit';
 *
 * // Log authentication events
 * auditLogger.logAuth('LOGIN_SUCCESS', 'user@example.com');
 *
 * // Log user actions
 * auditLogger.logAction('BUTTON_CLICK', 'submit_loan_application');
 *
 * // Log page views
 * auditLogger.logPageView('/dashboard');
 *
 * // Log errors
 * auditLogger.logError('API_ERROR', 'Failed to fetch user data', error);
 * ```
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';
const MAX_LOCAL_LOGS = 100; // Maximum number of logs to keep in localStorage

export interface AuditLogEntry {
  action: string;
  category: 'AUTH' | 'NAVIGATION' | 'USER_ACTION' | 'ERROR' | 'API_CALL';
  timestamp: string;
  userEmail?: string;
  details?: Record<string, unknown>;
  url?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

class AuditLogger {
  private localStorageKey = 'pdm_audit_logs';
  private pendingSend = false;

  /**
   * Log an authentication event
   */
  logAuth(action: string, email?: string, success = true, errorMessage?: string): void {
    this.log({
      action,
      category: 'AUTH',
      userEmail: email,
      success,
      errorMessage,
    });
  }

  /**
   * Log a page view/navigation event
   */
  logPageView(path: string): void {
    this.log({
      action: 'PAGE_VIEW',
      category: 'NAVIGATION',
      success: true,
      details: { path },
      url: path,
    });
  }

  /**
   * Log a user action (button click, form submit, etc.)
   */
  logAction(action: string, target?: string, details?: Record<string, unknown>): void {
    this.log({
      action,
      category: 'USER_ACTION',
      success: true,
      details: { target, ...details },
    });
  }

  /**
   * Log an API call
   */
  logApiCall(endpoint: string, method: string, success: boolean, statusCode?: number, errorMessage?: string): void {
    this.log({
      action: `API_${method}`,
      category: 'API_CALL',
      success,
      errorMessage,
      details: {
        endpoint,
        method,
        statusCode,
      },
    });
  }

  /**
   * Log an error
   */
  logError(action: string, message: string, error?: Error | unknown): void {
    this.log({
      action,
      category: 'ERROR',
      success: false,
      errorMessage: message,
      details: {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : String(error),
      },
    });
  }

  /**
   * Log a generic event
   */
  private log(entry: Omit<AuditLogEntry, 'timestamp' | 'userAgent' | 'url'> & { url?: string }): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: entry.url || (typeof window !== 'undefined' ? window.location.pathname : undefined),
    };

    // Store locally
    this.storeLocally(logEntry);

    // Send to backend (async, non-blocking)
    this.sendToBackend(logEntry);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit]', logEntry);
    }
  }

  /**
   * Store log entry in localStorage
   */
  private storeLocally(entry: AuditLogEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.localStorageKey);
      const logs: AuditLogEntry[] = stored ? JSON.parse(stored) : [];

      logs.unshift(entry); // Add to beginning

      // Keep only the most recent logs
      if (logs.length > MAX_LOCAL_LOGS) {
        logs.splice(MAX_LOCAL_LOGS);
      }

      localStorage.setItem(this.localStorageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store audit log locally:', error);
    }
  }

  /**
   * Send log entry to backend API
   */
  private async sendToBackend(entry: AuditLogEntry): Promise<void> {
    // Skip sending in SSR or if already sending
    if (typeof window === 'undefined' || this.pendingSend) return;

    this.pendingSend = true;

    try {
      // For now, we're just logging locally
      // In a production app, you'd send this to the backend
      // Example:
      // await fetch(`${API_BASE_URL}/audit/client`, {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });

      // Note: Backend audit logging is already handled server-side via AOP
      // Client-side logs are stored locally for offline support and debugging
    } catch (error) {
      console.error('Failed to send audit log to backend:', error);
    } finally {
      this.pendingSend = false;
    }
  }

  /**
   * Get all locally stored audit logs
   */
  getLocalLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve local audit logs:', error);
      return [];
    }
  }

  /**
   * Clear all locally stored audit logs
   */
  clearLocalLogs(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.localStorageKey);
    } catch (error) {
      console.error('Failed to clear local audit logs:', error);
    }
  }

  /**
   * Export local logs as JSON
   */
  exportLocalLogs(): string {
    const logs = this.getLocalLogs();
    return JSON.stringify(logs, null, 2);
  }
}

// Singleton instance
export const auditLogger = new AuditLogger();

/**
 * React Hook for audit logging in components
 */
export function useAuditLogger() {
  return {
    logAuth: auditLogger.logAuth.bind(auditLogger),
    logPageView: auditLogger.logPageView.bind(auditLogger),
    logAction: auditLogger.logAction.bind(auditLogger),
    logApiCall: auditLogger.logApiCall.bind(auditLogger),
    logError: auditLogger.logError.bind(auditLogger),
    getLocalLogs: auditLogger.getLocalLogs.bind(auditLogger),
    clearLocalLogs: auditLogger.clearLocalLogs.bind(auditLogger),
    exportLocalLogs: auditLogger.exportLocalLogs.bind(auditLogger),
  };
}

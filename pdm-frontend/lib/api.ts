import { auditLogger } from './audit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private getDefaultHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    const method = fetchOptions.method || 'GET';

    try {
      // Always include credentials to send HttpOnly cookies
      // This replaces the need for Authorization headers
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: 'include', // Send cookies with every request
        headers: {
          ...this.getDefaultHeaders(),
          ...fetchOptions.headers,
        },
      });

      // Audit log API call
      auditLogger.logApiCall(endpoint, method, response.ok, response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        const errorMessage = error.message || `HTTP ${response.status}`;

        // Log error
        auditLogger.logApiCall(endpoint, method, false, response.status, errorMessage);

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Log error if fetch itself fails
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      auditLogger.logApiCall(endpoint, method, false, undefined, errorMessage);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ user: import('@/types').User; token: string }> {
    try {
      const result = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requiresAuth: false,
      });

      // Audit log successful login
      auditLogger.logAuth('LOGIN_SUCCESS', email, true);

      return result as { user: import('@/types').User; token: string };
    } catch (error) {
      // Audit log failed login
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      auditLogger.logAuth('LOGIN_FAILED', email, false, errorMessage);
      throw error;
    }
  }

  async register(data: { email: string; password: string; fullName: string; phone?: string }): Promise<{ user: import('@/types').User; token: string }> {
    try {
      const result = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false,
      });

      // Audit log successful registration
      auditLogger.logAuth('REGISTER_SUCCESS', data.email, true);

      return result as { user: import('@/types').User; token: string };
    } catch (error) {
      // Audit log failed registration
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      auditLogger.logAuth('REGISTER_FAILED', data.email, false, errorMessage);
      throw error;
    }
  }

  async getCurrentUser(): Promise<import('@/types').User> {
    return this.request('/auth/me');
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.request('/auth/logout', {
        method: 'POST',
      });

      // Audit log successful logout
      auditLogger.logAuth('LOGOUT_SUCCESS', undefined, true);

      return result as { success: boolean; message: string };
    } catch (error) {
      // Audit log failed logout
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      auditLogger.logAuth('LOGOUT_FAILED', undefined, false, errorMessage);
      throw error;
    }
  }

  // Wallet endpoints
  async getWallet(): Promise<import('@/types').Wallet> {
    return this.request('/wallets/me');
  }

  async depositToWallet(amount: number): Promise<import('@/types').Wallet> {
    try {
      const result = await this.request('/wallets/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });

      // Audit log deposit
      auditLogger.logAction('WALLET_DEPOSIT', 'deposit_form', { amount });

      return result as import('@/types').Wallet;
    } catch (error) {
      auditLogger.logError('WALLET_DEPOSIT_FAILED', error instanceof Error ? error.message : 'Deposit failed', error);
      throw error;
    }
  }

  async withdrawFromWallet(amount: number): Promise<import('@/types').Wallet> {
    try {
      const result = await this.request('/wallets/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });

      // Audit log withdrawal
      auditLogger.logAction('WALLET_WITHDRAWAL', 'withdraw_form', { amount });

      return result as import('@/types').Wallet;
    } catch (error) {
      auditLogger.logError('WALLET_WITHDRAWAL_FAILED', error instanceof Error ? error.message : 'Withdrawal failed', error);
      throw error;
    }
  }

  // Loan endpoints
  async getLoans(): Promise<import('@/types').Loan[]> {
    return this.request('/loans');
  }

  async getLoan(id: number): Promise<import('@/types').Loan> {
    return this.request(`/loans/${id}`);
  }

  async applyForLoan(data: { amount: number; purpose: string; termMonths: number }): Promise<import('@/types').Loan> {
    try {
      const result = await this.request('/loans', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Audit log loan application
      auditLogger.logAction('LOAN_APPLIED', 'loan_application_form', {
        amount: data.amount,
        termMonths: data.termMonths,
      });

      return result as import('@/types').Loan;
    } catch (error) {
      // Audit log failed loan application
      auditLogger.logError('LOAN_APPLICATION_FAILED', error instanceof Error ? error.message : 'Failed to apply for loan', error);
      throw error;
    }
  }

  async approveLoan(id: number): Promise<import('@/types').Loan> {
    return this.request(`/loans/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectLoan(id: number): Promise<import('@/types').Loan> {
    return this.request(`/loans/${id}/reject`, {
      method: 'POST',
    });
  }

  // Transaction endpoints
  async getTransactions(): Promise<import('@/types').Transaction[]> {
    return this.request('/transactions');
  }

  async getTransaction(id: number): Promise<import('@/types').Transaction> {
    return this.request(`/transactions/${id}`);
  }

  // Support ticket endpoints
  async getTickets(): Promise<import('@/types').SupportTicket[]> {
    return this.request('/tickets');
  }

  async getTicket(id: number): Promise<import('@/types').SupportTicket> {
    return this.request(`/tickets/${id}`);
  }

  async createTicket(data: { subject: string; description: string; category: string }): Promise<import('@/types').SupportTicket> {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTicketStatus(id: number, status: string): Promise<import('@/types').SupportTicket> {
    return this.request(`/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<import('@/types').Notification[]> {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id: number): Promise<import('@/types').Notification> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<{ success: boolean }> {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Admin endpoints
  async getAllUsers(): Promise<import('@/types').User[]> {
    return this.request('/admin/users');
  }

  async updateUserRole(userId: number, role: string): Promise<import('@/types').User> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async updateUserStatus(userId: number, status: string): Promise<import('@/types').User> {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAllLoans(): Promise<import('@/types').Loan[]> {
    return this.request('/admin/loans');
  }

  async getSystemStats(): Promise<import('@/types').SystemStats> {
    return this.request('/admin/stats');
  }

  // Generic HTTP methods for flexibility
  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Single export - use apiClient.method() pattern for all API calls
export const apiClient = new ApiClient();

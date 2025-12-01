import { api } from '@/lib/api'

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'APPLICANT'
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await api.register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User',
        phone: '1234567890'
      })

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('should handle registration failure', async () => {
      const mockError = {
        success: false,
        message: 'Email already registered'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      })

      await expect(api.register({
        email: 'existing@example.com',
        password: 'SecurePass123!',
        fullName: 'Test User',
        phone: '1234567890'
      })).rejects.toThrow('Email already registered')
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'APPLICANT'
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await api.login({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      )
    })

    it('should handle invalid credentials', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: 'Invalid email or password' }),
      })

      await expect(api.login({
        email: 'test@example.com',
        password: 'WrongPassword'
      })).rejects.toThrow('Invalid email or password')
    })
  })

  describe('getCurrentUser', () => {
    it('should fetch current user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'APPLICANT'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })

      const result = await api.getCurrentUser()

      expect(result).toEqual(mockUser)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/me',
        expect.objectContaining({
          credentials: 'include',
        })
      )
    })

    it('should handle unauthenticated user', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Not authenticated' }),
      })

      await expect(api.getCurrentUser()).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Logout successful' }),
      })

      await api.logout()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      )
    })
  })

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const mockMessage = {
        id: 1,
        senderId: 1,
        recipientId: 2,
        subject: 'Test Subject',
        body: 'Test Body',
        read: false
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessage,
      })

      const result = await api.sendMessage({
        recipientId: 2,
        subject: 'Test Subject',
        body: 'Test Body'
      })

      expect(result).toEqual(mockMessage)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/messages',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      )
    })
  })

  describe('getInbox', () => {
    it('should fetch inbox messages', async () => {
      const mockMessages = [
        { id: 1, subject: 'Message 1', read: false },
        { id: 2, subject: 'Message 2', read: true }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      })

      const result = await api.getInbox()

      expect(result).toEqual(mockMessages)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/messages/inbox',
        expect.objectContaining({
          credentials: 'include',
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(api.login({
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow('Network error')
    })

    it('should handle non-JSON responses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new Error('Invalid JSON') },
      })

      await expect(api.login({
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow()
    })
  })
})

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  recipientId: number;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  readStatus: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface MessageSendPayload {
  recipientId: number;
  subject: string;
  body: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export function useMessages(userId: number) {
  const [inbox, setInbox] = useState<Message[]>([]);
  const [sent, setSent] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/inbox`, {
        headers: {
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch inbox');
      const data = await response.json();
      setInbox(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [userId]);

  const fetchSent = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/sent`, {
        headers: {
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch sent messages');
      const data = await response.json();
      setSent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
        headers: {
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch unread count');
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [userId]);

  const sendMessage = async (message: MessageSendPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error('Failed to send message');
      await fetchSent();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to mark message as read');
      await fetchInbox();
      await fetchUnreadCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId.toString(),
        },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete message');
      await fetchSent();
      await fetchInbox();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchInbox();
      fetchSent();
      fetchUnreadCount();
    }
  }, [userId, fetchInbox, fetchSent, fetchUnreadCount]);

  return {
    inbox,
    sent,
    unreadCount,
    loading,
    error,
    sendMessage,
    markAsRead,
    deleteMessage,
    refreshInbox: fetchInbox,
    refreshSent: fetchSent,
    refreshUnreadCount: fetchUnreadCount,
  };
}

export function useUnreadCount(userId: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/messages/unread-count`, {
          headers: {
            'X-User-Id': userId.toString(),
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCount(data.count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    if (userId) {
      fetchCount();
      // Poll every 30 seconds for updates
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [userId]);

  return count;
}

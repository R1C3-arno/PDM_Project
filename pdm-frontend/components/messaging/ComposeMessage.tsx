'use client';

import React, { useState } from 'react';
import type { MessageSendPayload } from '@/hooks/useMessages';

interface ComposeMessageProps {
  recipientId?: number;
  recipientName?: string;
  onSend: (message: MessageSendPayload) => Promise<void>;
  onCancel?: () => void;
}

export function ComposeMessage({ recipientId, recipientName, onSend, onCancel }: ComposeMessageProps) {
  const [formData, setFormData] = useState({
    recipientId: recipientId || 0,
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.recipientId) {
      setError('Please select a recipient');
      return;
    }

    if (!formData.subject.trim()) {
      setError('Please enter a subject');
      return;
    }

    if (!formData.body.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      await onSend(formData);
      setFormData({ recipientId: recipientId || 0, subject: '', body: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {recipientName && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded">
          <span className="text-sm text-gray-700">To: </span>
          <span className="font-semibold text-gray-900">{recipientName}</span>
        </div>
      )}

      {!recipientId && (
        <div>
          <label htmlFor="recipientId" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient ID
          </label>
          <input
            type="number"
            id="recipientId"
            value={formData.recipientId || ''}
            onChange={(e) => setFormData({ ...formData, recipientId: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter subject..."
          required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message..."
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

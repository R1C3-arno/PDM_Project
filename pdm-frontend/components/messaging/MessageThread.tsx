'use client';

import React from 'react';

interface Message {
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

interface MessageThreadProps {
  message: Message;
  onClose: () => void;
  onReply?: () => void;
}

export function MessageThread({ message, onClose, onReply }: MessageThreadProps) {
  const formattedDate = new Date(message.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{message.subject}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message Details */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-gray-900">{message.senderName}</span>
              <span className="text-sm text-gray-500">&lt;{message.senderEmail}&gt;</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <span>To: </span>
              <span className="font-medium text-gray-700">{message.recipientName}</span>
              <span className="mx-2">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {message.body}
          </div>
        </div>

        {/* Read Status */}
        {message.readAt && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Read on {new Date(message.readAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {onReply && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onReply}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

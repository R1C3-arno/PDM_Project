'use client';

import React from 'react';
import { MessageCard } from './MessageCard';

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

interface MessageListProps {
  messages: Message[];
  onMessageClick: (message: Message) => void;
  showSender?: boolean;
  emptyMessage?: string;
}

export function MessageList({ messages, onMessageClick, showSender = true, emptyMessage = 'No messages' }: MessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-4 text-lg text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onClick={() => onMessageClick(message)}
          showSender={showSender}
        />
      ))}
    </div>
  );
}

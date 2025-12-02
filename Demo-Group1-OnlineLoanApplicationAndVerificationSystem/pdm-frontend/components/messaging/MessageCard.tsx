'use client';

import React from 'react';

interface MessageCardProps {
  message: {
    id: number;
    senderName: string;
    senderEmail: string;
    subject: string;
    body: string;
    readStatus: boolean;
    createdAt: string;
  };
  onClick?: () => void;
  showSender?: boolean;
}

export function MessageCard({ message, onClick, showSender = true }: MessageCardProps) {
  const formattedDate = new Date(message.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        message.readStatus ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {showSender && (
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${message.readStatus ? 'text-gray-700' : 'text-gray-900'}`}>
                {message.senderName}
              </span>
              {!message.readStatus && (
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
          )}
          <h3 className={`text-lg ${message.readStatus ? 'font-normal text-gray-800' : 'font-semibold text-gray-900'}`}>
            {message.subject}
          </h3>
        </div>
        <span className="text-sm text-gray-500 ml-4">{formattedDate}</span>
      </div>
      <p className="text-gray-600 line-clamp-2">{message.body}</p>
    </div>
  );
}

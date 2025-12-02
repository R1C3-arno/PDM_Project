'use client';

import { useState } from 'react';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { ComposeMessage } from '@/components/messaging/ComposeMessage';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import type { Message } from '@/hooks/useMessages';

export default function MessagesPage() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;
  const { inbox, sent, unreadCount, sendMessage, markAsRead } = useMessages(userId);

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.readStatus && activeTab === 'inbox') {
      await markAsRead(message.id);
    }
  };

  const handleSendMessage = async (message: { recipientId: number; subject: string; body: string }) => {
    await sendMessage(message);
    setActiveTab('sent');
  };

  return (
    <UserDashboardLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={() => {
            setActiveTab('compose');
            setSelectedMessage(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Message
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => {
              setActiveTab('inbox');
              setSelectedMessage(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'inbox'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inbox
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('sent');
              setSelectedMessage(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sent'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => {
              setActiveTab('compose');
              setSelectedMessage(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'compose'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Compose
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${selectedMessage ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          {activeTab === 'inbox' && (
            <MessageList
              messages={inbox}
              onMessageClick={handleMessageClick}
              showSender={true}
              emptyMessage="No messages in inbox"
            />
          )}

          {activeTab === 'sent' && (
            <MessageList
              messages={sent}
              onMessageClick={handleMessageClick}
              showSender={false}
              emptyMessage="No sent messages"
            />
          )}

          {activeTab === 'compose' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">New Message</h2>
              <ComposeMessage onSend={handleSendMessage} />
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="lg:col-span-2">
            <MessageThread
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
              onReply={() => {
                setActiveTab('compose');
                setSelectedMessage(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
    </UserDashboardLayout>
  );
}

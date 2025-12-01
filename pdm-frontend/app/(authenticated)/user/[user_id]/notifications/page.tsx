'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { olavsDesign } from '@/lib/olavs-design-system';
import { OlavsButton } from '@/components/OlavsButton';
import { OlavsCard } from '@/components/OlavsCard';
import { OlavsContainer } from '@/components/OlavsContainer';
import { UserDashboardLayout } from '@/layouts/UserDashboardLayout';
import { Bell, DollarSign, CreditCard, MessageSquare, UserCheck, CheckCircle, Clock, X } from 'lucide-react';

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.get<Notification[]>('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {});
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/read-all', {});
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'LOAN': return <DollarSign size={20} />;
      case 'PAYMENT': return <CreditCard size={20} />;
      case 'SUPPORT': return <MessageSquare size={20} />;
      case 'ADMIN': return <UserCheck size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'LOAN': return olavsDesign.colors.primary[500];
      case 'PAYMENT': return olavsDesign.colors.status.success;
      case 'SUPPORT': return olavsDesign.colors.status.warning;
      case 'ADMIN': return olavsDesign.colors.status.info;
      default: return olavsDesign.colors.neutral[700];
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <UserDashboardLayout>
      <div style={{
        backgroundColor: olavsDesign.colors.surface.alt,
        minHeight: '100vh',
        fontFamily: olavsDesign.typography.font.primary,
      }}>
        <OlavsContainer>
          <div style={{ padding: `${olavsDesign.spacing[32]} 0` }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: olavsDesign.spacing[32],
              flexWrap: 'wrap',
              gap: olavsDesign.spacing[16],
            }}>
              <div>
                <h1 style={{
                  fontSize: olavsDesign.typography.scale.displayL.size,
                  fontWeight: olavsDesign.typography.scale.displayL.weight,
                  color: olavsDesign.colors.neutral[900],
                  margin: 0,
                  marginBottom: olavsDesign.spacing[8],
                }}>
                  Notifications
                </h1>
                <p style={{
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                  color: olavsDesign.colors.neutral[600],
                  margin: 0,
                }}>
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "You're all caught up!"}
                </p>
              </div>
              {unreadCount > 0 && (
                <OlavsButton
                  variant="secondary"
                  onClick={markAllAsRead}
                  icon={<CheckCircle size={18} />}
                >
                  Mark All as Read
                </OlavsButton>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex',
              gap: olavsDesign.spacing[12],
              marginBottom: olavsDesign.spacing[24],
              borderBottom: `2px solid ${olavsDesign.colors.neutral[200]}`,
              overflowX: 'auto',
            }}>
              {(['all', 'unread', 'read'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: `${olavsDesign.spacing[12]} ${olavsDesign.spacing[20]}`,
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    fontWeight: '600',
                    color: filter === tab ? olavsDesign.colors.primary[500] : olavsDesign.colors.neutral[600],
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: filter === tab ? `2px solid ${olavsDesign.colors.primary[500]}` : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-2px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'unread' && unreadCount > 0 && (
                    <span style={{
                      marginLeft: olavsDesign.spacing[8],
                      padding: `${olavsDesign.spacing[4]} ${olavsDesign.spacing[8]}`,
                      backgroundColor: olavsDesign.colors.primary[500],
                      color: 'white',
                      borderRadius: olavsDesign.radius.full,
                      fontSize: olavsDesign.typography.scale.caption.size,
                      fontWeight: olavsDesign.typography.scale.caption.weight,
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: olavsDesign.spacing[48] }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${olavsDesign.colors.neutral[200]}`,
                  borderTopColor: olavsDesign.colors.primary[500],
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                <p style={{
                  marginTop: olavsDesign.spacing[16],
                  color: olavsDesign.colors.neutral[600],
                  fontSize: olavsDesign.typography.scale.bodyM.size,
                }}>
                  Loading notifications...
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <OlavsCard elevation="level1">
                <div style={{
                  textAlign: 'center',
                  padding: olavsDesign.spacing[48],
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto',
                    marginBottom: olavsDesign.spacing[24],
                    borderRadius: '50%',
                    backgroundColor: olavsDesign.colors.neutral[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Bell size={36} color={olavsDesign.colors.neutral[600]} />
                  </div>
                  <h3 style={{
                    fontSize: olavsDesign.typography.scale.headingM.size,
                    fontWeight: olavsDesign.typography.scale.headingM.weight,
                    color: olavsDesign.colors.neutral[900],
                    marginBottom: olavsDesign.spacing[8],
                  }}>
                    No {filter !== 'all' ? filter : ''} notifications
                  </h3>
                  <p style={{
                    fontSize: olavsDesign.typography.scale.bodyM.size,
                    color: olavsDesign.colors.neutral[600],
                    margin: 0,
                  }}>
                    {filter === 'unread' 
                      ? "You've read all your notifications. Great job staying on top of things!"
                      : filter === 'read'
                      ? "You haven't read any notifications yet."
                      : "You don't have any notifications at the moment."}
                  </p>
                </div>
              </OlavsCard>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: olavsDesign.spacing[12],
              }}>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <OlavsCard
                      elevation={notification.isRead ? 'level1' : 'level2'}
                      style={{
                        backgroundColor: notification.isRead ? olavsDesign.colors.surface.default : olavsDesign.colors.surface.alt,
                        border: notification.isRead 
                          ? `1px solid ${olavsDesign.colors.neutral[200]}`
                          : `1px solid ${olavsDesign.colors.primary[200]}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                    <div style={{
                      display: 'flex',
                      gap: olavsDesign.spacing[16],
                      alignItems: 'flex-start',
                    }}>
                      {/* Icon */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: getTypeColor(notification.type) + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: getTypeColor(notification.type),
                      }}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: olavsDesign.spacing[8],
                          gap: olavsDesign.spacing[12],
                        }}>
                          <h4 style={{
                            fontSize: olavsDesign.typography.scale.bodyM.size,
                            fontWeight: '600',
                            color: olavsDesign.colors.neutral[900],
                            margin: 0,
                          }}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: olavsDesign.colors.primary[500],
                              flexShrink: 0,
                            }}></div>
                          )}
                        </div>
                        <p style={{
                          fontSize: olavsDesign.typography.scale.bodyS.size,
                          color: olavsDesign.colors.neutral[600],
                          margin: 0,
                          marginBottom: olavsDesign.spacing[12],
                          lineHeight: '1.5',
                        }}>
                          {notification.message}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: olavsDesign.spacing[16],
                          fontSize: olavsDesign.typography.scale.caption.size,
                          color: olavsDesign.colors.neutral[700],
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: olavsDesign.spacing[4] }}>
                            <Clock size={14} />
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                          <span style={{
                            padding: `${olavsDesign.spacing[4]} ${olavsDesign.spacing[8]}`,
                            backgroundColor: getTypeColor(notification.type) + '20',
                            color: getTypeColor(notification.type),
                            borderRadius: olavsDesign.radius.full,
                            fontWeight: '600',
                            fontSize: olavsDesign.typography.scale.caption.size,
                            textTransform: 'uppercase',
                          }}>
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: olavsDesign.spacing[8],
                          borderRadius: olavsDesign.radius.md,
                          transition: 'all 0.2s ease',
                          color: olavsDesign.colors.neutral[700],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = olavsDesign.colors.neutral[100];
                          e.currentTarget.style.color = olavsDesign.colors.status.error;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = olavsDesign.colors.neutral[700];
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </OlavsCard>
                  </div>
                ))}
              </div>
            )}
          </div>
        </OlavsContainer>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </UserDashboardLayout>
  );
}

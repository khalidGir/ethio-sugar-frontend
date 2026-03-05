import React, { useState, useEffect } from 'react';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '../services/api';
import { Bell, Check, CheckCheck, ExternalLink, Clock, AlertCircle, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationCenterProps {
  position?: 'topbar' | 'standalone';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ position = 'topbar' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [markAsRead] = useMarkNotificationReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsReadMutation();
  
  const { data, isLoading, refetch } = useGetNotificationsQuery(
    { status: 'all', limit: 20 },
    { pollingInterval: 30000 } // Poll every 30 seconds
  );

  // Auto-refresh on mount
  useEffect(() => {
    refetch();
  }, []);

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const handleMarkRead = async (id: string) => {
    await markAsRead({ id }).unwrap();
    refetch();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead().unwrap();
    refetch();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LOG_VERIFIED':
        return <Check className="w-5 h-5 text-emerald-600" />;
      case 'TASK_ASSIGNED':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'APPROVAL_REQUIRED':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'INCIDENT_ALERT':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'WEATHER_ALERT':
        return <AlertCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'LOG_VERIFIED':
        return 'bg-emerald-50 border-emerald-100';
      case 'TASK_ASSIGNED':
        return 'bg-blue-50 border-blue-100';
      case 'APPROVAL_REQUIRED':
        return 'bg-amber-50 border-amber-100';
      case 'INCIDENT_ALERT':
        return 'bg-red-50 border-red-100';
      case 'WEATHER_ALERT':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  // Topbar compact view
  if (position === 'topbar') {
    return (
      <div className="relative">
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1.5
              bg-red-500 text-white text-xs font-bold rounded-full
              flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl
              border border-gray-100 overflow-hidden z-50 max-h-[600px] flex flex-col">
              
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-forest-600 hover:text-forest-700 font-medium
                      flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 transition-colors ${
                          notification.read
                            ? 'bg-white'
                            : getNotificationColor(notification.type)
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${
                                notification.read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkRead(notification.id)}
                                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {notification.actionUrl && (
                                <Link
                                  to={notification.actionUrl}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs text-forest-600 hover:text-forest-700 font-medium
                                    flex items-center gap-1"
                                >
                                  View
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    to="/notifications"
                    onClick={() => setIsOpen(false)}
                    className="text-center text-sm text-forest-600 hover:text-forest-700 font-medium block"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Standalone full-page view
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your farm activities
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-base text-gray-500 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-colors ${
                  notification.read
                    ? 'bg-white'
                    : getNotificationColor(notification.type)
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-base font-semibold ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                          title="Mark as read"
                        >
                          <Check className="w-5 h-5 text-gray-400" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="text-sm text-forest-600 hover:text-forest-700 font-medium
                            flex items-center gap-1"
                        >
                          View details
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

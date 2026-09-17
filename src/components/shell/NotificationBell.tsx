'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { mockStore } from '@/lib/firebase/mockStore';
import { NotificationItem } from '@/types/broadcast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/I18nContext';

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotifs = () => {
      setNotifications(mockStore.getNotifications(userId));
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    mockStore.markNotificationAsRead(id);
    setNotifications(mockStore.getNotifications(userId));
  };

  const handleMarkAllRead = () => {
    mockStore.markAllNotificationsRead(userId);
    setNotifications(mockStore.getNotifications(userId));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="destructive" className="text-[9px] px-1.5 py-0">URGENT</Badge>;
      case 'IMPORTANT':
        return <Badge variant="warning" className="text-[9px] px-1.5 py-0">IMPORTANT</Badge>;
      default:
        return <Badge variant="info" className="text-[9px] px-1.5 py-0">NORMAL</Badge>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-textSecondary hover:text-textMain hover:bg-secondaryBg transition-colors"
        title={t.nav.notifications}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-subtleBorder rounded-card shadow-drawer z-50 overflow-hidden animate-in fade-in-50">
          <div className="p-3 border-b border-subtleBorder flex items-center justify-between bg-secondaryBg/60">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-textMain">{t.nav.notifications}</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-primary hover:underline font-semibold flex items-center"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-subtleBorder">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-textMuted">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-3 transition-colors cursor-pointer hover:bg-secondaryBg/40 ${
                    !notif.read ? 'bg-primary-light/40' : 'bg-surface'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-textMain line-clamp-1">{notif.title}</h4>
                    </div>
                    {getPriorityBadge(notif.priority)}
                  </div>
                  <p className="text-[11px] text-textSecondary mt-1 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-textMuted mt-1.5 font-mono">
                    <span>{notif.subject || notif.type}</span>
                    <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

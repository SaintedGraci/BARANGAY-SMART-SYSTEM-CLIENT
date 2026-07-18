import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationsAPI } from '../services/api';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Load notifications from database on mount
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      if (response.data.success) {
        const dbNotifications = response.data.data.notifications.map(notif => ({
          id: notif.id,
          ...notif.data,
          read: notif.read,
          timestamp: notif.createdAt,
          fromDatabase: true
        }));
        setNotifications(dbNotifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Use environment variable for Socket.IO URL, fallback to localhost
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      // Connect to Socket.IO server
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('🔌 Connected to Socket.IO server');
        // Join user's notification room
        newSocket.emit('join', user.id);
      });

      newSocket.on('requestStatusUpdate', (data) => {
        console.log('🔔 Received notification:', data);
        
        // Add notification to list (will be saved in DB by backend)
        const notification = {
          id: Date.now(),
          ...data,
          read: false,
          fromDatabase: false
        };
        
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Request Status Update', {
            body: data.message,
            icon: '/favicon.svg',
            tag: `request-${data.requestId}`
          });
        }

        // Play notification sound (optional)
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {
          // Ignore if audio fails to play
        });

        // Reload notifications from database to get the saved one
        setTimeout(() => loadNotifications(), 1000);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from Socket.IO server');
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // Update in database if it's from database
      const notification = notifications.find(n => n.id === notificationId);
      if (notification?.fromDatabase) {
        await notificationsAPI.markAsRead(notificationId);
      }
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update in database
      await notificationsAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    loadNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

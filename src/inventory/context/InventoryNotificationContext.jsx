import React, { createContext, useContext, useState, useCallback } from 'react';

const InventoryNotificationContext = createContext();

export const useInventoryNotification = () => {
    const context = useContext(InventoryNotificationContext);
    if (!context) {
        throw new Error('useInventoryNotification must be used within InventoryNotificationProvider');
    }
    return context;
};

export const InventoryNotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        const notification = { id, message, type, duration };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        showNotification(message, 'success', duration);
    }, [showNotification]);

    const error = useCallback((message, duration) => {
        showNotification(message, 'error', duration);
    }, [showNotification]);

    const warning = useCallback((message, duration) => {
        showNotification(message, 'warning', duration);
    }, [showNotification]);

    const info = useCallback((message, duration) => {
        showNotification(message, 'info', duration);
    }, [showNotification]);

    return (
        <InventoryNotificationContext.Provider
            value={{
                notifications,
                showNotification,
                removeNotification,
                success,
                error,
                warning,
                info
            }}
        >
            {children}
        </InventoryNotificationContext.Provider>
    );
};

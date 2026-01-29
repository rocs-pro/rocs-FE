import React from 'react';
import { X, Trash2, CheckCircle, AlertTriangle, Info, Bell, Clock } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationPanel() {
  const { notifications, isOpen, setIsOpen, markAllRead, clearNotifications } = useNotification();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />

      {/* Panel container */}
      <div className="fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600" />
                <h2 className="font-bold text-slate-800">Notifications</h2>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{notifications.length}</span>
            </div>
            <div className="flex gap-2">
                {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors" title="Clear All">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded text-slate-500">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-2">
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Bell className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No new notifications</p>
                </div>
            ) : (
                notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg border flex gap-3 transition-colors ${notif.read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}>
                        <div className={`mt-1 ${notif.type === 'success' ? 'text-green-500' : notif.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                             {notif.type === 'success' ? <CheckCircle className="w-4 h-4"/> : notif.type === 'error' ? <AlertTriangle className="w-4 h-4"/> : <Info className="w-4 h-4"/>}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                <Clock className="w-3 h-3" />
                                {notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer actions */}
        {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50">
                <button onClick={markAllRead} className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 rounded border border-transparent hover:border-blue-200 transition-all">
                    Mark all as read
                </button>
            </div>
        )}
      </div>
    </>
  );
}
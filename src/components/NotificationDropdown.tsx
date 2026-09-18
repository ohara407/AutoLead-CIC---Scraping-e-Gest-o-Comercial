import React from 'react';
import { Bell, CheckCheck, ExternalLink, X, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectLead?: (leadId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onSelectLead,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notification-panel"
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800 text-sm">Notificações em Tempo Real</span>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {notifications.filter((n) => !n.read).length} novas
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            id="btn-mark-all-read"
            onClick={onMarkAllRead}
            title="Marcar todas como lidas"
            className="text-xs text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lidas</span>
          </button>
          <button
            id="btn-close-notif"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            Nenhuma notificação registrada ainda.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              id={`notif-item-${notif.id}`}
              onClick={() => {
                if (notif.leadId && onSelectLead) {
                  onSelectLead(notif.leadId);
                  onClose();
                }
              }}
              className={`p-3 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                !notif.read ? 'bg-emerald-50/40 font-medium' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {notif.type === 'new_lead' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                {notif.type === 'whatsapp_sent' && (
                  <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                )}
                {notif.type === 'cic_alert' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {notif.type === 'qualified' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{notif.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(notif.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                {notif.leadId && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                    Ver lead no sistema <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
        Notificações push ativas em tempo real no navegador
      </div>
    </div>
  );
};

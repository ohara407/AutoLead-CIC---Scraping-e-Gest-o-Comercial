import React from 'react';
import { 
  Building2, 
  BarChart3, 
  FileSpreadsheet, 
  Play, 
  Package, 
  Bell, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'spreadsheet' | 'scraping' | 'cic' | 'reports';
  onSelectTab: (tab: 'dashboard' | 'spreadsheet' | 'scraping' | 'cic' | 'reports') => void;
  leadsCount: number;
  unreadNotificationsCount: number;
  isScrapingRunning?: boolean;
  onToggleNotifications: () => void;
  isNotificationsOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  leadsCount,
  unreadNotificationsCount,
  isScrapingRunning,
  onToggleNotifications,
  isNotificationsOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-base tracking-tight leading-none">
                  AutoLead &amp; CIC
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Scraping • WhatsApp • Planilha • App-CIC
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Dashboard &amp; Funil</span>
            </button>

            <button
              id="nav-tab-spreadsheet"
              onClick={() => onSelectTab('spreadsheet')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'spreadsheet'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Planilha Inteligente</span>
              <span className="ml-1 text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-bold">
                {leadsCount}
              </span>
            </button>

            <button
              id="nav-tab-scraping"
              onClick={() => onSelectTab('scraping')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'scraping'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Automação Scraping</span>
              {isScrapingRunning && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            <button
              id="nav-tab-cic"
              onClick={() => onSelectTab('cic')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'cic'
                  ? 'bg-purple-50 text-purple-800 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4 text-purple-600" />
              <span>Módulo App-CIC</span>
            </button>

            <button
              id="nav-tab-reports"
              onClick={() => onSelectTab('reports')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'reports'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Relatórios Semanais/Mensais</span>
            </button>
          </nav>

          {/* Right Controls: Notifications Bell & Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                id="btn-toggle-notifications"
                onClick={onToggleNotifications}
                className={`p-2 rounded-xl transition-colors relative ${
                  isNotificationsOpen || unreadNotificationsCount > 0
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Notificações Push em Tempo Real"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Run Scraping Pill */}
            <button
              id="btn-nav-quick-scrape"
              onClick={() => onSelectTab('scraping')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Buscar Negócios</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Horizontal Bar */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
              currentTab === 'dashboard' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('spreadsheet')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
              currentTab === 'spreadsheet' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
            }`}
          >
            Planilha ({leadsCount})
          </button>
          <button
            onClick={() => onSelectTab('scraping')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
              currentTab === 'scraping' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
            }`}
          >
            Scraping
          </button>
          <button
            onClick={() => onSelectTab('cic')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
              currentTab === 'cic' ? 'bg-purple-100 text-purple-800' : 'text-slate-600'
            }`}
          >
            App-CIC
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
              currentTab === 'reports' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
            }`}
          >
            Relatórios
          </button>
        </div>
      </div>
    </header>
  );
};

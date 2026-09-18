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
  Smartphone,
  Brain,
  MessageSquareQuote,
  MessageSquare
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'spreadsheet' | 'scraping' | 'cic' | 'feedback' | 'demos' | 'reports' | 'brain';
  onSelectTab: (tab: 'dashboard' | 'spreadsheet' | 'scraping' | 'cic' | 'feedback' | 'demos' | 'reports' | 'brain') => void;
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
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight leading-none">
                  AutoLead &amp; CIC
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight hidden sm:block">
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
              <span>App-CIC Balcão</span>
            </button>

            <button
              id="nav-tab-feedback"
              onClick={() => onSelectTab('feedback')}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'feedback'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
              <span>Feedback &amp; Venda de Sites</span>
            </button>

            <button
              id="nav-tab-demos"
              onClick={() => onSelectTab('demos')}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'demos'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                  : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Prévias de Sites</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                R$ 1.200
              </span>
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
              <span>Relatórios</span>
            </button>

            <button
              id="nav-tab-brain"
              onClick={() => onSelectTab('brain')}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'brain'
                  ? 'bg-purple-900 text-white shadow-md shadow-purple-900/20'
                  : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Cérebro &amp; n8n</span>
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
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto py-2.5 px-1 border-t border-slate-100 no-scrollbar touch-scroll">
          <button
            id="mobile-nav-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'dashboard' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-700 bg-slate-100/80 active:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="mobile-nav-spreadsheet"
            onClick={() => onSelectTab('spreadsheet')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'spreadsheet' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-700 bg-slate-100/80 active:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Planilha</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              currentTab === 'spreadsheet' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {leadsCount}
            </span>
          </button>

          <button
            id="mobile-nav-scraping"
            onClick={() => onSelectTab('scraping')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'scraping' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-700 bg-slate-100/80 active:bg-slate-200'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isScrapingRunning ? 'animate-spin' : ''}`} />
            <span>Scraping</span>
          </button>

          <button
            id="mobile-nav-cic"
            onClick={() => onSelectTab('cic')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'cic' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-purple-800 bg-purple-50 active:bg-purple-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>App-CIC</span>
          </button>

          <button
            id="mobile-nav-feedback"
            onClick={() => onSelectTab('feedback')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-black rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'feedback' 
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40' 
                : 'text-emerald-800 bg-emerald-100/70 active:bg-emerald-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback &amp; Vendas</span>
          </button>

          <button
            id="mobile-nav-demos"
            onClick={() => onSelectTab('demos')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-black rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'demos' 
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40' 
                : 'text-indigo-800 bg-indigo-100/70 active:bg-indigo-200'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Prévias de Sites</span>
          </button>

          <button
            id="mobile-nav-reports"
            onClick={() => onSelectTab('reports')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'reports' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-700 bg-slate-100/80 active:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Relatórios</span>
          </button>

          <button
            id="mobile-nav-brain"
            onClick={() => onSelectTab('brain')}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-black rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
              currentTab === 'brain' 
                ? 'bg-purple-900 text-white shadow-sm ring-2 ring-purple-400/40' 
                : 'text-purple-900 bg-purple-100 active:bg-purple-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Cérebro &amp; n8n</span>
          </button>
        </div>
      </div>
    </header>
  );
};

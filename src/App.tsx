import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SpreadsheetView } from './components/SpreadsheetView';
import { ScrapingView } from './components/ScrapingView';
import { AppCicView } from './components/AppCicView';
import { ReportsView } from './components/ReportsView';
import { NotificationDropdown } from './components/NotificationDropdown';
import { WhatsAppDispatchModal } from './components/WhatsAppDispatchModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { NewLeadModal } from './components/NewLeadModal';
import { 
  Lead, 
  AppCicItem, 
  AppCicMovement, 
  NotificationItem, 
  StrategicReport, 
  ScrapingFilterParams, 
  LeadStatus 
} from './types';
import { Bell, CheckCircle2, Sparkles, X, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'spreadsheet' | 'scraping' | 'cic' | 'reports'>('dashboard');

  // Application Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cicItems, setCicItems] = useState<AppCicItem[]>([]);
  const [cicMovements, setCicMovements] = useState<AppCicMovement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals and UI States
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [whatsAppLead, setWhatsAppLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrapingRunning, setIsScrapingRunning] = useState(false);

  // Floating Push Toast for Real-Time Event Alerts
  const [toastAlert, setToastAlert] = useState<{ id: string; title: string; message: string; type: string } | null>(null);

  // Trigger floating push toast
  const showPushToast = (title: string, message: string, type = 'novo_lead') => {
    const id = Date.now().toString();
    setToastAlert({ id, title, message, type });

    // Request native browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } catch (e) {
        // Safe fallback in iframe
      }
    }

    setTimeout(() => {
      setToastAlert((curr) => (curr?.id === id ? null : curr));
    }, 6000);
  };

  // Initial Load with defensive JSON parsing
  const fetchData = useCallback(async () => {
    try {
      const [leadsRes, itemsRes, movsRes, notifsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/cic/items'),
        fetch('/api/cic/movements'),
        fetch('/api/notifications'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        const leadsArray = Array.isArray(data) ? data : (data.leads || []);
        setLeads(leadsArray);
      }

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        const itemsArray = Array.isArray(data) ? data : (data.items || []);
        setCicItems(itemsArray);
      }

      if (movsRes.ok) {
        const data = await movsRes.json();
        const movsArray = Array.isArray(data) ? data : (data.movements || []);
        setCicMovements(movsArray);
      }

      if (notifsRes.ok) {
        const data = await notifsRes.json();
        const notifsArray = Array.isArray(data) ? data : (data.notifications || []);
        setNotifications(notifsArray);
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Ask for native notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // Interval to refresh notifications every 15 seconds
    const interval = setInterval(async () => {
      try {
        const notifsRes = await fetch('/api/notifications');
        if (notifsRes.ok) {
          const freshNotifs = await notifsRes.json();
          const notifsArray = Array.isArray(freshNotifs) ? freshNotifs : (freshNotifs.notifications || []);
          setNotifications(notifsArray);
        }
      } catch (e) {
        // silent
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Lead Actions
  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        const updated: Lead = json.lead || json;
        setLeads((prev) => (Array.isArray(prev) ? prev : []).map((l) => (l.id === updated.id ? updated : l)));
        showPushToast('Status Atualizado', `Lead "${updated.businessName}" agora está como: ${status.toUpperCase()}`, 'info');
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => (Array.isArray(prev) ? prev : []).filter((l) => l.id !== leadId));
        if (selectedLeadId === leadId) setSelectedLeadId(null);
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (res.ok) {
        const json = await res.json();
        const newLead: Lead = json.lead || json;
        setLeads((prev) => [newLead, ...(Array.isArray(prev) ? prev : [])]);
        showPushToast('Novo Lead Registrado', `${newLead.businessName} foi adicionado à planilha.`, 'novo_lead');
        
        // Refresh notifications
        const notifsRes = await fetch('/api/notifications');
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(Array.isArray(notifsData) ? notifsData : (notifsData.notifications || []));
        }
      }
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  // Scraping Action
  const handleRunScrape = async (params: ScrapingFilterParams): Promise<Lead[]> => {
    setIsScrapingRunning(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Falha na resposta do scraping');
      const data = await res.json();
      const newScrapedLeads: Lead[] = data.scrapedLeads || data.leads || [];

      // Update leads list
      setLeads((prev) => {
        const currentList = Array.isArray(prev) ? prev : [];
        const map = new Map(currentList.map((l) => [l.id, l]));
        newScrapedLeads.forEach((l) => map.set(l.id, l));
        return Array.from(map.values());
      });

      // Refresh notifications & cicItems
      const [notifsRes, itemsRes] = await Promise.all([
        fetch('/api/notifications'),
        fetch('/api/cic/items'),
      ]);
      if (notifsRes.ok) {
        const notifsData = await notifsRes.json();
        setNotifications(Array.isArray(notifsData) ? notifsData : (notifsData.notifications || []));
      }
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setCicItems(Array.isArray(itemsData) ? itemsData : (itemsData.items || []));
      }

      showPushToast(
        'Scraping Concluído!',
        `${newScrapedLeads.length} novos comércios qualificados e salvos na planilha com sucesso.`,
        'novo_lead'
      );

      return newScrapedLeads;
    } finally {
      setIsScrapingRunning(false);
    }
  };

  // AI Re-qualification
  const handleRequalifyLead = async (leadId: string) => {
    try {
      const res = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.lead) {
          setLeads((prev) => (Array.isArray(prev) ? prev : []).map((l) => (l.id === json.lead.id ? json.lead : l)));
          showPushToast('Requalificação por IA Concluída', `Score atualizado para ${json.lead.qualificationScore}/100.`, 'info');
        }
      }
    } catch (err) {
      console.error('Error requalifying lead with AI:', err);
    }
  };

  // WhatsApp Dispatch Action
  const handleDispatchWhatsApp = async (
    leadId: string,
    customMessage: string,
    targetSalesPhone?: string
  ): Promise<string | undefined> => {
    try {
      const res = await fetch('/api/whatsapp/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, customMessage, targetSalesPhone }),
      });

      if (res.ok) {
        const json = await res.json();
        // Update local lead status
        setLeads((prev) =>
          (Array.isArray(prev) ? prev : []).map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  status: 'disparado_whatsapp',
                  dispatchStatus: 'enviado',
                  suggestedPitch: customMessage,
                }
              : l
          )
        );

        showPushToast('Disparo WhatsApp Registrado', `Mensagem pronta para envio comercial.`, 'whatsapp');

        // Refresh notifications
        const notifsRes = await fetch('/api/notifications');
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(Array.isArray(notifsData) ? notifsData : (notifsData.notifications || []));
        }

        return json.whatsappUrl;
      }
    } catch (err) {
      console.error('Error dispatching WhatsApp:', err);
    }
    return undefined;
  };

  // App-CIC Items & Movements Actions
  const handleAddCicItem = async (itemData: Partial<AppCicItem>) => {
    try {
      const res = await fetch('/api/cic/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        const json = await res.json();
        const newItem: AppCicItem = json.item || json;
        setCicItems((prev) => [newItem, ...(Array.isArray(prev) ? prev : [])]);
        showPushToast('Item App-CIC Cadastrado', `${newItem.name} foi adicionado ao estoque móvel.`, 'cic');
      }
    } catch (err) {
      console.error('Error creating CIC item:', err);
    }
  };

  const handleRegisterCicMovement = async (data: {
    itemId: string;
    type: 'saida' | 'entrada';
    quantity: number;
    reason: any;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/cic/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedItem: AppCicItem = json.updatedItem || json.item;
        const newMovement: AppCicMovement = json.movement;

        if (updatedItem) {
          setCicItems((prev) => (Array.isArray(prev) ? prev : []).map((i) => (i.id === updatedItem.id ? updatedItem : i)));
        }
        if (newMovement) {
          setCicMovements((prev) => [newMovement, ...(Array.isArray(prev) ? prev : [])]);
        }

        const itemName = updatedItem ? updatedItem.name : 'Item';
        const newStock = updatedItem ? updatedItem.currentStock : '';
        showPushToast(
          data.type === 'saida' ? 'Baixa de Saída Registrada!' : 'Entrada de Estoque Registrada!',
          `${itemName}: ${data.type === 'saida' ? '-' : '+'}${data.quantity} un.${newStock !== '' ? ` Novo saldo: ${newStock} un.` : ''}`,
          data.type === 'saida' ? 'cic' : 'info'
        );

        // Refresh notifications for low stock alerts
        const notifsRes = await fetch('/api/notifications');
        if (notifsRes.ok) {
          const notifsData = await notifsRes.json();
          setNotifications(Array.isArray(notifsData) ? notifsData : (notifsData.notifications || []));
        }
      }
    } catch (err) {
      console.error('Error registering movement:', err);
    }
  };

  const handleDeleteCicItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cic/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setCicItems((prev) => (Array.isArray(prev) ? prev : []).filter((i) => i.id !== itemId));
      }
    } catch (err) {
      console.error('Error deleting CIC item:', err);
    }
  };

  // Strategic Report Action
  const handleGenerateReport = async (period: 'semanal' | 'mensal'): Promise<StrategicReport> => {
    const res = await fetch('/api/reports/strategic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period }),
    });
    if (!res.ok) throw new Error('Falha ao gerar relatório estratégico');
    const json = await res.json();
    return json.report;
  };

  // Notifications Actions
  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) => (Array.isArray(prev) ? prev : []).map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  // Safe guarded arrays for guaranteed array methods
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeItems = Array.isArray(cicItems) ? cicItems : [];
  const safeMovements = Array.isArray(cicMovements) ? cicMovements : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const unreadNotificationsCount = safeNotifications.filter((n) => !n.read).length;
  const activeSelectedLead = safeLeads.find((l) => l.id === selectedLeadId) || null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Fixed Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsNotificationsOpen(false);
        }}
        leadsCount={safeLeads.length}
        unreadNotificationsCount={unreadNotificationsCount}
        isScrapingRunning={isScrapingRunning}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Floating Push Toast Banner (when new leads or stock warnings happen) */}
      {toastAlert && (
        <div
          id="floating-push-toast"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs text-white truncate">{toastAlert.title}</h5>
              <button
                onClick={() => setToastAlert(null)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">{toastAlert.message}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTab('spreadsheet');
                  setToastAlert(null);
                }}
                className="text-[10px] font-bold text-emerald-400 hover:underline"
              >
                Abrir Planilha →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Notification Dropdown Overlay */}
        <NotificationDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={safeNotifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onSelectLead={(id) => {
            setSelectedLeadId(id);
            setIsNotificationsOpen(false);
          }}
        />

        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-bold text-sm">Carregando sistema de prospecção e controle...</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                leads={safeLeads}
                cicItems={safeItems}
                onOpenScraping={() => setCurrentTab('scraping')}
                onOpenSpreadsheet={() => setCurrentTab('spreadsheet')}
                onOpenAppCic={() => setCurrentTab('cic')}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onOpenWhatsApp={(lead) => setWhatsAppLead(lead)}
              />
            )}

            {currentTab === 'spreadsheet' && (
              <SpreadsheetView
                leads={safeLeads}
                onSelectLead={(id) => setSelectedLeadId(id)}
                onOpenWhatsApp={(lead) => setWhatsAppLead(lead)}
                onUpdateStatus={handleUpdateLeadStatus}
                onDeleteLead={handleDeleteLead}
                onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
                onOpenScraping={() => setCurrentTab('scraping')}
              />
            )}

            {currentTab === 'scraping' && (
              <ScrapingView
                onRunScrape={handleRunScrape}
                onOpenSpreadsheet={() => setCurrentTab('spreadsheet')}
                onOpenWhatsApp={(lead) => setWhatsAppLead(lead)}
              />
            )}

            {currentTab === 'cic' && (
              <AppCicView
                leads={safeLeads}
                items={safeItems}
                movements={safeMovements}
                onAddItem={handleAddCicItem}
                onRegisterMovement={handleRegisterCicMovement}
                onDeleteItem={handleDeleteCicItem}
                onOpenWhatsApp={(lead) => setWhatsAppLead(lead)}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView onGenerateReport={handleGenerateReport} />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {/* 1. Lead Detail Modal */}
      {activeSelectedLead && (
        <LeadDetailModal
          lead={activeSelectedLead}
          isOpen={true}
          onClose={() => setSelectedLeadId(null)}
          onOpenWhatsApp={(lead) => setWhatsAppLead(lead)}
          onRequalifyWithAI={handleRequalifyLead}
          onUpdateStatus={handleUpdateLeadStatus}
        />
      )}

      {/* 2. WhatsApp Dispatch Modal */}
      {whatsAppLead && (
        <WhatsAppDispatchModal
          lead={whatsAppLead}
          isOpen={true}
          onClose={() => setWhatsAppLead(null)}
          onDispatch={handleDispatchWhatsApp}
        />
      )}

      {/* 3. Manual New Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onSaveLead={handleCreateLead}
      />
    </div>
  );
}

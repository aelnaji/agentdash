import { useState, useEffect, useCallback } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { CenterCanvas } from './components/CenterCanvas';
import { RightPanel } from './components/RightPanel';
import { AddAgentModal } from './components/AddAgentModal';
import { SettingsPanel } from './components/SettingsPanel';
import { useAICompanyData } from './hooks/useAICompanyData';
import { routeCommand, dispatchCommandAsTask, buildAutoReply } from './hooks/useCommandDispatch';

export type AgentStatus = 'working' | 'idle' | 'alarm' | 'ceo-calling';

export type Agent = {
  id: string;
  name: string;
  role: string;
  task: string;
  status: AgentStatus;
  avatar: string;
  _meta?: {
    modelName: string;
    providerName: string;
    taskCount: number;
  };
};

export type Message = {
  id: string;
  sender: 'ceo' | 'agent';
  text: string;
  timestamp: Date;
};

export type ActivityLog = {
  id: string;
  timestamp: Date;
  agentName: string;
  action: string;
};

export type Settings = {
  dashboardName: string;
  ceoName: string;
  autoReplyDelay: number;
  enableAlarms: boolean;
  soundOnQuestion: boolean;
  autoClearAlarms: boolean;
  showLiveFeed: boolean;
  animateConnections: boolean;
  showTaskSnippets: boolean;
  apiUrl: string;
};

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    dashboardName: 'AI Operations HQ',
    ceoName: 'CEO',
    autoReplyDelay: 3,
    enableAlarms: true,
    soundOnQuestion: false,
    autoClearAlarms: true,
    showLiveFeed: true,
    animateConnections: true,
    showTaskSnippets: true,
    apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  });

  // ─── Callbacks for data hook ───────────────────────────────────────────────
  const handleAgentsLoaded = useCallback((loaded: Agent[]) => {
    setAgents(prev => {
      // Preserve local status overrides (alarm / ceo-calling) during poll updates
      return loaded.map(incoming => {
        const existing = prev.find(p => p.id === incoming.id);
        if (existing && (existing.status === 'alarm' || existing.status === 'ceo-calling')) {
          return { ...incoming, status: existing.status };
        }
        return incoming;
      });
    });
    setSelectedAgentId(prev => prev || loaded[0]?.id || '');
  }, []);

  const handleActivityAppend = useCallback((log: ActivityLog) => {
    setActivityLog(prev => [...prev.slice(-20), log]);
  }, []);

  // ─── Live data from AICOMPANY API ──────────────────────────────────────────
  const { loading, error, stats, providers, models } = useAICompanyData({
    isPaused,
    onAgentsLoaded: handleAgentsLoaded,
    onActivityAppend: handleActivityAppend,
  });

  // ─── Clock ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Local activity simulation when paused / no live tasks ─────────────────
  useEffect(() => {
    if (isPaused || agents.length === 0) return;
    const actions = ['Ran command', 'Read file', 'Found files', 'Wrote file', 'Executed task', 'Updated schema'];
    const id = setInterval(() => {
      const a = agents[Math.floor(Math.random() * agents.length)];
      if (a.status !== 'working') return;
      setActivityLog(prev => [
        ...prev.slice(-20),
        { id: `sim-${Date.now()}`, timestamp: new Date(), agentName: a.name, action: actions[Math.floor(Math.random() * actions.length)] },
      ]);
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused, agents]);

  // ─── Send message / command ────────────────────────────────────────────────
  const handleSendMessage = async (text: string, agentId: string) => {
    const isQuestion = text.trim().endsWith('?');
    const ceoMsg: Message = { id: `msg-${Date.now()}`, sender: 'ceo', text, timestamp: new Date() };

    setMessagesByAgent(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), ceoMsg] }));

    if (isQuestion && settings.enableAlarms) {
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'alarm' } : a));
      setTimeout(() => {
        const reply: Message = {
          id: `reply-${Date.now()}`,
          sender: 'agent',
          text: `Analyzing: "${text.slice(0, 40)}..." — Working on a detailed response.`,
          timestamp: new Date(),
        };
        setMessagesByAgent(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), reply] }));
        if (settings.autoClearAlarms)
          setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'working' } : a));
      }, settings.autoReplyDelay * 1000);
    } else {
      // Route as a real task to AICOMPANY
      const targetAgent = routeCommand(text, agents);
      const actualTarget = targetAgent ?? agents.find(a => a.id === agentId);
      if (actualTarget) {
        setAgents(prev => prev.map(a => a.id === actualTarget.id ? { ...a, status: 'ceo-calling' } : a));
        try {
          const task = await dispatchCommandAsTask(text, actualTarget);
          const autoReply = buildAutoReply(text, actualTarget, task);
          setMessagesByAgent(prev => ({ ...prev, [actualTarget.id]: [...(prev[actualTarget.id] || []), autoReply] }));
          setActivityLog(prev => [...prev.slice(-20), {
            id: `cmd-${Date.now()}`,
            timestamp: new Date(),
            agentName: actualTarget.name,
            action: `Task created: ${text.slice(0, 40)}`,
          }]);
        } catch (err) {
          // If API fails, still show fallback reply
          const fallback: Message = {
            id: `fallback-${Date.now()}`,
            sender: 'agent',
            text: 'Acknowledged. Processing directive now.',
            timestamp: new Date(),
          };
          setMessagesByAgent(prev => ({ ...prev, [actualTarget.id]: [...(prev[actualTarget.id] || []), fallback] }));
        }
        setTimeout(() => {
          setAgents(prev => prev.map(a => a.id === actualTarget.id ? { ...a, status: 'working' } : a));
        }, 2000);
      }
    }
  };

  // ─── Add agent ─────────────────────────────────────────────────────────────
  const handleAddAgent = (agentData: Omit<Agent, 'id'>) => {
    // Optimistically add to local state; real creation handled by AddAgentModal
    const newAgent: Agent = { ...agentData, id: `local-${Date.now()}` };
    setAgents(prev => [...prev, newAgent]);
    setIsAddAgentModalOpen(false);
  };

  const handleResetAgents = () => {
    setAgents([]);
    setMessagesByAgent({});
    setSelectedAgentId('');
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  // ─── Loading / error states ─────────────────────────────────────────────────
  if (loading && agents.length === 0) {
    return (
      <div className="size-full flex items-center justify-center" style={{ background: '#0d0f12' }}>
        <div className="text-center">
          <div className="text-sm font-mono mb-2" style={{ color: '#00c9a7' }}>CONNECTING TO AICOMPANY API...</div>
          <div className="text-xs" style={{ color: '#6b7280' }}>{settings.apiUrl}</div>
        </div>
      </div>
    );
  }

  if (error && agents.length === 0) {
    return (
      <div className="size-full flex items-center justify-center" style={{ background: '#0d0f12' }}>
        <div className="text-center max-w-sm">
          <div className="text-sm font-mono mb-2" style={{ color: '#ef4444' }}>API CONNECTION FAILED</div>
          <div className="text-xs mb-4" style={{ color: '#6b7280' }}>{error}</div>
          <div className="text-xs p-3 rounded font-mono" style={{ background: '#161a1f', color: '#6b7280' }}>
            Set VITE_API_URL in .env<br />
            Default: http://localhost:3000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex overflow-hidden" style={{ background: '#0d0f12' }}>
      <LeftSidebar
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenAddAgent={() => setIsAddAgentModalOpen(true)}
        onOpenSettings={() => setIsSettingsPanelOpen(true)}
        settings={settings}
        stats={stats}
      />

      <CenterCanvas
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        activityLog={activityLog}
        currentTime={currentTime}
        isPaused={isPaused}
        settings={settings}
      />

      <RightPanel
        agent={selectedAgent}
        agents={agents}
        messages={messagesByAgent[selectedAgentId] || []}
        onSendMessage={(text) => handleSendMessage(text, selectedAgentId)}
        onSelectAgent={setSelectedAgentId}
        settings={settings}
      />

      {isAddAgentModalOpen && (
        <AddAgentModal
          onClose={() => setIsAddAgentModalOpen(false)}
          onAdd={handleAddAgent}
          providers={providers}
          models={models}
        />
      )}

      {isSettingsPanelOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setIsSettingsPanelOpen(false)}
          onResetAgents={handleResetAgents}
        />
      )}
    </div>
  );
}

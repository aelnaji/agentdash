import { useState, useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { CenterCanvas } from './components/CenterCanvas';
import { RightPanel } from './components/RightPanel';
import { AddAgentModal } from './components/AddAgentModal';
import { SettingsPanel } from './components/SettingsPanel';

export type AgentStatus = 'working' | 'idle' | 'alarm' | 'ceo-calling';

export type Agent = {
  id: string;
  name: string;
  role: string;
  task: string;
  status: AgentStatus;
  avatar: string;
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
};

const DEFAULT_AGENTS: Agent[] = [
  { id: 'agent-lead', name: 'AGENT-LEAD', role: 'Technical Lead', task: 'Reviewing architecture plan', status: 'working', avatar: 'AL' },
  { id: 'agent-backend', name: 'AGENT-BACKEND', role: 'Backend Engineer', task: 'Designing database schema', status: 'working', avatar: 'AB' },
  { id: 'agent-frontend', name: 'AGENT-FRONTEND', role: 'Frontend Engineer', task: 'Building React component tree', status: 'working', avatar: 'AF' },
  { id: 'agent-qa', name: 'AGENT-QA', role: 'QA Engineer', task: 'Writing test coverage plan', status: 'working', avatar: 'AQ' },
];

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(DEFAULT_AGENTS[0].id);
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
  });

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add activity log entries every 4 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const actions = ['Ran command', 'Read file', 'Found files', 'Wrote file', 'Executed task', 'Updated schema'];

    const interval = setInterval(() => {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      setActivityLog(prev => [
        ...prev.slice(-20),
        {
          id: `activity-${Date.now()}`,
          timestamp: new Date(),
          agentName: randomAgent.name,
          action: randomAction,
        },
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, agents]);

  const handleSendMessage = (text: string, agentId: string) => {
    const isQuestion = text.trim().endsWith('?');

    // Add CEO message
    const ceoMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ceo',
      text,
      timestamp: new Date(),
    };

    setMessagesByAgent(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), ceoMessage],
    }));

    // Update agent status
    if (isQuestion && settings.enableAlarms) {
      // Question: set alarm status
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: 'alarm' } : a
      ));

      // Auto-reply after delay and clear alarm
      setTimeout(() => {
        const agentReply: Message = {
          id: `msg-${Date.now()}-reply`,
          sender: 'agent',
          text: `I've analyzed the question. Here's my assessment: ${text.slice(0, 30)}... Working on a detailed response now.`,
          timestamp: new Date(),
        };

        setMessagesByAgent(prev => ({
          ...prev,
          [agentId]: [...(prev[agentId] || []), agentReply],
        }));

        if (settings.autoClearAlarms) {
          setAgents(prev => prev.map(a =>
            a.id === agentId ? { ...a, status: 'working' } : a
          ));
        }
      }, settings.autoReplyDelay * 1000);
    } else {
      // Directive: set CEO calling status briefly
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, status: 'ceo-calling' } : a
      ));

      // Auto-reply after 2 seconds
      setTimeout(() => {
        const agentReply: Message = {
          id: `msg-${Date.now()}-reply`,
          sender: 'agent',
          text: 'Acknowledged. Processing directive now.',
          timestamp: new Date(),
        };

        setMessagesByAgent(prev => ({
          ...prev,
          [agentId]: [...(prev[agentId] || []), agentReply],
        }));

        // Return to working status
        setAgents(prev => prev.map(a =>
          a.id === agentId ? { ...a, status: 'working' } : a
        ));
      }, 2000);
    }
  };

  const handleAddAgent = (agent: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
    };
    setAgents(prev => [...prev, newAgent]);
    setIsAddAgentModalOpen(false);
  };

  const handleResetAgents = () => {
    setAgents(DEFAULT_AGENTS);
    setMessagesByAgent({});
    setSelectedAgentId(DEFAULT_AGENTS[0].id);
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

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

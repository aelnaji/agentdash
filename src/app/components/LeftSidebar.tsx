import { Agent, Settings } from '../App';
import { Plus, Settings as SettingsIcon, Play, Pause } from 'lucide-react';

type LeftSidebarProps = {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenAddAgent: () => void;
  onOpenSettings: () => void;
  settings: Settings;
};

const navItems = ['Headquarters', 'Tasks', 'Inbox', 'Files', 'Settings', 'Marketplace'];

export function LeftSidebar({
  agents,
  selectedAgentId,
  onSelectAgent,
  isPaused,
  onTogglePause,
  onOpenAddAgent,
  onOpenSettings,
  settings,
}: LeftSidebarProps) {
  const getStatusLight = (status: Agent['status']) => {
    if (isPaused) return 'light-grey';
    switch (status) {
      case 'working':
        return 'light-green';
      case 'alarm':
        return 'light-red';
      case 'ceo-calling':
        return 'light-green';
      case 'idle':
        return 'light-grey';
    }
  };

  return (
    <div className="w-64 h-full flex flex-col border-r" style={{
      background: '#161a1f',
      borderColor: 'rgba(255,255,255,0.08)'
    }}>
      {/* Top Navigation */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <button
              key={item}
              className={`text-left px-3 py-1.5 rounded text-sm transition-colors ${
                i === 0 ? 'font-medium' : ''
              }`}
              style={{
                color: i === 0 ? '#00c9a7' : '#6b7280',
                background: i === 0 ? 'rgba(0, 201, 167, 0.1)' : 'transparent',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          onClick={onOpenAddAgent}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
          style={{
            background: '#00c9a7',
            color: '#0d0f12',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
          style={{
            background: '#1e2329',
            color: '#e8eaed',
          }}
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </button>

        <button
          onClick={onTogglePause}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors"
          style={{
            background: isPaused ? '#00c9a7' : '#1e2329',
            color: isPaused ? '#0d0f12' : '#e8eaed',
          }}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? 'Resume Business' : 'Pause Business'}
        </button>
      </div>

      {/* Agent Roster */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-medium mb-3" style={{ color: '#6b7280' }}>
          AGENT ROSTER
        </div>
        <div className="flex flex-col gap-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="flex items-start gap-3 p-3 rounded text-left transition-colors"
              style={{
                background: selectedAgentId === agent.id ? '#1e2329' : 'transparent',
                borderLeft: selectedAgentId === agent.id ? '2px solid #00c9a7' : '2px solid transparent',
              }}
            >
              {/* Status Light */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={getStatusLight(agent.status)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                  }}
                />
              </div>

              {/* Avatar */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  background: '#1e2329',
                  color: '#00c9a7',
                  border: '1px solid rgba(0, 201, 167, 0.3)',
                }}
              >
                {agent.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: '#e8eaed' }}>
                  {agent.name}
                </div>
                <div className="text-xs" style={{ color: '#6b7280' }}>
                  {agent.role}
                </div>
                {settings.showTaskSnippets && (
                  <div className="text-xs mt-1 truncate" style={{ color: '#6b7280' }}>
                    {agent.task}
                  </div>
                )}
                {agent.status === 'ceo-calling' && (
                  <div
                    className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                    style={{
                      border: '1px solid #00c9a7',
                      color: '#00c9a7',
                    }}
                  >
                    CEO calling
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .light-green {
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse 2s infinite;
        }

        .light-red {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pulse 0.8s infinite;
        }

        .light-grey {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}

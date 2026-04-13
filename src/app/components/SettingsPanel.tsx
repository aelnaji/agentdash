import { Settings } from '../App';
import { X, AlertTriangle } from 'lucide-react';

type SettingsPanelProps = {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onClose: () => void;
  onResetAgents: () => void;
};

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onClose,
  onResetAgents,
}: SettingsPanelProps) {
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all agents? This will remove all custom agents and restore the default 4 agents.')) {
      onResetAgents();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-end z-50"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full overflow-y-auto shadow-xl"
        style={{ background: '#161a1f', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{
          borderColor: 'rgba(255,255,255,0.08)',
          background: '#161a1f',
        }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e8eaed' }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors hover:bg-opacity-80"
            style={{ background: '#1e2329' }}
          >
            <X className="w-5 h-5" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="p-6">
          {/* General */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8eaed' }}>
              General
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                  Dashboard Name
                </label>
                <input
                  type="text"
                  value={settings.dashboardName}
                  onChange={(e) => updateSetting('dashboardName', e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{
                    background: '#1e2329',
                    color: '#e8eaed',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                  CEO Name
                </label>
                <input
                  type="text"
                  value={settings.ceoName}
                  onChange={(e) => updateSetting('ceoName', e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{
                    background: '#1e2329',
                    color: '#e8eaed',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                  Auto-reply Delay: {settings.autoReplyDelay}s
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.autoReplyDelay}
                  onChange={(e) => updateSetting('autoReplyDelay', parseInt(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#6b7280' }}>
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8eaed' }}>
              Notifications
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Enable alarm lights
                </span>
                <input
                  type="checkbox"
                  checked={settings.enableAlarms}
                  onChange={(e) => updateSetting('enableAlarms', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>

              <label className="flex items-center justify-between cursor-not-allowed opacity-50">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Sound on question
                </span>
                <input
                  type="checkbox"
                  checked={settings.soundOnQuestion}
                  disabled
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Auto-clear alarms after reply
                </span>
                <input
                  type="checkbox"
                  checked={settings.autoClearAlarms}
                  onChange={(e) => updateSetting('autoClearAlarms', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>
            </div>
          </section>

          {/* Display */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#e8eaed' }}>
              Display
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Show Live Feed
                </span>
                <input
                  type="checkbox"
                  checked={settings.showLiveFeed}
                  onChange={(e) => updateSetting('showLiveFeed', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Animate node connections
                </span>
                <input
                  type="checkbox"
                  checked={settings.animateConnections}
                  onChange={(e) => updateSetting('animateConnections', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Show task snippets in sidebar
                </span>
                <input
                  type="checkbox"
                  checked={settings.showTaskSnippets}
                  onChange={(e) => updateSetting('showTaskSnippets', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h3>

            <button
              onClick={handleReset}
              className="w-full px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: '#ef4444',
                color: '#fff',
              }}
            >
              Reset All Agents
            </button>
            <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
              This will remove all custom agents and restore the default 4 agents. All chat history will be cleared.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

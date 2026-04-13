import { useState, useEffect, useRef } from 'react';
import { Agent, Message, Settings } from '../App';
import { Send, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

type RightPanelProps = {
  agent: Agent | undefined;
  agents: Agent[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSelectAgent: (id: string) => void;
  settings: Settings;
};

export function RightPanel({
  agent,
  agents,
  messages,
  onSendMessage,
  onSelectAgent,
  settings,
}: RightPanelProps) {
  const [inputText, setInputText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!agent) return null;

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return 'Working';
      case 'alarm':
        return 'Question Pending';
      case 'ceo-calling':
        return 'CEO Calling';
      case 'idle':
        return 'Idle';
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return '#22c55e';
      case 'alarm':
        return '#ef4444';
      case 'ceo-calling':
        return '#f5a623';
      case 'idle':
        return '#4b5563';
    }
  };

  return (
    <div className="w-96 h-full flex flex-col border-l" style={{
      background: '#161a1f',
      borderColor: 'rgba(255,255,255,0.08)'
    }}>
      {/* Agent Selector & Status */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 rounded transition-colors"
            style={{
              background: '#1e2329',
              color: '#e8eaed',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{
                  background: '#0d0f12',
                  color: '#00c9a7',
                  border: '1px solid rgba(0, 201, 167, 0.3)',
                }}
              >
                {agent.avatar}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{agent.name}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>{agent.role}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded shadow-lg overflow-hidden z-10"
              style={{
                background: '#1e2329',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelectAgent(a.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-opacity-80"
                  style={{
                    background: a.id === agent.id ? '#0d0f12' : 'transparent',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                    style={{
                      background: '#0d0f12',
                      color: '#00c9a7',
                      border: '1px solid rgba(0, 201, 167, 0.3)',
                    }}
                  >
                    {a.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#e8eaed' }}>{a.name}</div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>{a.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: getStatusColor(agent.status) }}
          />
          <span className="text-xs" style={{ color: '#6b7280' }}>
            Status: <span style={{ color: '#e8eaed' }}>{getStatusLabel(agent.status)}</span>
          </span>
        </div>

        <div className="mt-2 text-xs" style={{ color: '#6b7280' }}>
          Current task: <span style={{ color: '#e8eaed' }}>{agent.task}</span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center py-8" style={{ color: '#6b7280' }}>
              <div className="text-sm">No messages yet</div>
              <div className="text-xs mt-1">Send a message to start the conversation</div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'ceo' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'agent' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mr-2"
                  style={{
                    background: '#1e2329',
                    color: '#00c9a7',
                    border: '1px solid rgba(0, 201, 167, 0.3)',
                  }}
                >
                  {agent.avatar}
                </div>
              )}

              <div
                className="max-w-[75%] px-3 py-2 rounded-lg"
                style={{
                  background: message.sender === 'ceo' ? '#f5a623' : '#1e2329',
                  color: message.sender === 'ceo' ? '#0d0f12' : '#e8eaed',
                }}
              >
                <div className="text-sm">{message.text}</div>
                <div
                  className="text-xs mt-1"
                  style={{
                    color: message.sender === 'ceo' ? 'rgba(13, 15, 18, 0.6)' : '#6b7280',
                  }}
                >
                  {format(message.timestamp, 'HH:mm:ss')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message agent…"
            className="flex-1 px-3 py-2 rounded text-sm outline-none"
            style={{
              background: '#1e2329',
              color: '#e8eaed',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 py-2 rounded transition-opacity"
            style={{
              background: '#00c9a7',
              color: '#0d0f12',
              opacity: inputText.trim() ? 1 : 0.5,
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            Working
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#f5a623' }} />
            CEO Calling
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
            Question Pending
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#4b5563' }} />
            Idle
          </div>
        </div>
      </div>
    </div>
  );
}

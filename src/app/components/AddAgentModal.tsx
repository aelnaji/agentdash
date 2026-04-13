import { useState } from 'react';
import { Agent } from '../App';
import { X } from 'lucide-react';

type AddAgentModalProps = {
  onClose: () => void;
  onAdd: (agent: Omit<Agent, 'id'>) => void;
};

const specializations = ['Backend', 'Frontend', 'QA', 'DevOps', 'Data', 'Research', 'Custom'];

export function AddAgentModal({ onClose, onAdd }: AddAgentModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specialization, setSpecialization] = useState('Backend');
  const [task, setTask] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !role.trim() || !task.trim()) {
      return;
    }

    const avatar = name
      .split('-')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    onAdd({
      name: name.trim(),
      role: role.trim(),
      task: task.trim(),
      status: isActive ? 'working' : 'idle',
      avatar,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-xl"
        style={{ background: '#161a1f', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e8eaed' }}>
            Add New Agent
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors hover:bg-opacity-80"
            style={{ background: '#1e2329' }}
          >
            <X className="w-5 h-5" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                Agent Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="AGENT-NAME"
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{
                  background: '#1e2329',
                  color: '#e8eaed',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                required
              />
            </div>

            {/* Role / Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Backend Engineer"
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{
                  background: '#1e2329',
                  color: '#e8eaed',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                required
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{
                  background: '#1e2329',
                  color: '#e8eaed',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Task */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e8eaed' }}>
                Initial Task Description
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Describe the initial task..."
                rows={3}
                className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                style={{
                  background: '#1e2329',
                  color: '#e8eaed',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                required
              />
            </div>

            {/* Status on Create */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#00c9a7',
                  }}
                />
                <span className="text-sm" style={{ color: '#e8eaed' }}>
                  Start as Active
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded text-sm font-medium transition-colors"
              style={{
                background: '#1e2329',
                color: '#e8eaed',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded text-sm font-medium"
              style={{
                background: '#00c9a7',
                color: '#0d0f12',
              }}
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

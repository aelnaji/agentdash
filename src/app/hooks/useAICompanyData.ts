import { useEffect, useRef, useState } from 'react';
import { getAgents, getTasks, getStats, getProviders, getModels } from '../lib/api';
import type { ApiAgent, ApiTask, ApiStats, ApiProvider, ApiModel } from '../lib/api';
import { mapApiAgent } from '../lib/mappers';
import type { Agent, ActivityLog } from '../App';

interface UseAICompanyDataProps {
  isPaused: boolean;
  onAgentsLoaded: (agents: Agent[]) => void;
  onActivityAppend: (log: ActivityLog) => void;
}

export function useAICompanyData({ isPaused, onAgentsLoaded, onActivityAppend }: UseAICompanyDataProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [models, setModels] = useState<ApiModel[]>([]);
  const [rawAgents, setRawAgents] = useState<ApiAgent[]>([]);
  const [rawTasks, setRawTasks] = useState<ApiTask[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [agents, tasks, statsData, providerData, modelData] = await Promise.all([
          getAgents(),
          getTasks(),
          getStats(),
          getProviders(),
          getModels(),
        ]);
        setRawAgents(agents);
        setRawTasks(tasks);
        setStats(statsData);
        setProviders(providerData);
        setModels(modelData);
        const mapped = agents.map(a => mapApiAgent(a, tasks));
        onAgentsLoaded(mapped);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Poll tasks every 8s when not paused to catch status changes
  useEffect(() => {
    if (isPaused) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        const [agents, tasks] = await Promise.all([getAgents(), getTasks()]);
        setRawAgents(agents);
        setRawTasks(tasks);
        const mapped = agents.map(a => mapApiAgent(a, tasks));
        onAgentsLoaded(mapped);

        // Append a live log entry for any in-progress task
        const active = tasks.filter(t => t.status === 'in_progress');
        if (active.length > 0) {
          const pick = active[Math.floor(Math.random() * active.length)];
          onActivityAppend({
            id: `poll-${Date.now()}`,
            timestamp: new Date(),
            agentName: pick.assignedAgent?.name ?? 'Agent',
            action: pick.title,
          });
        }
      } catch (_) {
        // silent poll failure — don't surface to UI
      }
    }, 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isPaused]);

  return { loading, error, stats, providers, models, rawAgents, rawTasks };
}

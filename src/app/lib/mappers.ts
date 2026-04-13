import type { Agent } from '../App';
import type { ApiAgent, ApiTask } from './api';

// Maps AICOMPANY API agent → dashboard Agent shape
export function mapApiAgent(a: ApiAgent, tasks: ApiTask[]): Agent {
  const agentTasks = tasks.filter(t => t.assignedAgentId === a.id);
  const activeTask = agentTasks.find(t => t.status === 'in_progress');
  const latestTask = activeTask ?? agentTasks[0];

  return {
    id: a.id,
    name: a.name,
    role: a.role,
    task: latestTask?.title ?? 'Standby',
    status: !a.isActive ? 'idle' : activeTask ? 'working' : 'idle',
    avatar: a.name
      .split(/[-\s]+/)
      .map(w => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join(''),
    // extra fields available via original API data
    _meta: {
      modelName: a.model?.displayName ?? a.model?.name ?? 'Unknown',
      providerName: a.provider?.name ?? 'Unknown',
      taskCount: a._count.tasks,
    },
  } as Agent;
}

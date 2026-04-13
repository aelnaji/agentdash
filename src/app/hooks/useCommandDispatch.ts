import { ApiTask, createTask } from '../lib/api';
import type { Agent, Message } from '../App';

// Routes a CEO command to the correct agent by keyword matching
export function routeCommand(cmd: string, agents: Agent[]): Agent | undefined {
  const lower = cmd.toLowerCase();
  if (/(test|qa|spec|assert|coverage)/.test(lower))
    return agents.find(a => /qa/i.test(a.role)) ?? agents[0];
  if (/(db|sql|api|backend|schema|migrate|prisma)/.test(lower))
    return agents.find(a => /back/i.test(a.role)) ?? agents[0];
  if (/(ui|frontend|css|layout|component|style|react)/.test(lower))
    return agents.find(a => /front/i.test(a.role)) ?? agents[0];
  // Default: lead / first agent
  return agents.find(a => /lead|orchestrat/i.test(a.role)) ?? agents[0];
}

// Creates a real task in AICOMPANY and returns it
export async function dispatchCommandAsTask(
  cmd: string,
  targetAgent: Agent
): Promise<ApiTask> {
  return createTask({
    title: cmd.slice(0, 120),
    description: `Dispatched from AI HQ dashboard command bar at ${new Date().toISOString()}`,
    assignedAgentId: targetAgent.id,
  });
}

// Builds the auto-reply message for the chat window
export function buildAutoReply(cmd: string, agent: Agent, task: ApiTask): Message {
  return {
    id: `reply-${Date.now()}`,
    sender: 'agent',
    text: `Task #${task.id.slice(0, 8)} created. I will: ${cmd.slice(0, 60)}${cmd.length > 60 ? '...' : ''}`,
    timestamp: new Date(),
  };
}

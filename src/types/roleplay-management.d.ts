declare namespace RoleplayManagement {
  export interface Scenario {
    id: string;
    title: string;
    description: string;
    aiPersona: string;
    userPersona: string;
    requiredTasks: string[];
    type: 'SYSTEM' | 'AI_GENERATED' | 'USER_CREATED';
    level?: string;
    topic?: string;
    isPublic: boolean;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface GenerateScenarioPayload {
    topic: string;
    level: string;
    isPublic?: boolean;
  }

  export interface CreateScenarioPayload {
    title: string;
    description: string;
    aiPersona: string;
    userPersona: string;
    requiredTasks: string[];
    level?: string;
    topic?: string;
    isPublic?: boolean;
  }

  export interface StartRoleplayPayload {
    userId: string;
    scenarioId: string;
  }

  export interface ChatRoleplayPayload {
    sessionId: string;
    userMessage: string;
  }

  export interface SummarizeRoleplayPayload {
    sessionId: string;
  }
}

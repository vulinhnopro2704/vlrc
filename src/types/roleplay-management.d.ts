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
    scenarioId: string;
  }

  export interface ChatRoleplayPayload {
    sessionId: string;
    userMessage: string;
  }

  export interface ChatVoiceRoleplayPayload {
    sessionId: string;
    audioBase64: string;
    mimeType: string;
  }

  export interface SummarizeRoleplayPayload {
    sessionId: string;
  }

  export interface TaskEvaluation {
    task_1_completed: boolean;
    task_2_completed: boolean;
    task_3_completed: boolean;
  }

  export interface StartRoleplayResponse {
    sessionId: string;
    ai_first_message: string;
    audio?: {
      url: string | null;
      mimeType: string;
      provider: string;
      status: 'completed' | 'skipped' | 'failed';
    } | null;
  }

  export interface ChatRoleplayResponse {
    ai_spoken_response: string;
    task_evaluation: TaskEvaluation;
    grammar_feedback: string | null;
    scenario_completed: boolean;
    audio?: {
      url: string | null;
      mimeType: string;
      provider: string;
      status: 'completed' | 'skipped' | 'failed';
    } | null;
  }

  export interface ChatVoiceRoleplayResponse {
    user_spoken_transcript: string;
    ai_spoken_response: string;
    task_evaluation: TaskEvaluation;
    grammar_feedback: string | null;
    scenario_completed: boolean;
    audio?: {
      url: string | null;
      mimeType: string;
      provider: string;
      status: 'completed' | 'skipped' | 'failed';
    } | null;
  }

  export interface SessionEvaluation {
    id: string;
    sessionId: string;
    task1Completed: boolean;
    task2Completed: boolean;
    task3Completed: boolean;
    grammarFeedback: string[] | null;
  }

  export interface Message {
    id: string;
    sessionId: string;
    role: 'user' | 'ai';
    content: string;
    createdAt: string;
  }

  export interface SessionHistoryItem {
    id: string;
    userId: string;
    scenarioId: string;
    status: 'active' | 'completed';
    startedAt: string;
    endedAt: string | null;
    scenario: Scenario;
    sessionEvaluation: SessionEvaluation | null;
  }

  export interface SessionDetailsResponse extends SessionHistoryItem {
    messages: Message[];
  }
}


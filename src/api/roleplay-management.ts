import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

const ROLEPLAY_BASE_PATH = 'roleplay';

export const getScenarios = (params?: Record<string, any>) =>
  apiClient
    .get(`${ROLEPLAY_BASE_PATH}/scenarios`, { searchParams: params })
    .json<RoleplayManagement.Scenario[]>();

export const createScenario = (payload: RoleplayManagement.CreateScenarioPayload) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/scenarios`, { json: payload }).json<RoleplayManagement.Scenario>();

export const generateScenario = (payload: RoleplayManagement.GenerateScenarioPayload) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/scenarios/generate`, { json: payload }).json<RoleplayManagement.Scenario>();

export const startRoleplaySession = (payload: RoleplayManagement.StartRoleplayPayload) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/start`, { json: payload }).json<RoleplayManagement.StartRoleplayResponse>();

export const chatRoleplaySession = (payload: RoleplayManagement.ChatRoleplayPayload) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/chat`, { json: payload }).json<RoleplayManagement.ChatRoleplayResponse>();

export const chatVoiceRoleplaySession = (payload: RoleplayManagement.ChatVoiceRoleplayPayload) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/chat-voice`, { json: payload }).json<RoleplayManagement.ChatVoiceRoleplayResponse>();

export const getSessionHistory = () =>
  apiClient.get(`${ROLEPLAY_BASE_PATH}/history`).json<RoleplayManagement.SessionHistoryItem[]>();

export const getSessionDetails = (sessionId: string) =>
  apiClient.get(`${ROLEPLAY_BASE_PATH}/sessions/${sessionId}`).json<RoleplayManagement.SessionDetailsResponse>();

export const translateMessage = (sessionId: string, text: string) =>
  apiClient.post(`${ROLEPLAY_BASE_PATH}/sessions/${sessionId}/translate`, { json: { text } }).json<RoleplayManagement.TranslateMessageResponse>();

export const suggestReplies = (sessionId: string) =>
  apiClient.get(`${ROLEPLAY_BASE_PATH}/sessions/${sessionId}/suggest-replies`).json<RoleplayManagement.SuggestRepliesResponse>();

// ── TanStack Query ──

export const ROLEPLAY_QUERY_KEYS = {
  all: ['roleplay'] as const,
  scenarios: () => [...ROLEPLAY_QUERY_KEYS.all, 'scenarios'] as const,
  scenarioList: (params?: Record<string, any>) =>
    [...ROLEPLAY_QUERY_KEYS.scenarios(), params ?? {}] as const,
  history: () => [...ROLEPLAY_QUERY_KEYS.all, 'history'] as const,
  session: (sessionId: string) => [...ROLEPLAY_QUERY_KEYS.all, 'sessions', sessionId] as const
};

export const useScenariosQuery = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ROLEPLAY_QUERY_KEYS.scenarioList(params),
    queryFn: () => getScenarios(params)
  });

export const useSessionHistoryQuery = () =>
  useQuery({
    queryKey: ROLEPLAY_QUERY_KEYS.history(),
    queryFn: getSessionHistory
  });

export const useSessionDetailsQuery = (sessionId: string, enabled = false) =>
  useQuery({
    queryKey: ROLEPLAY_QUERY_KEYS.session(sessionId),
    queryFn: () => getSessionDetails(sessionId),
    enabled
  });

export const useGenerateScenarioMutation = (options?: {
  onSuccess?: (data: RoleplayManagement.Scenario) => void;
  onError?: (error: Error) => void;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateScenario,
    onSuccess: (scenario) => {
      queryClient.invalidateQueries({ queryKey: ROLEPLAY_QUERY_KEYS.scenarios() });
      toast.success(t('roleplay_generate_success', 'Scenario generated successfully!'));
      options?.onSuccess?.(scenario);
    },
    onError: (error) => {
      toast.error(`${t('roleplay_generate_error', 'Failed to generate scenario')}: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useStartRoleplayMutation = (options?: {
  onSuccess?: (data: RoleplayManagement.StartRoleplayResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: startRoleplaySession,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Lỗi bắt đầu kịch bản: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useChatRoleplayMutation = (options?: {
  onSuccess?: (data: RoleplayManagement.ChatRoleplayResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: chatRoleplaySession,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Lỗi gửi tin nhắn: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useChatVoiceRoleplayMutation = (options?: {
  onSuccess?: (data: RoleplayManagement.ChatVoiceRoleplayResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: chatVoiceRoleplaySession,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Lỗi gửi giọng nói: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useTranslateMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, text }: { sessionId: string; text: string }) => translateMessage(sessionId, text),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ROLEPLAY_QUERY_KEYS.session(sessionId) });
    },
    onError: (error) => {
      toast.error(`Lỗi dịch tin nhắn: ${(error as Error).message}`);
    }
  });
};

export const useSuggestRepliesMutation = () => {
  return useMutation({
    mutationFn: (sessionId: string) => suggestReplies(sessionId),
    onError: (error) => {
      toast.error(`Lỗi lấy gợi ý: ${(error as Error).message}`);
    }
  });
};


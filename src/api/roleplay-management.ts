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
  apiClient.post(`${ROLEPLAY_BASE_PATH}/start`, { json: payload }).json<{ sessionId: string, ai_first_message: string }>();

// ── TanStack Query ──

export const ROLEPLAY_QUERY_KEYS = {
  all: ['roleplay'] as const,
  scenarios: () => [...ROLEPLAY_QUERY_KEYS.all, 'scenarios'] as const,
  scenarioList: (params?: Record<string, any>) =>
    [...ROLEPLAY_QUERY_KEYS.scenarios(), params ?? {}] as const
};

export const useScenariosQuery = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ROLEPLAY_QUERY_KEYS.scenarioList(params),
    queryFn: () => getScenarios(params)
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

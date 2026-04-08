import apiClient from './api-client';

export const searchDictionary = (params: DictionaryManagement.SearchParams) =>
  apiClient
    .get('dictionary/search', {
      searchParams: params as unknown as Record<string, string | number | boolean>
    })
    .json<DictionaryManagement.SearchResponse>();

export const saveWordFromDictionary = (payload: DictionaryManagement.SavePayload) =>
  apiClient.post('vocabulary/from-dictionary', { json: payload }).json<Vocabulary.Note>();

export const DICTIONARY_QUERY_KEYS = {
  all: ['dictionary'] as const,
  search: (params: Partial<DictionaryManagement.SearchParams>) =>
    [...DICTIONARY_QUERY_KEYS.all, 'search', params] as const
};

export const useDictionarySearchQuery = (params: Partial<DictionaryManagement.SearchParams>) =>
  useQuery({
    queryKey: DICTIONARY_QUERY_KEYS.search(params),
    queryFn: () => searchDictionary(params as DictionaryManagement.SearchParams),
    enabled: !!params.word
  });

export const useSaveWordFromDictionaryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveWordFromDictionary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
      toast.success(t('dictionary_save_success'));
    },
    onError: error => {
      toast.error(`${t('dictionary_save_error')}: ${(error as Error).message}`);
    }
  });
};

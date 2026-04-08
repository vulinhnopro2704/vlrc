declare namespace DictionaryManagement {
  interface SearchParams {
    word: string;
    language?: string;
    type?: string;
    definition?: number;
  }

  interface SentenceAudio {
    key: string;
    trans?: string | null;
    audio?: string | null;
  }

  interface WordDetail {
    trans?: string | null;
    definition?: string | null;
    definitionGpt?: string | null;
    cefrLevel?: string | null;
    sentenceAudio?: SentenceAudio[];
  }

  interface Entry {
    id: number;
    content: string;
    position?: string | null;
    phoneticUs?: string | null;
    phoneticUk?: string | null;
    audioUs?: string | null;
    audioUk?: string | null;
    words: WordDetail[];
  }

  interface IeltsReference {
    name: string;
    title: string;
    content: string;
  }

  interface SearchResponse {
    data: Entry[];
    dataIelts?: IeltsReference[];
    code: number;
    msg?: string;
  }

  interface SavePayload {
    word: string;
    definition: string;
    cefrLevel?: string;
    translation?: string;
    phonetic?: string;
    audio?: string;
    example?: string;
    exampleTranslation?: string;
    partOfSpeech?: string;
    isFavorite?: boolean;
    note?: string;
  }
}

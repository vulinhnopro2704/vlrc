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

  interface Phoneme {
    character: string;
    characterAudio?: string | null;
    phonemes: string;
    phonemesAudio?: string | null;
  }

  interface Analyzing {
    typeWord: string;
    countPhoneme: number;
    phonemesUs: Phoneme[];
    phonemesUk: Phoneme[];
  }

  interface PhrasalVerb {
    id: number;
    wmId: number;
    phrasalVerbs: string;
    phoneticUk?: string | null;
    phoneticUs?: string | null;
    audioUk?: string | null;
    audioUs?: string | null;
  }

  interface IdiomTranslation {
    id: number;
    idiomId: number;
    idiom: string;
    definition?: string | null;
    example?: string | null;
    example2?: string | null;
  }

  interface Pivot {
    wmId: number;
    idiomId: number;
  }

  interface Idiom {
    id: number;
    wmId: number;
    idiom: string;
    audio?: string | null;
    definition?: string | null;
    definitionGpt?: string | null;
    example?: string | null;
    idiomsExAudio?: string | null;
    example2?: string | null;
    stressed?: string | null;
    reason?: string | null;
    idiomsTran?: IdiomTranslation | null;
    pivot: Pivot;
  }

  interface VerbForm {
    id: number;
    wmId: number;
    presentSimple?: string | null;
    presentSimplePhonetic?: string | null;
    presentSimpleAudioUs?: string | null;
    presentSimpleAudioUk?: string | null;
    singularVerb?: string | null;
    singularVerbPhonetic?: string | null;
    singularVerbAudioUs?: string | null;
    singularVerbAudioUk?: string | null;
    pastSimple?: string | null;
    pastSimplePhonetic?: string | null;
    pastSimpleAudioUs?: string | null;
    pastSimpleAudioUk?: string | null;
    pastParticiple?: string | null;
    pastParticiplePhonetic?: string | null;
    pastParticipleAudioUs?: string | null;
    pastParticipleAudioUk?: string | null;
    ingForm?: string | null;
    ingFormPhonetic?: string | null;
    ingFormAudioUs?: string | null;
    ingFormAudioUk?: string | null;
  }

  interface ThesaurusItem {
    id: number;
    wmId: number;
    position: string;
    positionContent: string;
    strongestMatch: string;
    strongMatch: string;
    weakMatch: string;
    strongestOpposite: string;
    strongOpposite: string;
    weakOpposite: string;
    createdAt?: string | null;
    updatedAt?: string | null;
  }

  interface Synonyms {
    id: number;
    wId: number;
    synonym: string[];
  }

  interface Collocation {
    id: number;
    wId: number;
    collocations: string;
    audioUk?: string | null;
    definition?: string | null;
    audio?: string | null;
    review?: number;
    example?: string | null;
    example2?: string | null;
    colloExAudio?: string | null;
    stressed?: string | null;
    reason?: string | null;
    answer?: string | null;
    position?: string | null;
    phonetic?: string | null;
    phoneticUs?: string | null;
    collocationTrans?: Record<string, unknown> | null;
  }

  interface WordDetail {
    id?: number;
    wmId?: number;
    trans?: string | null;
    phonetic?: string | null;
    position?: string | null;
    picture?: string | null;
    audio?: string | null;
    definition?: string | null;
    definitionGpt?: string | null;
    cefrLevel?: string | null;
    ieltsLevel?: string | null;
    toeic?: string | null;
    single?: number | string | null;
    collo?: number | string | null;
    synonym?: number | string | null;
    review?: number;
    sentenceAudio?: SentenceAudio[];
    collocations?: Collocation[];
    synonyms?: Synonyms | null;
    isSaved?: boolean;
  }

  interface Entry {
    id: number;
    content: string;
    position?: string | null;
    phoneticUs?: string | null;
    phoneticUk?: string | null;
    audioUs?: string | null;
    audioUk?: string | null;
    analyzing?: Analyzing | null;
    phrasalVerbs?: PhrasalVerb[];
    idioms?: Idiom[];
    verbForm?: VerbForm | null;
    thesaurus?: ThesaurusItem[];
    isSaved?: boolean;
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
    definitionGpt?: string;
    cefrLevel?: string;
    translation?: string;
    phonetic?: string;
    audio?: string;
    phoneticUs?: string;
    phoneticUk?: string;
    audioUs?: string;
    audioUk?: string;
    example?: string;
    exampleTranslation?: string;
    examples?: Array<{
      example: string;
      exampleVi?: string;
      exampleAudio?: string;
      order?: number;
    }>;
    sourceProvider?: string;
    externalDictionaryId?: number;
    sourceMetadata?: Record<string, unknown>;
    partOfSpeech?: string;
    isFavorite?: boolean;
    note?: string;
  }
}

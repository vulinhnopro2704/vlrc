export const commonVerbsData: LearningManagement.Word[] = [
  {
    id: 1,
    word: 'persevere',
    pronunciation: 'pɜːsɪˈvɪə(r)',
    meaning: 'to continue doing something despite difficulty',
    meaningVi: 'kiên trì, bền bỉ',
    example: 'Despite many setbacks, she persevered in her studies until she graduated.',
    exampleVi: 'Mặc dù gặp nhiều khó khăn, cô ấy vẫn kiên trì học tập cho đến khi tốt nghiệp.',
    pos: 'verb',
    cefr: 'C1',
    partOfSpeech: 'Verb',
    difficulty: 8,
    synonyms: ['persist', 'endure', 'persist', 'continue']
  },
  {
    id: 2,
    word: 'advocate',
    pronunciation: 'ˈadvəkeɪt',
    meaning: 'to publicly support or suggest an idea, policy, or cause',
    meaningVi: 'ủng hộ, đề xuất',
    example: 'The organization advocates for environmental protection and sustainable living.',
    exampleVi: 'Tổ chức này ủng hộ bảo vệ môi trường và sống bền vững.',
    pos: 'verb',
    cefr: 'B2',
    partOfSpeech: 'Verb',
    difficulty: 7,
    synonyms: ['support', 'recommend', 'promote', 'endorse']
  },
  {
    id: 3,
    word: 'deliberate',
    pronunciation: 'dɪˈlɪbəreɪt',
    meaning: 'to think carefully about something, or done consciously and intentionally',
    meaningVi: 'cân nhắc kỹ, cố ý',
    example: 'The team deliberated for hours before making the final decision.',
    exampleVi: 'Đội ngũ đã cân nhắc trong vài giờ trước khi đưa ra quyết định cuối cùng.',
    pos: 'verb',
    cefr: 'B2',
    partOfSpeech: 'Verb',
    difficulty: 6,
    synonyms: ['consider', 'ponder', 'think', 'reflect']
  },
  {
    id: 4,
    word: 'eloquent',
    pronunciation: 'ˈɛləkwənt',
    meaning: 'fluent or persuasive in speaking or writing',
    meaningVi: 'hùng biện, lưu loát',
    example: 'The speaker delivered an eloquent speech that moved the entire audience.',
    exampleVi: 'Người nói đã có bài phát biểu hùng biện làm xúc động cả khán giả.',
    pos: 'adjective',
    cefr: 'C1',
    partOfSpeech: 'Adjective',
    difficulty: 8,
    synonyms: ['articulate', 'fluent', 'expressive', 'persuasive']
  },
  {
    id: 5,
    word: 'meticulous',
    pronunciation: 'məˈtɪkjələs',
    meaning: 'very careful and precise about details',
    meaningVi: 'cẩn thận, chính xác',
    example: 'The scientist conducted a meticulous experiment to ensure accurate results.',
    exampleVi: 'Nhà khoa học tiến hành một thí nghiệm cẩn thận để đảm bảo kết quả chính xác.',
    pos: 'adjective',
    cefr: 'C1',
    partOfSpeech: 'Adjective',
    difficulty: 8,
    synonyms: ['careful', 'thorough', 'precise', 'detailed']
  }
];

export const vocabularyById = (id: number): LearningManagement.Word | undefined => {
  return commonVerbsData.find(word => word.id === id);
};

export const vocabulariesByLesson = (lessonId: number): LearningManagement.Word[] => {
  return commonVerbsData.filter(word => word.lessonId === lessonId);
};

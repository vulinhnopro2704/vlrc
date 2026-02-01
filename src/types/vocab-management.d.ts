declare namespace VocabManagement {
  /** A single vocabulary word */
  type Word = {
    id: string;
    term: string;
    definition: string;
  };

  /** A lesson consisting of multiple words */
  type Lesson = {
    id: string;
    title: string;
    words: Word[];
  };
}

declare namespace LearningManagement {
  type DateTime = string;

  interface Course extends App.Base {
    title: string;
    enTitle?: string;
    description?: string;
    image?: string;
    icon: string;
    lessons: Lesson[];
    progress?: number;
  }

  interface Lesson extends App.Base {
    title: string;
    description?: string;
    image?: string;
    courseId?: number;
    course?: Course;
    words: Word[];
    wordCount: number;
    completed: boolean;
  }

  interface Word extends App.Base {
    word: string;
    pronunciation: string;
    meaning: string;
    example?: string;
    exampleVi?: string;
    image?: string;
    audio?: string;
    lessonId?: number;
    pos?: string;
    cefr: string;
    lesson?: Lesson;
  }
}

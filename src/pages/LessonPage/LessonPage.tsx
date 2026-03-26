'use client';

import { AppLayout, AppSidebar } from '@/components/shared';
import { ExerciseManager } from '@/components/Exercises';
import { commonVerbsLesson } from '@/data/seedVocabularies';
import Icons from '@/components/Icons';

gsap.registerPlugin(useGSAP);

const mockLessons: Record<number, LearningManagement.Lesson> = {
  101: commonVerbsLesson
};

const exerciseTypes: LearningManagement.ActivityType[] = [
  'flip',
  'listen-fill',
  'fill-blank',
  'meaning-lookup'
];

const LessonPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lessonId } = useParams({ from: '/lessons/$lessonId' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentExerciseTypeIndex, setCurrentExerciseTypeIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const lesson = mockLessons[parseInt(lessonId)];
  const lessonWords = lesson?.words ?? [];
  const currentWord = lessonWords[currentIndex];
  const currentExerciseType = exerciseTypes[currentExerciseTypeIndex];

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex, currentExerciseTypeIndex]);

  useGSAP(
    () => {
      if (pageRef.current) {
        gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      }
    },
    { scope: pageRef }
  );

  const handleExerciseComplete = (result: LearningManagement.ActivityResult) => {
    void result;

    if (currentExerciseTypeIndex < exerciseTypes.length - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    } else {
      // Lesson completed
    }
  };

  const handlePrev = () => {
    if (currentExerciseTypeIndex > 0) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentExerciseTypeIndex(exerciseTypes.length - 1);
    }
  };

  const handleNext = () => {
    if (currentExerciseTypeIndex < exerciseTypes.length - 1) {
      setCurrentExerciseTypeIndex(currentExerciseTypeIndex + 1);
    } else if (lesson && currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentExerciseTypeIndex(0);
    }
  };

  const sidebarLinks = [
    {
      label: t('learning_my_courses'),
      href: '/courses',
      icon: <Icons.BookOpen className='h-4 w-4' />
    },
    {
      label: t('learning_dashboard'),
      href: '/dashboard',
      icon: <Icons.BarChart3 className='h-4 w-4' />
    }
  ];

  if (!lesson || !currentWord) {
    return (
      <AppLayout>
        <div className='flex items-center justify-center h-screen'>
          <p className='text-muted-foreground'>{t('learning_select_lesson')}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div ref={pageRef} className='flex h-screen bg-background'>
        <AppSidebar
          links={sidebarLinks}
          isLessonMode
          courseName='Daily Vocabulary'
          lessonName={lesson.title}
          onBackToCourse={() =>
            navigate({
              to: '/courses/$courseId',
              params: { courseId: '1' }
            })
          }
        />

        <main className='flex-1 overflow-auto p-8'>
          <div className='max-w-4xl mx-auto h-full flex flex-col'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl font-bold mb-2'>{lesson.title}</h1>
              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground'>{lesson.wordCount} vocabulary items</p>
                <span className='text-sm font-semibold text-primary'>
                  {currentIndex + 1} / {lessonWords.length}
                </span>
              </div>
            </div>

            {/* Exercise Component */}
            <div className='flex-1 flex items-center justify-center mb-8'>
              <div className='w-full'>
                <div className='mb-4 flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>
                    Word {currentIndex + 1} / {lesson?.wordCount || 0}
                  </span>
                  <span className='text-muted-foreground'>
                    Exercise {currentExerciseTypeIndex + 1} / {exerciseTypes.length}
                  </span>
                </div>
                <ExerciseManager
                  vocabulary={currentWord!}
                  allVocabularies={lessonWords}
                  exerciseType={currentExerciseType}
                  onComplete={handleExerciseComplete}
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className='mb-8'>
              <div className='w-full h-2 bg-primary/20 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-primary to-accent transition-all duration-300'
                  style={{ width: `${((currentIndex + 1) / lessonWords.length) * 100}%` }}
                />
              </div>
            </div>
            {/* Navigation Buttons */}
            <div className='flex items-center justify-between gap-4'>
              <Button
                variant='outline'
                onClick={handlePrev}
                disabled={currentIndex === 0 && currentExerciseTypeIndex === 0}>
                <Icons.ChevronLeft className='h-4 w-4 mr-2' />
                Previous
              </Button>
              <div className='text-center text-sm text-muted-foreground'>
                {currentIndex + 1} of {lessonWords.length}
              </div>
              <Button
                onClick={handleNext}
                disabled={
                  currentIndex === lessonWords.length - 1 &&
                  currentExerciseTypeIndex === exerciseTypes.length - 1
                }>
                Next
                <Icons.ChevronRight className='h-4 w-4 ml-2' />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default LessonPage;

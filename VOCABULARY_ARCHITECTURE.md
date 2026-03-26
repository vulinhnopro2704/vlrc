# Vocabulary Learning Architecture

## Overview

This document describes the extensible architecture for vocabulary learning features in the VLRC e-learning platform. The design supports multiple interactive card components, comprehensive seed data, and reusable hooks for state management and browser API integration.

## Architecture Components

### 1. Type System (`src/types/learning-management.d.ts`)

Extended types supporting various activity types and comprehensive vocabulary data:

```typescript
type ActivityType =
  | 'flip'
  | 'listen-fill'
  | 'fill-blank'
  | 'meaning-lookup'
  | 'multiple-choice'
  | 'pronunciation';

interface Word extends App.Base {
  word: string;
  pronunciation: string;
  meaning: string;
  meaningVi?: string;
  example?: string;
  exampleVi?: string;
  audio?: string;
  pos?: string;
  cefr: string;
  partOfSpeech?: string;
  synonyms?: string[];
  difficulty?: number;
}

interface VocabularyProgress {
  wordId: number;
  reviewCount: number;
  correctCount: number;
  proficiencyLevel: number;
  masteryScore: number;
}

interface ActivityResult {
  wordId: number;
  activityType: ActivityType;
  isCorrect: boolean;
  timeSpent: number;
  attempts: number;
  timestamp: DateTime;
}
```

### 2. Seed Data (`src/data/vocabularies.ts`)

Comprehensive vocabulary dataset with:

- English word
- Pronunciation (IPA format)
- English meaning
- Vietnamese translation
- Example sentences (both English and Vietnamese)
- Part of speech
- CEFR proficiency level
- Synonyms
- Difficulty rating

**Adding new vocabularies:**

```typescript
export const commonVerbsData: LearningManagement.Word[] = [
  {
    id: 1,
    word: 'persevere',
    pronunciation: 'pɜːsɪˈvɪə(r)',
    meaning: 'to continue doing something despite difficulty',
    meaningVi: 'kiên trì, bền bỉ',
    example: '...',
    cefr: 'C1'
    // ... other properties
  }
];
```

### 3. Hooks

#### `useAudioSynthesis` (`src/hooks/useAudioSynthesis.ts`)

Integrates browser Web Speech API for pronunciation playback:

```typescript
const { speak, stop, pause, resume, isPlaying, isSynthesizing, isSupported } = useAudioSynthesis({
  rate: 0.8,
  pitch: 1,
  volume: 1,
  lang: 'en-US'
});

// Usage
speak('word');
```

**Features:**

- Text-to-speech playback
- Pause/resume support
- Error handling
- Customizable rate, pitch, and volume

#### `useVocabularyProgress` (`src/hooks/useVocabularyProgress.ts`)

Manages vocabulary learning progress and proficiency tracking:

```typescript
const { progress, metrics, recordActivity, getProgressForWord, updateMetrics } =
  useVocabularyProgress();

recordActivity({
  wordId: 1,
  activityType: 'flip',
  isCorrect: true,
  timeSpent: 5000,
  attempts: 1,
  timestamp: new Date().toISOString()
});
```

**Features:**

- Proficiency level calculation (1-5 scale)
- Mastery score (0-100)
- Spaced repetition scheduling
- Progress metrics aggregation

### 4. Card Components

All card components accept the standard `ActivityCardProps`:

```typescript
interface ActivityCardProps {
  vocabulary: Word;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onComplete?: (result: ActivityResult) => void;
  disabled?: boolean;
}
```

#### VocabCard (Flip Card)

**File:** `src/components/VocabCard/VocabCard.tsx`

Interactive flashcard with front (word/pronunciation) and back (meaning/example) sides. Supports hover and click flip animations.

```typescript
<VocabCard
  vocabulary={word}
  flipOnHover={true}
  flipOnClick={true}
  showExample={true}
  labels={{ pronunciation: 'Pronunciation', ... }}
/>
```

#### ListenAndFillCard

**File:** `src/components/VocabCard/ListenAndFillCard.tsx`

Listen-and-fill exercise using Web Speech API:

1. User clicks to hear pronunciation
2. User types the word
3. System validates input with feedback

```typescript
<ListenAndFillCard
  vocabulary={word}
  onCorrect={() => console.log('Correct!')}
/>
```

#### FillBlankCard

**File:** `src/components/VocabCard/FillBlankCard.tsx`

Fill-in-the-blank exercise:

1. Shows example sentence with missing word
2. User types the missing word
3. Enter key or button to submit

```typescript
<FillBlankCard vocabulary={word} />
```

#### MeaningLookupCard

**File:** `src/components/VocabCard/MeaningLookupCard.tsx`

Multiple-choice meaning identification:

1. Shows word and pronunciation
2. User selects correct meaning from options
3. Displays feedback with correct answer

```typescript
<MeaningLookupCard vocabulary={word} />
```

### 5. VocabCardFactory

**File:** `src/components/VocabCard/VocabCardFactory.tsx`

Factory pattern for rendering appropriate card component based on activity type:

```typescript
<VocabCardFactory
  vocabulary={word}
  activityType="listen-fill"
  fallbackToFlip={true}
/>
```

Automatically cycles through activity types or uses lesson-specific activities:

- flip → listen-fill → fill-blank → meaning-lookup → flip

### 6. ActivityManager Utility

**File:** `src/utils/activityManager.ts`

Centralized activity tracking and analytics:

```typescript
import { activityManager } from '@/utils/activityManager';

// Record activity
activityManager.recordActivity({
  wordId: 1,
  activityType: 'flip',
  isCorrect: true,
  timeSpent: 5000,
  attempts: 1,
  timestamp: new Date().toISOString()
});

// Get statistics
const stats = activityManager.getStatistics();
const successRate = activityManager.getWordSuccessRate(1);
const nextActivityType = activityManager.getRecommendedNextActivityType(1);
```

**Features:**

- Activity sequencing
- Success rate calculation
- Time tracking
- Statistics aggregation
- Export/import activities

## Adding New Activity Types

### Step 1: Update Types

```typescript
// src/types/learning-management.d.ts
type ActivityType = '...' | 'new-activity-type';
```

### Step 2: Create Component

```typescript
// src/components/VocabCard/NewActivityCard.tsx
export const NewActivityCard = ({
  vocabulary,
  onCorrect,
  onIncorrect,
  disabled
}: ActivityCardProps) => {
  // Implementation
};
```

### Step 3: Register in Factory

```typescript
// src/components/VocabCard/VocabCardFactory.tsx
case 'new-activity-type':
  return <NewActivityCard vocabulary={vocabulary} onCorrect={onCorrect} />;
```

### Step 4: Add to Activity Sequence (Optional)

```typescript
// src/utils/activityManager.ts
const activitySequence = [..., 'new-activity-type'];
```

## Integration Example

```typescript
import { VocabCardFactory } from '@/components/VocabCard';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { useAudioSynthesis } from '@/hooks/useAudioSynthesis';
import { activityManager } from '@/utils/activityManager';

export const LessonLearning = ({ lesson }: { lesson: LearningManagement.Lesson }) => {
  const { recordActivity, metrics } = useVocabularyProgress();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const currentWord = lesson.words[currentWordIndex];
  const activityType = activityManager.getActivityTypeForWord(currentWordIndex, lesson.activities);

  const handleActivityComplete = (result: LearningManagement.ActivityResult) => {
    recordActivity(result);
    activityManager.recordActivity(result);

    if (currentWordIndex < lesson.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  return (
    <VocabCardFactory
      vocabulary={currentWord}
      activityType={activityType}
      onComplete={handleActivityComplete}
    />
  );
};
```

## Data Flow

```
Lesson → Words → Activity Manager → VocabCardFactory → Specific Card Component
                       ↓
              useVocabularyProgress Hook
                       ↓
              useAudioSynthesis Hook (if needed)
                       ↓
              ActivityResult → recordActivity() → Metrics & Analytics
```

## Best Practices

1. **Always use VocabCardFactory** instead of importing card components directly when the activity type may vary
2. **Leverage useVocabularyProgress** for tracking user performance across sessions
3. **Use ActivityManager.getRecommendedNextActivityType()** to provide adaptive learning
4. **Implement error boundaries** around card components for graceful failure handling
5. **Seed comprehensive data** with pronunciation (IPA), translations, and examples for each vocabulary item

## Performance Considerations

- Card components use React.memo to prevent unnecessary re-renders
- Speech synthesis is cached by the browser
- Activity results are stored in memory with optional export functionality
- Consider pagination for large vocabulary sets (100+ words)

## Browser Compatibility

- Web Speech API (for audio): Chrome, Edge, Safari (iOS 14.5+), partially supported
- Modern CSS features: All modern browsers
- Fallback to flip cards for unsupported browsers

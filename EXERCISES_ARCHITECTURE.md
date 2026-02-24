# Exercise Architecture Documentation

## Overview

The Exercise architecture provides a modular, extensible system for implementing various vocabulary learning activities within the Lesson Page. Each exercise type is self-contained, manages its own state, and integrates seamlessly with the broader learning platform.

## Folder Structure

```
src/components/Exercises/
├── index.ts                          # Centralized exports
├── ExerciseManager.tsx               # Factory component routing to exercises
├── FlipCardExercise/
│   └── index.tsx                     # Interactive flip card component
├── ListenAndFillExercise/
│   └── index.tsx                     # Speech-based fill-in exercise
├── FillBlankExercise/
│   └── index.tsx                     # Contextual fill-blank exercise
└── MeaningLookupExercise/
    └── index.tsx                     # Multiple-choice meaning identification

src/data/
└── seedVocabularies.ts               # Comprehensive vocabulary seed data

src/hooks/
└── useAudioSynthesis.ts              # Browser Speech API integration
```

## Component Architecture

### 1. ExerciseManager
Central routing component that maps activity types to corresponding exercise components.

```tsx
<ExerciseManager
  vocabulary={currentWord}
  allVocabularies={lesson.words}
  exerciseType="flip" | "listen-fill" | "fill-blank" | "meaning-lookup"
  onComplete={(result) => {}}
/>
```

### 2. Exercise Components

Each exercise component:
- Is self-contained in its own folder with `index.tsx`
- Manages local state and logic independently
- Accepts vocabulary data and callbacks
- Returns structured activity results
- Follows consistent styling and animations

#### FlipCardExercise
Interactive card that flips to reveal meanings and examples.
- **Type**: Interactive display
- **Interaction**: Click/hover to flip
- **Feedback**: Immediate visual flip animation

#### ListenAndFillExercise
Speaks vocabulary word; user types matching text.
- **Type**: Audio input exercise
- **Interaction**: Play audio, type word
- **Browser APIs**: Web Speech API for synthesis
- **Feedback**: Real-time validation with visual indicators

#### FillBlankExercise
Sentence with missing word; user fills in blank.
- **Type**: Contextual exercise
- **Interaction**: Read example, type word
- **Context**: Full sentence display with pronunciation hint
- **Feedback**: Immediate correctness indication

#### MeaningLookupExercise
Multiple-choice meaning identification.
- **Type**: Recognition exercise
- **Interaction**: Select correct meaning from options
- **Options**: 1 correct + 3 randomly selected alternatives
- **Feedback**: Instant verification with educational detail

## Data Structure

### Vocabulary Model
```typescript
interface Word extends App.Base {
  word: string;                    // English word
  pronunciation: string;            // IPA format
  meaning: string;                  // English definition
  meaning_vi: string;               // Vietnamese definition
  example: string;                  // Example sentence
  exampleVi: string;                // Vietnamese translation
  image?: string;                   // Visual aid URL
  audio?: string;                   // Audio file URL
  pos: string;                      // Part of speech
  partOfSpeech: string;             // Full part of speech label
  synonyms: string[];               // Related words
  difficulty: number;               // 1-5 difficulty scale
  cefr: string;                     // CEFR level (A1-C2)
}
```

### Activity Types
```typescript
type ActivityType = 'flip' | 'listen-fill' | 'fill-blank' | 'meaning-lookup';
```

## Integration with Lesson Page

### Exercise Rotation Strategy
```typescript
const exerciseTypes: ActivityType[] = ['flip', 'listen-fill', 'fill-blank', 'meaning-lookup'];

// For each word:
// 1. Start with 'flip' exercise
// 2. Progress through all exercise types
// 3. Move to next word after completing all exercises
// 4. Repeat until lesson completion
```

### State Management
```typescript
const [currentIndex, setCurrentIndex] = useState(0);           // Word index
const [currentExerciseTypeIndex, setCurrentExerciseTypeIndex] = useState(0);  // Exercise type index
const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
```

### Navigation Flow
- **Forward**: Next exercise type → Next word → First exercise type
- **Backward**: Previous exercise type → Previous word → Last exercise type
- **Completion**: Track with `wordId-activityType` key pattern

## Hook Integration

### useAudioSynthesis
Manages browser Speech Synthesis API for pronunciation.

```typescript
const { speak, isPlaying, stop } = useAudioSynthesis();

speak(vocabulary.word, {
  lang: 'en-US',
  rate: 0.8,
  pitch: 1,
  volume: 1
});
```

### useVocabularyProgress
Tracks learning progress, proficiency levels, and spaced repetition.

## Adding New Exercise Types

### Step 1: Create Component
```typescript
// src/components/Exercises/MyCustomExercise/index.tsx
export default function MyCustomExercise({
  vocabulary,
  onComplete
}: LearningManagement.ActivityCardProps) {
  return (
    <div>
      {/* Exercise UI */}
    </div>
  );
}
```

### Step 2: Update Type Definition
```typescript
// In src/types/learning-management.d.ts
type ActivityType = '...' | 'my-custom-type';
```

### Step 3: Register in ExerciseManager
```typescript
// src/components/Exercises/ExerciseManager.tsx
case 'my-custom-type':
  return <MyCustomExercise vocabulary={vocabulary} onComplete={onComplete} />;
```

### Step 4: Export from Index
```typescript
// src/components/Exercises/index.ts
export { default as MyCustomExercise } from './MyCustomExercise';
```

### Step 5: Add to Exercise Rotation (if desired)
```typescript
// Update exerciseTypes array in LessonPage
const exerciseTypes = [..., 'my-custom-type'];
```

## Styling & Theming

All exercises leverage:
- **Glassmorphism**: `.glass-card` class for semi-transparent backgrounds
- **Dark Mode**: Automatic dark/light theme support via CSS variables
- **GSAP Animations**: Smooth transitions and interactions
- **Tailwind CSS**: Responsive design with flexbox/grid layouts

## Performance Considerations

1. **Audio Caching**: Browser caches speech synthesis results
2. **Component Lazy Loading**: Exercises load only when needed
3. **State Isolation**: Each exercise manages independent state
4. **Memoization**: Components wrapped with React.memo if needed

## Testing Exercise Components

Each exercise can be tested independently:

```typescript
// In Lesson Page or dedicated testing component
<ExerciseManager
  vocabulary={testWord}
  allVocabularies={testWords}
  exerciseType="flip"
  onComplete={(result) => console.log('Result:', result)}
/>
```

## Future Enhancements

- **Spaced Repetition**: Integrate FSRS algorithm for review scheduling
- **Difficulty Adaptation**: Auto-adjust exercises based on performance
- **Audio Recording**: Record and compare user pronunciation
- **Contextual Hints**: Provide hints based on performance
- **Gamification**: Points, badges, streaks per exercise type
- **Analytics**: Track individual performance per exercise type


import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import { ANIMATION_OPTIONS, EXPRESSION_OPTIONS } from './constants';

const toAnimationValue = (value: string): Tutor3DAnimation => {
  if ((Object.values(Tutor3DAnimation) as string[]).includes(value)) {
    return value as Tutor3DAnimation;
  }
  return Tutor3DAnimation.Idle;
};

const toExpressionValue = (value: string): Tutor3DFacialExpression => {
  if ((Object.values(Tutor3DFacialExpression) as string[]).includes(value)) {
    return value as Tutor3DFacialExpression;
  }
  return Tutor3DFacialExpression.Default;
};

const TutorControlPanel: FC<{
  text: string;
  selectedAnimation: Tutor3DAnimation;
  selectedExpression: Tutor3DFacialExpression;
  autoRotate: boolean;
  cameraDistance: number;
  runtimeState: Tutor3DManagement.RuntimeState;
  currentViseme: string;
  selectedFileName: string;
  onTextChange: (value: string) => void;
  onAnimationChange: (value: Tutor3DAnimation) => void;
  onExpressionChange: (value: Tutor3DFacialExpression) => void;
  onCameraDistanceChange: (value: number) => void;
  onAutoRotateToggle: () => void;
  onFileChange: (file: File | null) => void;
  onPlay: () => void;
  onStop: () => void;
}> = ({
  text,
  selectedAnimation,
  selectedExpression,
  autoRotate,
  cameraDistance,
  runtimeState,
  currentViseme,
  selectedFileName,
  onTextChange,
  onAnimationChange,
  onExpressionChange,
  onCameraDistanceChange,
  onAutoRotateToggle,
  onFileChange,
  onPlay,
  onStop
}) => {
  return (
    <section className='space-y-4 rounded-2xl border bg-card p-4 shadow-sm md:p-5'>
      <div className='space-y-1'>
        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
          3D Tutor Sandbox
        </p>
        <h1 className='text-2xl font-bold text-foreground'>Avatar QA</h1>
        <p className='text-sm leading-relaxed text-muted-foreground'>
          Play real audio file for lipsync test. No mock or synthetic audio.
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='tutor-audio-file'>Audio file</Label>
        <Input
          id='tutor-audio-file'
          type='file'
          accept='audio/*'
          onChange={event => onFileChange(event.target.files?.[0] ?? null)}
        />
        <p className='text-xs text-muted-foreground'>
          Selected: {selectedFileName || 'No file selected'}
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='tutor-script-text'>Transcript</Label>
        <Textarea
          id='tutor-script-text'
          value={text}
          rows={4}
          onChange={event => onTextChange(event.target.value)}
          placeholder='Transcript for reference during QA review'
        />
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='tutor-animation-select'>Animation</Label>
          <Select
            value={selectedAnimation}
            onValueChange={value => onAnimationChange(toAnimationValue(value))}>
            <SelectTrigger id='tutor-animation-select'>
              <SelectValue placeholder='Select animation' />
            </SelectTrigger>
            <SelectContent>
              {ANIMATION_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='tutor-expression-select'>Facial expression</Label>
          <Select
            value={selectedExpression}
            onValueChange={value => onExpressionChange(toExpressionValue(value))}>
            <SelectTrigger id='tutor-expression-select'>
              <SelectValue placeholder='Select expression' />
            </SelectTrigger>
            <SelectContent>
              {EXPRESSION_OPTIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm text-foreground'>
          <span>Camera distance</span>
          <span className='font-medium'>{cameraDistance.toFixed(2)}</span>
        </div>
        <input
          type='range'
          min={1.4}
          max={2.7}
          step={0.05}
          value={cameraDistance}
          onChange={event => onCameraDistanceChange(Number(event.target.value))}
          className='h-2 w-full cursor-pointer accent-primary'
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button onClick={onPlay} className='min-w-32'>
          Play
        </Button>
        <Button variant='outline' onClick={onStop}>
          Stop
        </Button>
        <Button variant='ghost' onClick={onAutoRotateToggle}>
          {autoRotate ? 'Disable Auto Rotate' : 'Enable Auto Rotate'}
        </Button>
      </div>

      <div className='rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground'>
        <p>
          <span className='font-semibold text-foreground'>Runtime:</span> {runtimeState.animation} /{' '}
          {runtimeState.facialExpression}
        </p>
        <p>
          <span className='font-semibold text-foreground'>LipSync viseme:</span> {currentViseme}
        </p>
      </div>
    </section>
  );
};

export default TutorControlPanel;

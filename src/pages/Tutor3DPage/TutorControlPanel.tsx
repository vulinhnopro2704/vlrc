import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';
import { cn } from '@/lib/utils';
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
  animationFadeDuration: number;
  expressionIntensity: number;
  visemeStrength: number;
  visemeSmoothing: number;
  runtimeState: Tutor3DManagement.RuntimeState;
  currentViseme: string;
  selectedFileName: string;
  onTextChange: (value: string) => void;
  onAnimationChange: (value: Tutor3DAnimation) => void;
  onExpressionChange: (value: Tutor3DFacialExpression) => void;
  onCameraDistanceChange: (value: number) => void;
  onAnimationFadeDurationChange: (value: number) => void;
  onExpressionIntensityChange: (value: number) => void;
  onVisemeStrengthChange: (value: number) => void;
  onVisemeSmoothingChange: (value: number) => void;
  onAutoRotateToggle: () => void;
  onFileChange: (file: File | null) => void;
  onPlay: () => void;
  onStop: () => void;
  className?: string;
}> = ({
  text,
  selectedAnimation,
  selectedExpression,
  autoRotate,
  cameraDistance,
  animationFadeDuration,
  expressionIntensity,
  visemeStrength,
  visemeSmoothing,
  runtimeState,
  currentViseme,
  selectedFileName,
  onTextChange,
  onAnimationChange,
  onExpressionChange,
  onCameraDistanceChange,
  onAnimationFadeDurationChange,
  onExpressionIntensityChange,
  onVisemeStrengthChange,
  onVisemeSmoothingChange,
  onAutoRotateToggle,
  onFileChange,
  onPlay,
  onStop,
  className
}) => {
  return (
    <section
      className={cn(
        'space-y-4 rounded-2xl border border-white/25 bg-slate-900/75 p-4 text-slate-100 shadow-2xl backdrop-blur-xl',
        className
      )}>
      <div className='space-y-1'>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/90'>
          Tutor 3D Studio
        </p>
        <h1 className='text-xl font-semibold text-white'>Avatar Control Panel</h1>
        <p className='text-sm leading-relaxed text-slate-200/80'>
          Fullscreen QA playground with live lipsync + animation controls.
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
        <p className='text-xs text-slate-300/90'>
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

      <div className='space-y-3 rounded-xl border border-white/15 bg-black/20 p-3'>
        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-300'>Camera & Motion</p>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm text-slate-100'>
            <span>Camera distance</span>
            <span className='font-medium text-slate-200'>{cameraDistance.toFixed(2)}</span>
          </div>
          <input
            type='range'
            min={2}
            max={5}
            step={0.05}
            value={cameraDistance}
            onChange={event => onCameraDistanceChange(Number(event.target.value))}
            className='h-2 w-full cursor-pointer accent-sky-400'
          />
        </div>

        <div className='flex items-center justify-between text-sm text-slate-100'>
          <span>Transition blend</span>
          <span className='font-medium text-slate-200'>{animationFadeDuration.toFixed(2)}s</span>
        </div>
        <input
          type='range'
          min={0.05}
          max={0.8}
          step={0.05}
          value={animationFadeDuration}
          onChange={event => onAnimationFadeDurationChange(Number(event.target.value))}
          className='h-2 w-full cursor-pointer accent-sky-400'
        />
      </div>

      <div className='space-y-3 rounded-xl border border-white/15 bg-black/20 p-3'>
        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-300'>Face & Lipsync</p>

        <div className='flex items-center justify-between text-sm text-slate-100'>
          <span>Expression intensity</span>
          <span className='font-medium text-slate-200'>{expressionIntensity.toFixed(2)}</span>
        </div>
        <input
          type='range'
          min={0}
          max={1.5}
          step={0.05}
          value={expressionIntensity}
          onChange={event => onExpressionIntensityChange(Number(event.target.value))}
          className='h-2 w-full cursor-pointer accent-sky-400'
        />

        <div className='flex items-center justify-between text-sm text-slate-100'>
          <span>Viseme strength</span>
          <span className='font-medium text-slate-200'>{visemeStrength.toFixed(2)}</span>
        </div>
        <input
          type='range'
          min={0.1}
          max={1.8}
          step={0.05}
          value={visemeStrength}
          onChange={event => onVisemeStrengthChange(Number(event.target.value))}
          className='h-2 w-full cursor-pointer accent-sky-400'
        />

        <div className='flex items-center justify-between text-sm text-slate-100'>
          <span>Viseme smoothing</span>
          <span className='font-medium text-slate-200'>{visemeSmoothing.toFixed(0)}</span>
        </div>
        <input
          type='range'
          min={8}
          max={28}
          step={1}
          value={visemeSmoothing}
          onChange={event => onVisemeSmoothingChange(Number(event.target.value))}
          className='h-2 w-full cursor-pointer accent-sky-400'
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button onClick={onPlay} className='min-w-24 bg-sky-500 text-white hover:bg-sky-600'>
          Play
        </Button>
        <Button
          variant='outline'
          onClick={onStop}
          className='border-white/40 bg-white/5 text-slate-100 hover:bg-white/15'>
          Stop
        </Button>
        <Button variant='ghost' onClick={onAutoRotateToggle} className='text-slate-200 hover:bg-white/10'>
          {autoRotate ? 'Auto Rotate: On' : 'Auto Rotate: Off'}
        </Button>
      </div>

      <div className='rounded-xl border border-white/20 bg-black/25 p-3 text-xs text-slate-200/90'>
        <p>
          <span className='font-semibold text-white'>Runtime:</span> {runtimeState.animation} /{' '}
          {runtimeState.facialExpression}
        </p>
        <p>
          <span className='font-semibold text-white'>LipSync viseme:</span> {currentViseme}
        </p>
      </div>
    </section>
  );
};

export default TutorControlPanel;

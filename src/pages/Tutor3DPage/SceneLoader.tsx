import { Html } from '@react-three/drei';

const SceneLoader = () => {
  return (
    <Html center>
      <div className='rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-semibold text-foreground whitespace-nowrap shadow-lg'>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading 3D assets...
        </span>
      </div>
    </Html>
  );
};

export default SceneLoader;

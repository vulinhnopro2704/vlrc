const SceneLoader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className='rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-semibold text-foreground'>
        Loading 3D assets... {Math.round(progress)}%
      </div>
    </Html>
  );
};

export default SceneLoader;

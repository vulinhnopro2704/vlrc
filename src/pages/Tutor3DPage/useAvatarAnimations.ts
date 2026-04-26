import { Tutor3DAnimation } from '@/enums/tutor-3d';
import {
  ANIMATION_LIBRARY_PATH,
  AVATAR_MODEL_PATH,
  EXTRA_ANIMATION_FILES
} from '@/constants/moded-3d-config';
import { KTX2Loader } from 'three-stdlib';



export const useAvatarAnimations = (
  runtimeAnimation: Tutor3DAnimation,
  animationFadeDuration: number
) => {
  const gl = useThree(state => state.gl);

  const currentActionRef = useRef<Tutor3DAnimation | null>(null);
  const { scene } = useGLTF(
    AVATAR_MODEL_PATH,
    true,
    true,
    (loader) => {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/');
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);
    }
  ) as GLTF;
  const animationLibrary = useGLTF(
    ANIMATION_LIBRARY_PATH,
    true,
    true,
    (loader) => {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/');
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);
    }
  ) as GLTF;
  const angryGlb = useGLTF(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Angry]) as GLTF;
  const cryingGlb = useGLTF(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Crying]) as GLTF;
  const laughingGlb = useGLTF(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Laughing]) as GLTF;
  const terrifiedGlb = useGLTF(EXTRA_ANIMATION_FILES[Tutor3DAnimation.Terrified]) as GLTF;
  const dancingGlb = useGLTF(EXTRA_ANIMATION_FILES[Tutor3DAnimation.RumbaDancing]) as GLTF;

  const [avatarScene, setAvatarScene] = useState<Group | null>(null);
  const [mergedClips, setMergedClips] = useState<AnimationClip[]>([]);

  useEffect(() => {
    setAvatarScene(SkeletonUtils.clone(scene) as Group);
  }, [scene]);

  useEffect(() => {
    const clipsByName = new Map<string, AnimationClip>();

    animationLibrary.animations.forEach(clip => {
      clipsByName.set(clip.name, clip.clone());
    });

    const glbSources: Array<{ name: Tutor3DAnimation; source: GLTF }> = [
      { name: Tutor3DAnimation.Angry, source: angryGlb },
      { name: Tutor3DAnimation.Crying, source: cryingGlb },
      { name: Tutor3DAnimation.Laughing, source: laughingGlb },
      { name: Tutor3DAnimation.Terrified, source: terrifiedGlb },
      { name: Tutor3DAnimation.RumbaDancing, source: dancingGlb }
    ];

    glbSources.forEach(item => {
      const clip = item.source.animations.at(0);
      if (!clip) return;

      const normalizedClip = clip.clone();
      normalizedClip.name = item.name;
      clipsByName.set(item.name, normalizedClip);
    });

    setMergedClips([...clipsByName.values()]);
  }, [animationLibrary.animations, angryGlb, cryingGlb, laughingGlb, terrifiedGlb, dancingGlb]);

  const { actions } = useAnimations(mergedClips, avatarScene ?? undefined);

  useEffect(() => {
    const previousKey = currentActionRef.current;
    const previousAction = previousKey ? actions[previousKey] : undefined;
    const actionByState = actions[runtimeAnimation];
    const idleAction = actions[Tutor3DAnimation.Idle];
    const fallbackAction = Object.values(actions).find(Boolean);
    const nextAction = actionByState ?? idleAction ?? fallbackAction;

    if (!nextAction) return;

    if (previousAction && previousAction !== nextAction) {
      previousAction.fadeOut(animationFadeDuration);
    }

    nextAction.reset().fadeIn(animationFadeDuration).play();
    currentActionRef.current = runtimeAnimation;

    return () => {
      nextAction.fadeOut(animationFadeDuration);
    };
  }, [actions, animationFadeDuration, runtimeAnimation]);

  return { avatarScene };
};

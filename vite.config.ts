import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import AutoImport from 'unplugin-auto-import/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

function getExports(filePath: string): string[] {
  const exportsSet = new Set<string>();

  function resolvePath(basePath: string, relativePath: string): string | null {
    const dir = path.dirname(basePath);
    const absolute = path.resolve(dir, relativePath);
    const extensions = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
    for (const ext of extensions) {
      const p = absolute + ext;
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return p;
      }
    }
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      return absolute;
    }
    return null;
  }

  function parseFile(currentPath: string) {
    if (!fs.existsSync(currentPath)) return;
    const content = fs.readFileSync(currentPath, 'utf-8');
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    const exportStarRegex = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = exportStarRegex.exec(cleanContent)) !== null) {
      const relPath = match[1];
      const resolved = resolvePath(currentPath, relPath);
      if (resolved) {
        parseFile(resolved);
      }
    }

    const exportFromRegex = /export\s+(?:type\s+)?\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = exportFromRegex.exec(cleanContent)) !== null) {
      const namesStr = match[1];
      namesStr.split(',').forEach(item => {
        const trimmed = item.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/\s+as\s+/);
        let name = parts[parts.length - 1].trim();
        if (name.startsWith('type ')) {
          name = name.substring(5).trim();
        }
        if (name && name !== 'default') {
          exportsSet.add(name);
        }
      });
    }

    const inlineExportRegex = /export\s+(?:async\s+)?(?:const|function\*?|class|let|var|type|interface)\s+([a-zA-Z0-9_$]+)/g;
    while ((match = inlineExportRegex.exec(cleanContent)) !== null) {
      const name = match[1];
      if (name) exportsSet.add(name);
    }

    const exportCurlyRegex = /export\s+(?:type\s+)?\{\s*([^}]+)\s*\}(?!\s+from)/g;
    while ((match = exportCurlyRegex.exec(cleanContent)) !== null) {
      const namesStr = match[1];
      namesStr.split(',').forEach(item => {
        const trimmed = item.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/\s+as\s+/);
        let name = parts[parts.length - 1].trim();
        if (name.startsWith('type ')) {
          name = name.substring(5).trim();
        }
        if (name) {
          exportsSet.add(name);
        }
      });
    }
  }

  parseFile(filePath);
  return Array.from(exportsSet);
}

const componentExports = getExports(resolve(__dirname, './packages/components/src/index.ts'));
const hookExports = getExports(resolve(__dirname, './packages/hooks/src/index.ts'));


export default defineConfig({
  optimizeDeps: { force: true },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
    AutoImport({
      eslintrc: {
        enabled: true
      },
      imports: [
        'react',
        {
          react: ['cloneElement', 'createContext', 'StrictMode', 'Suspense', 'isValidElement', 'use', 'useId']
        },
        {
          'react-i18next': ['useTranslation', 'Trans', 'initReactI18next']
        },
        {
          '@gsap/react': ['useGSAP']
        },
        {
          gsap: ['gsap']
        },
        {
          'gsap/ScrollTrigger': ['ScrollTrigger']
        },
        {
          'leva': ['Leva', 'useControls']
        },
        {
          '@react-three/fiber': ['useFrame', 'Canvas', 'useThree']
        },
        {
          '@react-three/drei': ['useAnimations', 'useFBX', 'useGLTF', 'useProgress', 'Html', 'Environment', 'OrbitControls']
        },
        {
          'three': ['MathUtils', 'Vector3']
        },
        {
          from: 'wawa-lipsync',
          imports: ['VISEMES'],
          type: true
        },
        {
          from: 'three',
          imports: ['AnimationClip', 'Group', 'Object3D'],
          type: true
        },
        {
          'three-stdlib': ['SkeletonUtils']
        },
        {
          from: 'three-stdlib',
          imports: ['GLTF'],
          type: true
        },
        {
          '@tanstack/react-router': [
            'useNavigate',
            'useMatch',
            'useParams',
            'useSearch',
            'useRouter',
            'useRouteLoaderData',
            'useIsPending',
            'useLink',
            'Link',
            'createRouter',
            'RouterProvider',
            'useRouterState'
          ]
        },
        {
          '@tanstack/react-query': [
            'useQuery',
            'useMutation',
            'useQueryClient',
            'QueryClient',
            'QueryClientProvider',
            'useIsFetching',
            'useIsMutating',
            'useInfiniteQuery',
            'useHydrate',
            'Hydrate',
            'createSyncStoragePersister',
            'persistQueryClient',
            'onlineManager',
            'focusManager'
          ]
        },
        {
          ahooks: ['useUpdateEffect', 'useMount', 'useUnmount']
        },
        {
          'react-hook-form': [
            'useForm',
            'useController',
            'useWatch',
            'useFieldArray',
            'FormProvider',
            'useFormContext',
            'useFormState'
          ]
        },
        {
          'lodash-es': [
            'forEach',
            'get',
            'map',
            'groupBy',
            'size',
            'take',
            'isEmpty',
            'sumBy',
            'find',
            'values',
            'orderBy',
            'last',
            'indexOf',
            'findIndex',
            'sortBy',
            'join',
            'flatMap',
            'mean',
            'filter',
            'round',
            'omitBy',
            'reduce',
            'trim',
            'fromPairs',
            'pick',
            'head',
            'omit',
            'chain',
            'compact',
            'includes',
            'isNumber',
            'pickBy',
            'mapValues',
            'debounce',
            'some',
            'isNil',
            'uniqBy'
          ]
        },
        {
          '@platform-core/hooks': hookExports
        },
        {
          '@platform-core/components': componentExports
        },

        {
          zustand: ['create'],
          'zustand/middleware': ['persist', ['devtools', 'zustandDevtools'], 'immer']
        },
        {
          from: 'react-hook-form',
          imports: [
            'FieldErrors',
            'Control',
            'RegisterOptions',
            'UseFormGetValues',
            'UseFormReturn',
            'FieldValues',
            'FieldArrayWithId',
            'UseFormSetValue',
            'UseFormSetError',
            'UseFormHandleSubmit',
            'Control',
            'FieldPath'
          ],
          type: true
        },
        {
          from: 'react',
          imports: [
            'FunctionComponent',
            'FC',
            'ReactNode',
            'ReactElement',
            'Key',
            ['MouseEvent', 'ReactMouseEvent'],
            ['KeyboardEvent', 'ReactKeyboardEvent'],
            'ComponentType',
            'ComponentProps',
            'ChangeEvent',
            'Ref',
            'RefObject',
            'Dispatch',
            'SetStateAction',
            'CSSProperties',
            'HTMLAttributes'
          ],
          type: true
        },
        {
          from: 'zustand',
          imports: ['StateCreator', 'StoreApi', 'UseBoundStore'],
          type: true
        }
      ],
      dirs: ['src/lib', 'src/shared'],
      dts: 'src/types/auto-imports.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@assets': resolve(__dirname, './src/assets'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@lib': resolve(__dirname, './src/lib'),
      '@routes': resolve(__dirname, './src/routes'),
      '@types': resolve(__dirname, './src/types'),
      '@stores': resolve(__dirname, './src/stores'),
      '@api': resolve(__dirname, './src/api'),
      '@shared': resolve(__dirname, './src/shared'),
      '@platform-core/components': resolve(__dirname, './packages/components/src'),
      '@platform-core/components/ui': resolve(__dirname, './packages/components/src/ui'),
      '@platform-core/components/DataTable': resolve(__dirname, './packages/components/src/DataTable'),
      '@platform-core/components/Icons': resolve(__dirname, './packages/components/src/Icons'),
      '@platform-core/hooks': resolve(__dirname, './packages/hooks/src')
    }
  }
});

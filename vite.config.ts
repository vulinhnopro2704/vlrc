import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    }),
    tailwindcss(),
    AutoImport({
      eslintrc: {
        enabled: true
      },
      imports: [
        'react',
        {
          react: ['cloneElement', 'createContext', 'StrictMode', 'Suspense', 'isValidElement']
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
            'useLink'
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
          ahook: ['useUpdateEffect']
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
          'lucide-react': [
            'Loader2',
            'HistoryIcon',
            'UserIcon',
            'CalendarIcon',
            'ZapIcon',
            'TruckIcon',
            'ArrowLeftIcon',
            'PlusIcon',
            'LogOutIcon',
            'CreditCardIcon',
            'SettingsIcon',
            'BellIcon',
            'CheckIcon',
            'XIcon',
            'ChevronDownIcon',
            'ChevronUpIcon',
            'ChevronLeftIcon',
            'ChevronRightIcon',
            'SearchIcon',
            'Edit3Icon',
            'Trash2Icon',
            'AlertTriangleIcon',
            'InfoIcon',
            'DollarSignIcon',
            'CarIcon',
            'PackageIcon',
            'MapPinIcon',
            'SaveIcon',
            'KeyIcon',
            'PhoneIcon',
            'MailIcon',
            'EyeOffIcon',
            'EyeIcon',
            'LockIcon',
            'HomeIcon',
            'FileTextIcon',
            'FilePlusIcon',
            'FileMinusIcon',
            'FileIcon',
            'CopyIcon',
            'DownloadIcon',
            'UploadIcon',
            'MoreHorizontalIcon',
            'MoreVerticalIcon',
            'XCircleIcon',
            'CheckCircleIcon',
            'AlertCircleIcon',
            'StarIcon',
            'StarHalfIcon',
            'StarOffIcon',
            'MessageCircleIcon',
            'MessageSquareIcon',
            'PaperclipIcon',
            'CalendarCheckIcon',
            'CalendarMinusIcon',
            'CalendarPlusIcon',
            'CalendarXIcon',
            'ClockIcon',
            'RepeatIcon',
            'RefreshCcwIcon',
            'RefreshCwIcon',
            'PlaneIcon',
            'BoxesIcon',
            'UsersIcon',
            'ShieldIcon',
            'FacebookIcon',
            'InstagramIcon',
            'TwitterIcon',
            'LinkedinIcon',
            'TrendingUpIcon',
            'TrendingDownIcon',
            'MinusIcon',
            'EditIcon',
            'BarChart3Icon',
            'FilterIcon',
            'ArrowUpDownIcon',
            'UserCheckIcon',
            'UserXIcon',
            'PlusCircleIcon',
            'ArrowDownIcon',
            'TrashIcon',
            'CalculatorIcon',
            'GiftIcon',
            'NavigationIcon',
            'CameraIcon'
          ]
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
            'Control'
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
            'CSSProperties'
          ],
          type: true
        }
      ],
      dirs: ['src/components/ui', 'src/lib'],
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
      '@shared': resolve(__dirname, './src/shared')
    }
  }
});

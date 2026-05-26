import { useRef, useEffect } from 'react';
import {
  FileUpload as FileUploadRoot,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  useFileUpload
} from '@/components/ui/file-upload';
import { CloudUploadIcon, Trash2Icon, CameraIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import type { XOR } from '@/types/utils';

/**
 * Base shared properties for the `FileUpload` component, regardless of upload mode.
 */
export type FileUploadBaseProps = {
  /**
   * The current value of the field.
   * - In **manual** mode (`autoUpload: false`): a `File` or `File[]`.
   * - In **auto** mode (`autoUpload: true`): a URL `string` or `string[]` returned by the cloud.
   * - Accepts an initial URL string to pre-populate the component (e.g., an existing avatar URL).
   */
  value?: string | string[] | File | File[];
  /**
   * Callback fired whenever the field value changes.
   * - In **manual** mode: called with the selected `File` / `File[]` (or `null` when cleared).
   * - In **auto** mode: called with the uploaded URL `string` / `string[]` (or `null` when cleared).
   */
  onChange?: (value: string | string[] | File | File[] | null) => void;
  /**
   * Maximum number of files the user can select.
   * When set to `1` (default), `onChange` emits a single value instead of an array.
   * @default 1
   */
  maxFiles?: number;
  /**
   * Maximum allowed file size in bytes.
   * Files exceeding this limit will be rejected before upload.
   * @default 5242880 (5 MB)
   */
  maxSize?: number;
  /**
   * Accepted MIME types or file extensions, following the same syntax as the
   * HTML `<input accept>` attribute (e.g., `"image/*"`, `".pdf,.docx"`).
   * @default "image/*"
   */
  accept?: string;
  /** If `true`, the dropzone and trigger will be non-interactive. */
  disabled?: boolean;
  /** Additional CSS classes applied to the root wrapper element. */
  className?: string;
  /** Rendering variant. 'avatar' renders a circular dropzone without a list. */
  variant?: 'default' | 'avatar';
};

/**
 * Props variant for **automatic upload** mode.
 * When `autoUpload` is `true`, files are uploaded immediately upon selection
 * and `onChange` will be called with the resulting cloud URL(s) — not the raw `File` objects.
 *
 * Both `autoUpload` and `uploadFile` are **required together** and mutually exclusive
 * with the manual variant (enforced via `XOR`).
 */
export type FileUploadAutoProps = {
  /** Enables immediate upload when a file is selected. */
  autoUpload: true;
  /**
   * An async function responsible for uploading a single file to a cloud storage service.
   * It receives the raw `File` object and must return a `Promise` that resolves to the
   * publicly accessible URL string of the uploaded file.
   *
   * @param file The file to upload.
   * @returns A promise resolving to the remote URL of the uploaded file.
   *
   * @example
   * uploadFile={async (file) => {
   *   const form = new FormData();
   *   form.append('file', file);
   *   const res = await fetch('/api/upload', { method: 'POST', body: form });
   *   const { url } = await res.json();
   *   return url;
   * }}
   */
  uploadFile: (file: File) => Promise<string>;
};

/**
 * Props variant for **manual upload** mode.
 * When `autoUpload` is `false` (or omitted), files are held as `File` objects in local state
 * and `onChange` will be called with the raw `File` / `File[]`.
 * The consumer is responsible for uploading them on form submit.
 */
export type FileUploadManualProps = {
  /** Disables automatic upload; files are kept as `File` objects until form submission. */
  autoUpload?: false;
};

/**
 * Full props type for the `FileUpload` component.
 * Combines the shared base props with **exactly one** of the two upload modes
 * (auto or manual) enforced via `XOR` — preventing invalid combinations like
 * passing `uploadFile` without `autoUpload: true`.
 *
 * @example Auto-upload mode
 * ```tsx
 * <FileUpload
 *   autoUpload
 *   uploadFile={async (file) => uploadToS3(file)}
 *   value={avatarUrl}
 *   onChange={(url) => setAvatarUrl(url as string)}
 * />
 * ```
 *
 * @example Manual mode (upload on submit)
 * ```tsx
 * <FileUpload
 *   value={selectedFile}
 *   onChange={(file) => setSelectedFile(file as File)}
 * />
 * ```
 */
export type FileUploadProps = FileUploadBaseProps & XOR<FileUploadAutoProps, FileUploadManualProps>;

type FileUploadSyncValue = string | string[] | File | File[] | null;

function FileUploadSync({
  onChange,
  autoUpload,
  maxFiles
}: {
  onChange?: (value: FileUploadSyncValue) => void;
  autoUpload: boolean;
  maxFiles: number;
}) {
  const store = useFileUpload(state => state);
  const lastValueRef = useRef<FileUploadSyncValue>(null);

  useEffect(() => {
    if (!onChange) return;

    const currentFiles = Array.from(store.files.values());

    const newValue: FileUploadSyncValue = (() => {
      if (autoUpload) {
        const urls = currentFiles
          .filter(fs => fs.status === 'success')
          .map(fs => (fs.file as File & { uploadedUrl?: string }).uploadedUrl)
          .filter((u): u is string => Boolean(u));
        return maxFiles === 1 ? (urls.length > 0 ? urls[urls.length - 1] : null) : urls;
      }
      const files = currentFiles.map(fs => fs.file);
      return maxFiles === 1 ? (files.length > 0 ? files[files.length - 1] : null) : files;
    })();

    const last = lastValueRef.current;
    const isEq = (() => {
      if (autoUpload) return JSON.stringify(last) === JSON.stringify(newValue);
      if (Array.isArray(newValue) && Array.isArray(last)) {
        return newValue.length === last.length && newValue.every((f, i) => f === (last as File[])[i]);
      }
      return newValue === last;
    })();

    if (!isEq) {
      lastValueRef.current = newValue;
      onChange(newValue);
    }
  }, [store, autoUpload, maxFiles, onChange]);

  return null;
}

type ExtendedFile = File & { isUploadedUrl?: boolean; uploadedUrl?: string };

/** Converts a URL string to a stub File object so the ui component can display it. */
function urlToStubFile(url: string, accept: string = ''): ExtendedFile {
  const fileName = url.split('/').pop()?.split('?')[0] || 'file';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
  };
  let type = (ext && mimeTypes[ext]);
  if (!type) {
    type = accept.includes('image') ? 'image/jpeg' : 'application/octet-stream';
  }
  const file = new File([''], fileName, { type }) as ExtendedFile;
  file.isUploadedUrl = true;
  file.uploadedUrl = url;
  return file;
}

export function FileUpload({
  value,
  onChange,
  autoUpload = false,
  uploadFile,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 5, // 5MB default
  accept = 'image/*',
  disabled,
  className,
  variant = 'default'
}: FileUploadProps) {
  const valArray = Array.isArray(value) ? value : value ? [value] : [];
  const mappedFiles: ExtendedFile[] = valArray.map(item => {
    if (item instanceof File) return item as ExtendedFile;
    if (typeof item === 'string') return urlToStubFile(item, accept);
    return item as ExtendedFile;
  });

  const handleUpload = async (
    filesToUpload: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    }
  ) => {
    if (!autoUpload) {
      filesToUpload.forEach(f => options.onSuccess(f));
      return;
    }
    if (!uploadFile) {
      console.warn('uploadFile prop is required when autoUpload is true');
      filesToUpload.forEach(f => options.onError(f, new Error('Missing uploadFile function')));
      return;
    }

    await Promise.all(
      filesToUpload.map(async file => {
        const extendedFile = file as File & { isUploadedUrl?: boolean; uploadedUrl?: string };
        if (extendedFile.isUploadedUrl) {
          options.onSuccess(file);
          return;
        }
        try {
          options.onProgress(file, 20); // Initial progress
          const url = await uploadFile(file);
          extendedFile.uploadedUrl = url;
          options.onProgress(file, 100);
          options.onSuccess(file);
        } catch (error: unknown) {
          options.onError(file, error instanceof Error ? error : new Error('Upload failed'));
        }
      })
    );
  };

  const renderAvatarVariant = () => (
    <div className="flex flex-col items-center gap-2">
      <FileUploadDropzone className="group relative size-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border p-0 hover:border-primary">
        {mappedFiles[0] ? (
          <FileUploadItem value={mappedFiles[0]} className="relative flex size-full flex-col rounded-none border-none p-0">
            <FileUploadItemPreview
              className="size-full rounded-none border-none bg-transparent"
              render={(previewFile) => {
                const url = (previewFile as File & { uploadedUrl?: string }).uploadedUrl;
                if (url) return <img src={url} alt="Avatar" className="size-full object-cover" />;
                return <img src={URL.createObjectURL(previewFile)} alt="Avatar" className="size-full object-cover" />;
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <CameraIcon className="size-6 text-white" />
              <span className="text-[10px] text-white">Đổi ảnh</span>
            </div>
            <FileUploadItemProgress variant="fill" className="opacity-50" />
          </FileUploadItem>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 bg-accent text-muted-foreground transition-colors group-hover:bg-accent/80">
            <CameraIcon className="size-6" />
            <span className="text-[10px]">Tải lên</span>
          </div>
        )}
      </FileUploadDropzone>
      <div className="text-xs text-muted-foreground">
        {maxSize ? `Max ${Math.round(maxSize / (1024 * 1024))}MB` : ''}
      </div>
    </div>
  );

  const renderDefaultVariant = () => (
    <>
      <FileUploadDropzone>
        <CloudUploadIcon className='h-10 w-10 text-muted-foreground' />
        <p className='text-sm font-medium'>Drag & drop files here, or click to select</p>
        <p className='text-xs text-muted-foreground'>
          {maxFiles > 1 ? `Up to ${maxFiles} files` : '1 file max'}{' '}
          {maxSize ? `(Max ${Math.round(maxSize / (1024 * 1024))}MB)` : ''}
        </p>
      </FileUploadDropzone>
      <FileUploadList>
        {mappedFiles.map((file, i) => (
          <FileUploadItem key={i} value={file}>
            <FileUploadItemPreview
              render={(previewFile, fallback) => {
                const url = (previewFile as File & { uploadedUrl?: string }).uploadedUrl;
                if (url && previewFile.type.startsWith('image/')) {
                  return (
                    <img src={url} alt={previewFile.name} className='size-full object-cover' />
                  );
                }
                return fallback();
              }}
            />
            <FileUploadItemMetadata />
            <FileUploadItemProgress className="absolute bottom-0 left-0 right-0 h-1 w-auto rounded-none" />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive">
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </>
  );

  return (
    <FileUploadRoot
      value={mappedFiles}
      maxFiles={variant === 'avatar' ? 1 : maxFiles}
      maxSize={maxSize}
      accept={accept}
      disabled={disabled}
      onUpload={handleUpload}
      className={className}>
      <FileUploadSync onChange={onChange} autoUpload={autoUpload} maxFiles={variant === 'avatar' ? 1 : maxFiles} />
      
      {variant === 'avatar' ? renderAvatarVariant() : renderDefaultVariant()}
    </FileUploadRoot>
  );
}

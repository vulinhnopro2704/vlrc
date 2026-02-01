import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList
} from '@/components/ui/file-upload';
import Icons from '@/components/Icons';

interface ShadcnFileUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: string | string[] | Record<string, string[]>;
  disabled?: boolean;
}

export default function ShadcnFileUploader({
  value = [],
  onChange,
  maxFiles = 5,
  accept = 'image/*',
  disabled
}: ShadcnFileUploaderProps) {
  const acceptString = Array.isArray(accept)
    ? accept.join(',')
    : typeof accept === 'object' && accept !== null
      ? Object.keys(accept).join(',')
      : accept;

  return (
    <FileUpload
      value={value}
      onValueChange={onChange}
      maxFiles={maxFiles}
      accept={acceptString}
      disabled={disabled}>
      <FileUploadDropzone className='p-10 pointer-events-auto'>
        <Icons.CloudUpload className='h-10 w-10 text-gray-500 mb-2' />
        <p className='text-sm text-gray-500'>Drag and drop files here or click to upload</p>
      </FileUploadDropzone>
      <FileUploadList>
        {value?.map((file, i) => (
          <FileUploadItem key={`${file.name}-${file.lastModified}-${i}`} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}

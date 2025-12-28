import { FilePond } from 'react-filepond';
import { useFileUpload } from '@/hook/useFileUpload';
import type { FilePondFile } from 'filepond';
import type { UploadedFile } from './type';

export default function FilePondUploader({
  value = [],
  onChange,
  maxFiles = 5,
  acceptedFileTypes = ['image/*'],
  disabled
}: {
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  disabled?: boolean;
}) {
  const { process } = useFileUpload();

  return (
    <FilePond
      files={value.map(f => ({
        source: f.id,
        options: { type: 'local' }
      }))}
      allowMultiple
      maxFiles={maxFiles}
      acceptedFileTypes={acceptedFileTypes}
      disabled={disabled}
      server={{
        process
      }}
      onupdatefiles={(files: FilePondFile[]) => {
        const mapped: UploadedFile[] = files
          .filter(f => f.serverId)
          .map(f => ({
            id: String(f.serverId),
            name: f.filename,
            size: f.fileSize,
            type: f.fileType ?? '',
            url: ''
          }));

        onChange?.(mapped);
      }}
    />
  );
}

import type { UploadedFile } from '@/components/FilePondUploader/type';

export const uploadFile = async (file: File): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Upload failed');

  return res.json();
};

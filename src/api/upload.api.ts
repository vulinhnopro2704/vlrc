import type { ActualFileObject } from 'filepond';
import type { UploadedFile } from '../components/Form/FormFileUpload/types';

export const uploadFile = async (file: ActualFileObject): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Upload failed');

  return res.json();
};

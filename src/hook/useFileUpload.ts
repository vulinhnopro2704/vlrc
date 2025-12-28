import type { ProcessServerConfigFunction } from 'filepond';
import { uploadFile } from '../api/upload.api';

export const useFileUpload = () => {
  const process: ProcessServerConfigFunction = (
    _fieldName,
    file,
    _metadata,
    load,
    error,
    progress
  ) => {
    progress(true, 0, file.size);

    uploadFile(file)
      .then(uploaded => {
        progress(true, file.size, file.size);
        load(uploaded.id);
      })
      .catch(() => {
        error('Upload failed');
      });
  };

  return { process };
};

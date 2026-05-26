import apiClient from './api-client';

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient
    .post('storage/upload', {
      body: formData,
      hooks: {
        beforeRequest: [
          ({ request }) => {
            // Delete Content-Type so browser sets it to multipart/form-data with boundaries
            request.headers.delete('Content-Type');
          }
        ]
      }
    })
    .json<StorageManagement.UploadResponse>();
};

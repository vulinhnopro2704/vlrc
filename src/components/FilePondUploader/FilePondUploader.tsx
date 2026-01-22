import { FilePond } from 'react-filepond';
import {
  createDefaultImageReader,
  createDefaultImageWriter,
  openDefaultEditor,
  processDefaultImage
} from '@pqina/pintura';
import pinturaLocale from '@pqina/pintura/locale/en_GB';
import type { FilePondFile, FilePondOptions } from 'filepond';

const defaultImageEditor = {
  createEditor: openDefaultEditor,
  imageReader: [createDefaultImageReader, {}],
  imageWriter: [createDefaultImageWriter, {}],
  imageProcessor: processDefaultImage,
  editorOptions: {
    locale: pinturaLocale
  },
  imageState: {}
};

export default function FilePondUploader({
  value = [],
  onChange,
  maxFiles = 5,
  acceptedFileTypes = ['image/*'],
  disabled,
  server,
  instantUpload = false,
  filePondProps
}: {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  disabled?: boolean;
  server?: FilePondOptions['server'];
  instantUpload?: boolean;
  filePondProps?: Omit<
    FilePondOptions,
    'files' | 'onupdatefiles' | 'allowMultiple' | 'maxFiles' | 'acceptedFileTypes' | 'disabled'
  >;
}) {
  return (
    <FilePond
      files={value}
      maxFiles={maxFiles}
      acceptedFileTypes={acceptedFileTypes}
      disabled={disabled}
      instantUpload={instantUpload}
      server={server}
      allowMultiple
      allowImageEditor
      imageEditor={filePondProps?.imageEditor ?? defaultImageEditor}
      onupdatefiles={(files: FilePondFile[]) => {
        const mapped = files.map(f => f.file).filter(Boolean) as File[];
        onChange?.(mapped);
      }}
      {...filePondProps}
    />
  );
}

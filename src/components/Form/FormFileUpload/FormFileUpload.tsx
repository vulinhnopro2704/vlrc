'use client';

import { CloudUpload, X } from 'lucide-react';
import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger
} from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import type { FormFileUploadProps } from './types';
import { useFormFileUpload } from './useFormFileUpload';

export function FormFileUpload<T extends FieldValues>({
  control,
  name,
  label,
  description,
  children,
  dropzoneClassName,
  onFileReject,
  rules,
  ...fileUploadProps
}: FormFileUploadProps<T>) {
  const { processedRules, isRequired } = useFormFileUpload({
    control,
    name,
    label,
    description,
    children,
    dropzoneClassName,
    onFileReject,
    rules,
    ...fileUploadProps
  });

  const renderExistingImage = (field: ControllerRenderProps<T, FieldPath<T>>) => (
    <div className='flex items-center gap-2'>
      <img
        src={field.value as string}
        alt='Uploaded'
        className='max-w-20 h-20 object-cover rounded'
      />
      <Button
        variant='ghost'
        size='icon'
        onClick={() => field.onChange(undefined)}
        className='size-7'>
        <X />
        <span className='sr-only'>Delete</span>
      </Button>
    </div>
  );

  const renderUploader = (field: ControllerRenderProps<T, FieldPath<T>>) => (
    <FileUpload
      value={field.value || []}
      onValueChange={field.onChange}
      onFileReject={onFileReject}
      {...fileUploadProps}>
      <FileUploadDropzone
        className={cn('flex-row flex-wrap border-dotted text-center', dropzoneClassName)}>
        {children || (
          <>
            <CloudUpload className='size-4' />
            Drag and drop or
            <FileUploadTrigger asChild>
              <Button variant='link' size='sm' className='p-0'>
                choose files
              </Button>
            </FileUploadTrigger>
            to upload
          </>
        )}
      </FileUploadDropzone>
      {size(field.value) > 0 && (
        <FileUploadList>
          {field.value.map((file: File, index: number) => (
            <FileUploadItem key={index} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant='ghost' size='icon' className='size-7'>
                  <X />
                  <span className='sr-only'>Delete</span>
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      )}
    </FileUpload>
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={processedRules}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {isRequired && <span className='text-destructive ml-1'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            {typeof field.value === 'string' ? renderExistingImage(field) : renderUploader(field)}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

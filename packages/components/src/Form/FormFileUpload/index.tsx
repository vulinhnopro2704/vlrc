import { FormBase } from '../Form';
import type { FormControlFunc } from '../types';
import { FileUpload, type FileUploadProps } from './FileUpload';

export type FormFileUploadExtraProps = Omit<FileUploadProps, 'value' | 'onChange'>;

export const FormFileUpload: FormControlFunc<FormFileUploadExtraProps> = props => {
  return (
    <FormBase {...props}>
      {({ onChange, value, disabled }) => (
        <FileUpload
          {...(props as unknown as FileUploadProps)}
          value={value}
          onChange={onChange}
          disabled={disabled || props.disabled}
          className={props.className}
        />
      )}
    </FormBase>
  );
};

export default FormFileUpload;
export { FileUpload };

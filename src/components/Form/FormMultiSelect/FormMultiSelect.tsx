import MultiSelect from '@/components/MultiSelect';
import { FormBase } from '../Form';
import type { FormControlFunc } from '../types';
import type { MultiSelectProps } from '@/components/MultiSelect/type';

export const FormMultiSelect: FormControlFunc<MultiSelectProps & Record<string, unknown>> = ({
  options,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, value, ...field }) => (
        <MultiSelect {...field} options={options} onValueChange={onChange} value={value} />
      )}
    </FormBase>
  );
};

export default FormMultiSelect;

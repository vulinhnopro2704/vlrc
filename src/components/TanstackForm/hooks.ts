import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormCheckbox } from './FormCheckbox';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormSelect } from './FormSelect';

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox
  },
  formComponents: {},
  fieldContext,
  formContext
});

export { useAppForm, useFieldContext, useFormContext };

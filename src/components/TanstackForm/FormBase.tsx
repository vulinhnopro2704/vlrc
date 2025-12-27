import { useFieldContext } from './hooks';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import type { FormBaseProps } from './types';

export function FormBase({
  children,
  label,
  description,
  controlFirst,
  horizontal
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );
  const errorElem = isInvalid && <FieldError errors={field.state.meta.errors} />;

  return (
    <Field data-invalid={isInvalid} orientation={horizontal ? 'horizontal' : undefined}>
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}

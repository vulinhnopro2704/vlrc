import type { ControllerProps, FieldPath } from 'react-hook-form';

/**
 * Base properties required for any form control connected to React Hook Form.
 * @template TFieldValues The shape of the form values.
 * @template TName The path to the specific field in the form values.
 * @template TTransformedValues The shape of the transformed form values.
 */
export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  /** The name (path) of the field in the form data. */
  name: TName;
  /** The label text or element to display for the field. */
  label?: ReactNode;
  /** Additional descriptive text to display below or next to the field. */
  description?: ReactNode;
  /** The React Hook Form control object used to register the field. */
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

/**
 * Additional properties specific to standard text input components.
 */
export type FormInputExtraProps = {
  /** Placeholder text to display when the input is empty. */
  placeholder?: string;
  /** Additional CSS classes to apply to the wrapper element. */
  className?: string;
  /** Additional CSS classes to apply directly to the input element. */
  inputClassName?: string;
  /** An icon element to display on the left side inside the input. */
  leftIcon?: ReactNode;
  /** An icon element to display on the right side inside the input. */
  rightIcon?: ReactNode;
  /** If true, the input will be disabled and cannot be interacted with. */
  disabled?: boolean;
  /** Specifies the autocomplete behavior of the input. */
  autoComplete?: string;
};

/**
 * Properties for the internal FormBase wrapper component.
 * This component handles the boilerplate of connecting a UI element to React Hook Form
 * via the Controller component, along with rendering labels, descriptions, and error messages.
 */
export type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  /** If true, arranges the label and the control horizontally instead of vertically. */
  horizontal?: boolean;
  /** If true, renders the control element before the label element (useful for checkboxes/radios). */
  controlFirst?: boolean;
  /** Additional CSS classes to apply to the outermost field wrapper. */
  className?: string;
  /** 
   * Render prop that provides the connected field props to the actual UI component.
   * It injects React Hook Form's field props along with `id` and `aria-invalid` for accessibility.
   */
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean;
      id: string;
    }
  ) => ReactNode;
  /** Validation rules to apply to the field (e.g., required, min, max, pattern). */
  rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
  /** The HTML type attribute of the input, used for applying auto-validation rules (e.g., email, tel). */
  htmlType?: string;
};

/**
 * A type definition for standardizing the signature of form control components.
 * Form control components should accept base form control props, validation rules,
 * HTML type, generic class names, and any component-specific extra props.
 * 
 * @template ExtraProps Additional props specific to the UI component being wrapped.
 */
export type FormControlFunc<ExtraProps extends Record<string, unknown> = Record<never, never>> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> &
    ExtraProps & {
      /** Validation rules for the field. */
      rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
      /** The HTML type attribute (e.g., 'text', 'password', 'email'). */
      htmlType?: string;
      /** Additional CSS classes for the component wrapper. */
      className?: string;
    }
) => ReactNode;

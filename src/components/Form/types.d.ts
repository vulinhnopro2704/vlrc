import type { ControllerProps, FieldPath } from 'react-hook-form';

export type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control'];
};

export type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field'] & {
      'aria-invalid': boolean;
      id: string;
    }
  ) => ReactNode;
  rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
  htmlType?: string;
};

export type FormControlFunc<ExtraProps extends Record<string, unknown> = Record<never, never>> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> &
    ExtraProps & {
      rules?: ControllerProps<TFieldValues, TName, TTransformedValues>['rules'];
      htmlType?: string;
    }
) => ReactNode;

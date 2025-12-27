import { get, isNil } from 'lodash-es';
import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import type {
  BaseSelectPassThroughProps,
  FormMultiSelectProps,
  FormSelectProps,
  SelectValue
} from './types';

function isFormMultiSelectProps<TFieldValues extends FieldValues, T extends SelectValue>(
  props: FormSelectProps<TFieldValues, T>
): props is FormMultiSelectProps<TFieldValues, T> {
  return props.isMulti === true;
}

export function useFormSelect<
  TFieldValues extends FieldValues,
  T extends SelectValue = SelectValue
>(props: FormSelectProps<TFieldValues, T>) {
  const {
    options,
    injectOptions,
    placeholder = 'Chọn...',
    description,
    disabled,
    isClearable = true,
    isSearchable = true,
    isLoading = false,
    className,
    rules,
    onSearchTextChange,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    maxTagCount = 'responsive',
    tagRender,
    showSelectAll = false
  } = props;

  const requiredRule = get(rules, 'required');
  const isRequired = !isNil(requiredRule) && requiredRule !== false;

  const baseSelectProps: BaseSelectPassThroughProps<T> = {
    options,
    injectOptions,
    placeholder,
    isClearable,
    isSearchable,
    isLoading,
    className,
    disabled,
    onSearchTextChange,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    maxTagCount,
    tagRender,
    showSelectAll
  };

  const enhancedRules = (() => {
    if (!rules) return rules;

    const newRules = { ...rules };
    if (
      isRequired &&
      typeof newRules.required !== 'string' &&
      typeof newRules.required !== 'object'
    ) {
      newRules.required = 'Trường này là bắt buộc';
    } else if (typeof newRules.required === 'object' && !newRules.required.message) {
      newRules.required = {
        ...newRules.required,
        message: 'Trường này là bắt buộc'
      };
    }
    return newRules;
  })();

  const createChangeHandlers = (
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>
  ) => ({
    onChangeMulti: (value: T[]) => {
      field.onChange(value);
      if (isFormMultiSelectProps(props) && props.onChange) {
        props.onChange(value);
      }
    },
    onChangeSingle: (value: T | null) => {
      field.onChange(value);
      if (!isFormMultiSelectProps(props) && props.onChange) {
        props.onChange(value);
      }
    }
  });

  return {
    isRequired,
    description,
    enhancedRules,
    baseSelectProps,
    isMulti: isFormMultiSelectProps(props),
    createChangeHandlers
  } as const;
}

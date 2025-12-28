/**
 * Base value types supported by select components
 */
export type SelectValue = string | number;

/**
 * Option structure for select components
 */
export interface BaseSelectOption<T extends SelectValue = SelectValue> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

/**
 * Common props shared by all select variants
 */
export interface BaseSelectCommonProps<T extends SelectValue = SelectValue> {
  options: BaseSelectOption<T>[];
  injectOptions?: BaseSelectOption<T>[];
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onSearchTextChange?: (searchText: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  maxTagCount?: number | 'responsive';
  tagRender?: (option: BaseSelectOption<T>, onRemove: () => void) => React.ReactNode;
  showSelectAll?: boolean;
  allowClear?: boolean;
}

/**
 * Props for multi-select (BaseSelect)
 */
export interface BaseMultiSelectProps<
  T extends SelectValue = SelectValue
> extends BaseSelectCommonProps<T> {
  value?: T[];
  onChange?: (value: T[]) => void;
  isMulti: boolean;
}

/**
 * Props for single-select (BaseSelect)
 */
export interface BaseSingleSelectProps<
  T extends SelectValue = SelectValue
> extends BaseSelectCommonProps<T> {
  value?: T | null;
  onChange?: (value: T | null) => void;
  isMulti?: false;
}

/**
 * Union type for BaseSelect props
 */
export type BaseSelectProps<T extends SelectValue = SelectValue> =
  | BaseMultiSelectProps<T>
  | BaseSingleSelectProps<T>;

/**
 * Shared subset passed from FormSelect into BaseSelect to avoid repeating prop lists
 */
export type BaseSelectPassThroughProps<T extends SelectValue = SelectValue> = Pick<
  BaseSelectCommonProps<T>,
  | 'options'
  | 'injectOptions'
  | 'placeholder'
  | 'isClearable'
  | 'isSearchable'
  | 'isLoading'
  | 'className'
  | 'disabled'
  | 'onSearchTextChange'
  | 'hasNextPage'
  | 'isFetchingNextPage'
  | 'fetchNextPage'
  | 'maxTagCount'
  | 'tagRender'
  | 'showSelectAll'
>;

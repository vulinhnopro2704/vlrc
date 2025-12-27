import React, { useMemo, useRef, useState } from 'react';
import { isNil } from 'lodash-es';
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MultiSelectTags } from './MultiSelectTags';
import type {
  BaseMultiSelectProps,
  BaseSelectOption,
  BaseSelectProps,
  BaseSingleSelectProps,
  SelectValue
} from './types';

function isMultiProps<T extends SelectValue>(
  props: BaseSelectProps<T>
): props is BaseMultiSelectProps<T> {
  return props.isMulti === true;
}

export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseMultiSelectProps<T>
): React.ReactElement;
export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseSingleSelectProps<T>
): React.ReactElement;
export function BaseSelect<T extends SelectValue = SelectValue>(
  props: BaseMultiSelectProps<T> | BaseSingleSelectProps<T>
): React.ReactElement {
  const {
    options,
    injectOptions = [],
    placeholder = 'Chọn...',
    isClearable = true,
    isSearchable = true,
    isLoading = false,
    className = '',
    disabled = false,
    onSearchTextChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
    maxTagCount = 'responsive',
    tagRender,
    showSelectAll = false
  } = props;

  const isMulti = isMultiProps(props);
  const { value } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allOptions = useMemo(() => {
    const map = new Map<T, BaseSelectOption<T>>();

    // injectOptions trước để ưu tiên label từ BE (edit mode)
    for (const opt of injectOptions) {
      map.set(opt.value, opt);
    }
    for (const opt of options) {
      map.set(opt.value, opt);
    }

    return Array.from(map.values());
  }, [options, injectOptions]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 50;
    if (
      scrollHeight - scrollTop <= clientHeight + threshold &&
      hasNextPage &&
      !isFetchingNextPage &&
      fetchNextPage
    ) {
      fetchNextPage();
    }
  };

  const filteredOptions = useMemo(() => {
    if (!isSearchable || !search || onSearchTextChange) return allOptions;
    return allOptions.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  }, [allOptions, isSearchable, search, onSearchTextChange]);

  const selectedValues = useMemo((): T[] => {
    if (isMulti) {
      return Array.isArray(value) ? value : !isNil(value) ? [value] : [];
    }
    if (isNil(value)) return [];
    return [value as T];
  }, [value, isMulti]);

  const handleSelect = (val: T) => {
    if (disabled) return;
    if (isMultiProps(props)) {
      const newVals = selectedValues.includes(val)
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val];
      if (props.onChange) {
        props.onChange(newVals);
      }
    } else {
      if (props.onChange) {
        props.onChange(val);
      }
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    if (isMultiProps(props)) {
      if (props.onChange) {
        props.onChange([]);
      }
    } else {
      if (props.onChange) {
        props.onChange(null);
      }
    }
    setSearch('');
    if (onSearchTextChange) {
      onSearchTextChange('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = e.target.value;
    setSearch(newSearchText);
    if (onSearchTextChange) {
      onSearchTextChange(newSearchText);
    }
  };

  const selectedOptions = useMemo(() => {
    return allOptions.filter(o => selectedValues.includes(o.value));
  }, [selectedValues, allOptions]);

  const displayLabel = useMemo(() => {
    if (!selectedValues.length) return '';
    if (isMulti) {
      return allOptions
        .filter(o => selectedValues.includes(o.value))
        .map(o => o.label)
        .join(', ');
    }
    const found = allOptions.find(o => o.value === selectedValues[0]);
    return found?.label || '';
  }, [selectedValues, allOptions, isMulti]);

  const handleRemoveTag = (val: T) => {
    if (disabled || !isMultiProps(props)) return;
    const newVals = selectedValues.filter(v => v !== val);
    if (props.onChange) {
      props.onChange(newVals);
    }
  };

  const handleSelectAll = () => {
    if (disabled || !isMultiProps(props)) return;
    if (selectedValues.length === filteredOptions.length) {
      if (props.onChange) {
        props.onChange([]);
      }
    } else {
      const allValues = filteredOptions.map(opt => opt.value);
      if (props.onChange) {
        props.onChange(allValues);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className={`flex items-center w-full min-w-60 border rounded-md px-3 py-1.5 text-xs bg-white dark:bg-input/30 ${className} ${
            open ? 'ring-2 ring-primary' : ''
          } ${disabled ? 'bg-muted cursor-not-allowed opacity-60' : ''}`}
          onClick={() => !disabled && setOpen(v => !v)}
          disabled={disabled}>
          {isMulti && selectedValues.length > 0 ? (
            <MultiSelectTags
              selectedOptions={selectedOptions}
              maxTagCount={maxTagCount}
              onRemove={handleRemoveTag}
              disabled={disabled}
              tagRender={tagRender}
            />
          ) : (
            <span className='flex-1 truncate text-left text-xs'>
              {displayLabel || <span className='text-muted-foreground'>{placeholder}</span>}
            </span>
          )}
          {isClearable && selectedValues.length > 0 && !disabled && (
            <XIcon
              className='w-3.5 h-3.5 ml-2 text-muted-foreground hover:text-destructive flex-shrink-0'
              onClick={handleClear}
            />
          )}
          <ChevronDownIcon className='w-3.5 h-3.5 ml-2 text-muted-foreground flex-shrink-0' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-60' align='start'>
        {isSearchable && !disabled && (
          <div className='flex items-center px-2 py-1.5 border-b'>
            <SearchIcon className='w-4 h-4 mr-2 text-muted-foreground' />
            <input
              ref={inputRef}
              className='w-full outline-none bg-transparent text-xs'
              placeholder='Tìm kiếm...'
              value={search}
              onChange={handleSearchChange}
              autoFocus
              disabled={disabled}
            />
          </div>
        )}
        {isMulti && showSelectAll && !disabled && filteredOptions.length > 0 && (
          <div
            className='flex items-center px-3 py-2 border-b cursor-pointer hover:bg-accent text-xs font-medium'
            onClick={handleSelectAll}>
            <span className='flex-1'>
              {selectedValues.length === filteredOptions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </span>
            <span className='text-muted-foreground text-xs'>
              ({selectedValues.length}/{filteredOptions.length})
            </span>
          </div>
        )}
        <div className='max-h-56 overflow-y-auto' onScroll={handleScroll}>
          {isLoading && allOptions.length === 0 ? (
            <div className='p-3 text-center text-muted-foreground text-xs'>Đang tải...</div>
          ) : filteredOptions.length === 0 ? (
            <div className='p-3 text-center text-muted-foreground text-xs'>Không có dữ liệu</div>
          ) : (
            <>
              {filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`flex items-center px-3 py-1.5 cursor-pointer hover:bg-accent text-xs ${
                    selectedValues.includes(opt.value) ? 'bg-accent/50' : ''
                  } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
                  onClick={() => handleSelect(opt.value)}>
                  {opt.icon && <span className='mr-2'>{opt.icon}</span>}
                  <span className='truncate flex-1 text-xs'>{opt.label}</span>
                  {isMulti && (
                    <span
                      className={`ml-2 w-4 h-4 border rounded flex items-center justify-center ${
                        selectedValues.includes(opt.value) ? 'bg-primary text-white' : 'bg-white'
                      }`}>
                      {selectedValues.includes(opt.value) && <CheckIcon className='w-3 h-3' />}
                    </span>
                  )}
                  {!isMulti && selectedValues.includes(opt.value) && (
                    <CheckIcon className='w-3.5 h-3.5 ml-2 text-primary' />
                  )}
                </div>
              ))}
              {(isFetchingNextPage || (hasNextPage && filteredOptions.length > 0)) && (
                <div className='p-3 text-center text-muted-foreground text-xs'>
                  {isFetchingNextPage ? 'Đang tải thêm...' : ''}
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

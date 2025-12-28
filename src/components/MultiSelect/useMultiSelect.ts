import {
  type Dispatch,
  type KeyboardEvent,
  type Ref,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  arraysEqual,
  buildAllOptions,
  buildBadgeAnimationClass,
  buildPopoverAnimationClass,
  buildWidthConstraints,
  computeResponsiveSettings,
  countMatchingOptions,
  filterOptions,
  type ResponsiveSettings,
  type ScreenSize,
  type WidthConstraints
} from './utils';
import {
  type MultiSelectGroup,
  type MultiSelectOption,
  type MultiSelectProps,
  type MultiSelectRef
} from './type';

export interface UseMultiSelectParams extends MultiSelectProps {
  forwardedRef?: Ref<MultiSelectRef>;
}

export interface UseMultiSelectResult {
  ids: {
    multiSelectId: string;
    listboxId: string;
    triggerDescriptionId: string;
    selectedCountId: string;
  };
  state: {
    selectedValues: string[];
    isPopoverOpen: boolean;
    isAnimating: boolean;
    searchValue: string;
    screenSize: ScreenSize;
  };
  derived: {
    filteredOptions: MultiSelectOption[] | MultiSelectGroup[];
    responsiveSettings: ResponsiveSettings;
    widthConstraints: WidthConstraints;
    badgeAnimationClass: string;
    popoverAnimationClass: string;
  };
  refs: {
    buttonRef: RefObject<HTMLButtonElement | null>;
  };
  helpers: {
    getAllOptions: () => MultiSelectOption[];
    getOptionByValue: (value: string) => MultiSelectOption | undefined;
  };
  a11yMessages: {
    politeMessage: string;
    assertiveMessage: string;
  };
  handlers: {
    setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
    handleTogglePopover: () => void;
    handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    toggleOption: (optionValue: string) => void;
    handleClear: () => void;
    clearExtraOptions: () => void;
    toggleAll: () => void;
    setSearchValue: Dispatch<SetStateAction<string>>;
    setIsAnimating: Dispatch<SetStateAction<boolean>>;
  };
}

export const useMultiSelect = ({
  forwardedRef,
  ...props
}: UseMultiSelectParams): UseMultiSelectResult => {
  const {
    options,
    onValueChange,
    defaultValue = [],
    animationConfig,
    maxCount = 3,
    responsive,
    minWidth,
    maxWidth,
    deduplicateOptions = false,
    resetOnDefaultValueChange = true,
    closeOnSelect = false,
    searchable = true,
    autoSize = false,
    disabled = false
  } = props;

  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');

  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const prevSelectedCount = useRef(selectedValues.length);
  const prevIsOpen = useRef(isPopoverOpen);
  const prevSearchValue = useRef(searchValue);

  const multiSelectId = useId();
  const listboxId = `${multiSelectId}-listbox`;
  const triggerDescriptionId = `${multiSelectId}-description`;
  const selectedCountId = `${multiSelectId}-count`;

  const prevDefaultValueRef = useRef<string[]>(defaultValue);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage(message);
      setTimeout(() => setAssertiveMessage(''), 100);
    } else {
      setPoliteMessage(message);
      setTimeout(() => setPoliteMessage(''), 100);
    }
  }, []);

  const getAllOptions = useCallback((): MultiSelectOption[] => {
    const { options: normalizedOptions, duplicates } = buildAllOptions(options, deduplicateOptions);

    if (import.meta.env.NODE_ENV === 'development' && duplicates.length > 0) {
      const action = deduplicateOptions ? 'automatically removed' : 'detected';
      console.warn(
        `MultiSelect: Duplicate option values ${action}: ${duplicates.join(', ')}. ` +
          `${
            deduplicateOptions
              ? 'Duplicates have been removed automatically.'
              : "This may cause unexpected behavior. Consider setting 'deduplicateOptions={true}' or ensure all option values are unique."
          }`
      );
    }

    return normalizedOptions;
  }, [deduplicateOptions, options]);

  const getOptionByValue = useCallback(
    (value: string): MultiSelectOption | undefined => {
      const option = getAllOptions().find(currentOption => currentOption.value === value);
      if (!option && import.meta.env.NODE_ENV === 'development') {
        console.warn(`MultiSelect: Option with value "${value}" not found in options list`);
      }
      return option;
    },
    [getAllOptions]
  );

  const filteredOptions = useMemo(
    () => filterOptions(options, searchValue, searchable),
    [options, searchValue, searchable]
  );

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === 'Enter') {
      setIsPopoverOpen(true);
    } else if (event.key === 'Backspace' && !event.currentTarget.value) {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.pop();
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    }
  };

  const toggleOption = (optionValue: string) => {
    if (disabled) return;
    const option = getOptionByValue(optionValue);
    if (option?.disabled) return;

    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(value => value !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);

    if (closeOnSelect) {
      setIsPopoverOpen(false);
    }
  };

  const handleClear = () => {
    if (disabled) return;
    setSelectedValues([]);
    onValueChange([]);
  };

  const handleTogglePopover = () => {
    if (disabled) return;
    setIsPopoverOpen(prev => !prev);
  };

  const responsiveSettings = useMemo(
    () => computeResponsiveSettings(responsive, maxCount, screenSize),
    [responsive, maxCount, screenSize]
  );

  const clearExtraOptions = () => {
    if (disabled) return;
    const newSelectedValues = selectedValues.slice(0, responsiveSettings.maxCount);
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (disabled) return;
    const allOptions = getAllOptions().filter(option => !option.disabled);
    if (selectedValues.length === allOptions.length) {
      handleClear();
    } else {
      const allValues = allOptions.map(option => option.value);
      setSelectedValues(allValues);
      onValueChange(allValues);
    }

    if (closeOnSelect) {
      setIsPopoverOpen(false);
    }
  };

  const widthConstraints = useMemo(
    () => buildWidthConstraints(screenSize, autoSize, minWidth, maxWidth),
    [autoSize, maxWidth, minWidth, screenSize]
  );

  useEffect(() => {
    if (!resetOnDefaultValueChange) return;
    const prevDefaultValue = prevDefaultValueRef.current;
    if (!arraysEqual(prevDefaultValue, defaultValue)) {
      if (!arraysEqual(selectedValues, defaultValue)) {
        setSelectedValues(defaultValue);
      }
      prevDefaultValueRef.current = [...defaultValue];
    }
  }, [arraysEqual, defaultValue, resetOnDefaultValueChange, selectedValues]);

  useEffect(() => {
    if (!isPopoverOpen) {
      setSearchValue('');
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    const selectedCount = selectedValues.length;
    const allOptions = getAllOptions();
    const totalOptions = allOptions.filter(opt => !opt.disabled).length;

    if (selectedCount !== prevSelectedCount.current) {
      const diff = selectedCount - prevSelectedCount.current;
      if (diff > 0) {
        const addedItems = selectedValues.slice(-diff);
        const addedLabels = addedItems
          .map(value => allOptions.find(opt => opt.value === value)?.label)
          .filter(Boolean);

        if (addedLabels.length === 1) {
          announce(
            `${addedLabels[0]} selected. ${selectedCount} of ${totalOptions} options selected.`
          );
        } else {
          announce(
            `${addedLabels.length} options selected. ${selectedCount} of ${totalOptions} total selected.`
          );
        }
      } else if (diff < 0) {
        announce(`Option removed. ${selectedCount} of ${totalOptions} options selected.`);
      }
      prevSelectedCount.current = selectedCount;
    }

    if (isPopoverOpen !== prevIsOpen.current) {
      if (isPopoverOpen) {
        announce(`Dropdown opened. ${totalOptions} options available. Use arrow keys to navigate.`);
      } else {
        announce('Dropdown closed.');
      }
      prevIsOpen.current = isPopoverOpen;
    }

    if (searchValue !== prevSearchValue.current && searchValue !== undefined) {
      if (searchValue && isPopoverOpen) {
        const filteredCount = countMatchingOptions(allOptions, searchValue);
        announce(
          `${filteredCount} option${filteredCount === 1 ? '' : 's'} found for "${searchValue}"`
        );
      }
      prevSearchValue.current = searchValue;
    }
  }, [announce, countMatchingOptions, getAllOptions, isPopoverOpen, searchValue, selectedValues]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const badgeAnimationClass = useMemo(
    () => buildBadgeAnimationClass(isAnimating, animationConfig),
    [animationConfig, isAnimating]
  );

  const popoverAnimationClass = useMemo(
    () => buildPopoverAnimationClass(animationConfig),
    [animationConfig]
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      reset: () => {
        setSelectedValues(defaultValue);
        setIsPopoverOpen(false);
        setSearchValue('');
        onValueChange(defaultValue);
      },
      getSelectedValues: () => selectedValues,
      setSelectedValues: (values: string[]) => {
        setSelectedValues(values);
        onValueChange(values);
      },
      clear: () => {
        setSelectedValues([]);
        onValueChange([]);
      },
      focus: () => {
        if (buttonRef.current) {
          buttonRef.current.focus();
          const originalOutline = buttonRef.current.style.outline;
          const originalOutlineOffset = buttonRef.current.style.outlineOffset;
          buttonRef.current.style.outline = '2px solid hsl(var(--ring))';
          buttonRef.current.style.outlineOffset = '2px';
          setTimeout(() => {
            if (buttonRef.current) {
              buttonRef.current.style.outline = originalOutline;
              buttonRef.current.style.outlineOffset = originalOutlineOffset;
            }
          }, 1000);
        }
      }
    }),
    [defaultValue, forwardedRef, onValueChange, selectedValues]
  );

  return {
    ids: {
      multiSelectId,
      listboxId,
      triggerDescriptionId,
      selectedCountId
    },
    state: {
      selectedValues,
      isPopoverOpen,
      isAnimating,
      searchValue,
      screenSize
    },
    derived: {
      filteredOptions,
      responsiveSettings,
      widthConstraints,
      badgeAnimationClass,
      popoverAnimationClass
    },
    refs: {
      buttonRef
    },
    helpers: {
      getAllOptions,
      getOptionByValue
    },
    a11yMessages: {
      politeMessage,
      assertiveMessage
    },
    handlers: {
      setIsPopoverOpen,
      handleTogglePopover,
      handleInputKeyDown,
      toggleOption,
      handleClear,
      clearExtraOptions,
      toggleAll,
      setSearchValue,
      setIsAnimating
    }
  };
};

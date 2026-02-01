import Icons from '@/components/Icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LiveRegion, OptionsContent, PlaceholderContent, SelectedValuesContent } from './renderers';
import { useMultiSelect } from './useMultiSelect';
import { type MultiSelectProps, type MultiSelectRef } from './type';

const MultiSelect: FunctionComponent<
  MultiSelectProps & {
    ref?: Ref<MultiSelectRef>;
  }
> = ({
  options,
  onValueChange,
  variant,
  defaultValue = [],
  placeholder = 'Select options',
  animation = 0,
  animationConfig,
  maxCount = 3,
  modalPopover = false,
  className,
  hideSelectAll = false,
  searchable = true,
  emptyIndicator,
  autoSize = false,
  singleLine = false,
  popoverClassName,
  disabled = false,
  responsive,
  minWidth,
  maxWidth,
  deduplicateOptions = false,
  resetOnDefaultValueChange = true,
  closeOnSelect = false,
  ref,
  ...buttonProps
}) => {
  const { ids, state, derived, refs, helpers, a11yMessages, handlers } = useMultiSelect({
    options,
    onValueChange,
    defaultValue,
    animation,
    animationConfig,
    maxCount,
    responsive,
    minWidth,
    maxWidth,
    deduplicateOptions,
    resetOnDefaultValueChange,
    closeOnSelect,
    searchable,
    autoSize,
    disabled,
    forwardedRef: ref
  });

  const { selectedValues, isPopoverOpen, isAnimating, searchValue, screenSize } = state;
  const {
    filteredOptions,
    responsiveSettings,
    widthConstraints,
    badgeAnimationClass,
    popoverAnimationClass
  } = derived;
  const { buttonRef } = refs;
  const { getAllOptions, getOptionByValue } = helpers;
  const { politeMessage, assertiveMessage } = a11yMessages;
  const {
    setIsPopoverOpen,
    handleTogglePopover,
    handleInputKeyDown,
    toggleOption,
    handleClear,
    clearExtraOptions,
    toggleAll,
    setSearchValue,
    setIsAnimating
  } = handlers;

  const handlePopoverChange = (open: boolean) => {
    if (disabled) return;
    setIsPopoverOpen(open);
  };

  const ariaLabel = `Multi-select: ${selectedValues.length} of ${getAllOptions().length} options selected. ${placeholder}`;

  return (
    <>
      <LiveRegion politeMessage={politeMessage} assertiveMessage={assertiveMessage} />

      <Popover open={isPopoverOpen} onOpenChange={handlePopoverChange} modal={modalPopover}>
        <div id={ids.triggerDescriptionId} className='sr-only'>
          Multi-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.
        </div>
        <div id={ids.selectedCountId} className='sr-only' aria-live='polite'>
          {selectedValues.length === 0
            ? 'No options selected'
            : `${selectedValues.length} option${
                selectedValues.length === 1 ? '' : 's'
              } selected: ${selectedValues
                .map(value => getOptionByValue(value)?.label)
                .filter(Boolean)
                .join(', ')}`}
        </div>

        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            {...buttonProps}
            onClick={handleTogglePopover}
            disabled={disabled}
            role='combobox'
            aria-expanded={isPopoverOpen}
            aria-haspopup='listbox'
            aria-controls={isPopoverOpen ? ids.listboxId : undefined}
            aria-describedby={`${ids.triggerDescriptionId} ${ids.selectedCountId}`}
            aria-label={ariaLabel}
            className={cn(
              'flex p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto',
              autoSize ? 'w-auto' : 'w-full',
              responsiveSettings.compactMode && 'min-h-8 text-sm',
              screenSize === 'mobile' && 'min-h-12 text-base',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={{
              ...widthConstraints,
              maxWidth: `min(${widthConstraints.maxWidth}, 100%)`
            }}>
            {selectedValues.length > 0 ? (
              <SelectedValuesContent
                selectedValues={selectedValues}
                responsiveSettings={responsiveSettings}
                screenSize={screenSize}
                singleLine={singleLine}
                animation={animation}
                animationConfig={animationConfig}
                badgeAnimationClass={badgeAnimationClass}
                variant={variant}
                getOptionByValue={getOptionByValue}
                toggleOption={toggleOption}
                clearExtraOptions={clearExtraOptions}
                handleClear={handleClear}
              />
            ) : (
              <PlaceholderContent placeholder={placeholder} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={ids.listboxId}
          role='listbox'
          aria-multiselectable='true'
          aria-label='Available options'
          className={cn(
            'w-auto p-0',
            popoverAnimationClass,
            screenSize === 'mobile' && 'w-[85vw] max-w-70',
            screenSize === 'tablet' && 'w-[70vw] max-w-md',
            screenSize === 'desktop' && 'min-w-75',
            popoverClassName
          )}
          style={{
            animationDuration: `${animationConfig?.duration || animation}s`,
            animationDelay: `${animationConfig?.delay || 0}s`,
            maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
            maxHeight: screenSize === 'mobile' ? '70vh' : '60vh',
            touchAction: 'manipulation'
          }}
          align='start'
          onEscapeKeyDown={() => setIsPopoverOpen(false)}>
          <OptionsContent
            filteredOptions={filteredOptions}
            hideSelectAll={hideSelectAll}
            searchValue={searchValue}
            searchable={searchable}
            selectedValues={selectedValues}
            getAllOptions={getAllOptions}
            toggleAll={toggleAll}
            toggleOption={toggleOption}
            handleClear={handleClear}
            setIsPopoverOpen={setIsPopoverOpen}
            handleInputKeyDown={handleInputKeyDown}
            setSearchValue={setSearchValue}
            multiSelectId={ids.multiSelectId}
            emptyIndicator={emptyIndicator}
            screenSize={screenSize}
          />
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <Icons.WandSparkles
            className={cn(
              'cursor-pointer my-2 text-foreground bg-background w-3 h-3',
              isAnimating ? '' : 'text-muted-foreground'
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    </>
  );
};

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;

import {
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type SetStateAction
} from 'react';

import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  type AnimationConfig,
  multiSelectVariants,
  type MultiSelectGroup,
  type MultiSelectOption,
  type MultiSelectProps
} from './type';
import { isGroupedOptions, type ResponsiveSettings, type ScreenSize } from './utils';

export const LiveRegion = ({
  politeMessage,
  assertiveMessage
}: {
  politeMessage: string;
  assertiveMessage: string;
}) => (
  <div className='sr-only'>
    <div aria-live='polite' aria-atomic='true' role='status'>
      {politeMessage}
    </div>
    <div aria-live='assertive' aria-atomic='true' role='alert'>
      {assertiveMessage}
    </div>
  </div>
);

interface SelectedValuesContentProps {
  selectedValues: string[];
  responsiveSettings: ResponsiveSettings;
  screenSize: ScreenSize;
  singleLine: boolean;
  animation: number;
  animationConfig?: AnimationConfig;
  badgeAnimationClass: string;
  variant: MultiSelectProps['variant'];
  getOptionByValue: (value: string) => MultiSelectOption | undefined;
  toggleOption: (value: string) => void;
  clearExtraOptions: () => void;
  handleClear: () => void;
}

export const SelectedValuesContent = ({
  selectedValues,
  responsiveSettings,
  screenSize,
  singleLine,
  animation,
  animationConfig,
  badgeAnimationClass,
  variant,
  getOptionByValue,
  toggleOption,
  clearExtraOptions,
  handleClear
}: SelectedValuesContentProps) => (
  <div className='flex justify-between items-center w-full'>
    <div
      className={cn(
        'flex items-center gap-1',
        singleLine ? 'overflow-x-auto multiselect-singleline-scroll' : 'flex-wrap',
        responsiveSettings.compactMode && 'gap-0.5'
      )}
      style={
        singleLine
          ? {
              paddingBottom: '4px'
            }
          : {}
      }>
      {selectedValues
        .slice(0, responsiveSettings.maxCount)
        .map(value => {
          const option = getOptionByValue(value);
          const IconComponent = option?.icon;
          const customStyle = option?.style;
          if (!option) return null;

          const badgeStyle: CSSProperties = {
            animationDuration: `${animation}s`,
            ...(customStyle?.badgeColor && {
              backgroundColor: customStyle.badgeColor
            }),
            ...(customStyle?.gradient && {
              background: customStyle.gradient,
              color: 'white'
            })
          };

          return (
            <Badge
              key={value}
              className={cn(
                badgeAnimationClass,
                multiSelectVariants({ variant }),
                customStyle?.gradient && 'text-white border-transparent',
                responsiveSettings.compactMode && 'text-xs px-1.5 py-0.5',
                screenSize === 'mobile' && 'max-w-30 truncate',
                singleLine && 'shrink-0 whitespace-nowrap',
                '[&>svg]:pointer-events-auto'
              )}
              style={{
                ...badgeStyle,
                animationDuration: `${animationConfig?.duration || animation}s`,
                animationDelay: `${animationConfig?.delay || 0}s`
              }}>
              {IconComponent && !responsiveSettings.hideIcons && (
                <IconComponent
                  className={cn(
                    'h-4 w-4 mr-2',
                    responsiveSettings.compactMode && 'h-3 w-3 mr-1',
                    customStyle?.iconColor && 'text-current'
                  )}
                  {...(customStyle?.iconColor && {
                    style: { color: customStyle.iconColor }
                  })}
                />
              )}
              <span className={cn(screenSize === 'mobile' && 'truncate')}>{option.label}</span>
              <div
                role='button'
                tabIndex={0}
                onClick={event => {
                  event.stopPropagation();
                  toggleOption(value);
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleOption(value);
                  }
                }}
                aria-label={`Remove ${option.label} from selection`}
                className='ml-2 h-4 w-4 cursor-pointer hover:bg-white/20 rounded-sm p-0.5 -m-0.5 focus:outline-none focus:ring-1 focus:ring-white/50'>
                <XCircle
                  className={cn('h-3 w-3', responsiveSettings.compactMode && 'h-2.5 w-2.5')}
                />
              </div>
            </Badge>
          );
        })
        .filter(Boolean)}
      {selectedValues.length > responsiveSettings.maxCount && (
        <Badge
          className={cn(
            'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
            badgeAnimationClass,
            multiSelectVariants({ variant }),
            responsiveSettings.compactMode && 'text-xs px-1.5 py-0.5',
            singleLine && 'shrink-0 whitespace-nowrap',
            '[&>svg]:pointer-events-auto'
          )}
          style={{
            animationDuration: `${animationConfig?.duration || animation}s`,
            animationDelay: `${animationConfig?.delay || 0}s`
          }}>
          {`+ ${selectedValues.length - responsiveSettings.maxCount} more`}
          <XCircle
            className={cn(
              'ml-2 h-4 w-4 cursor-pointer',
              responsiveSettings.compactMode && 'ml-1 h-3 w-3'
            )}
            onClick={event => {
              event.stopPropagation();
              clearExtraOptions();
            }}
          />
        </Badge>
      )}
    </div>
    <div className='flex items-center justify-between'>
      <div
        role='button'
        tabIndex={0}
        onClick={event => {
          event.stopPropagation();
          handleClear();
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            handleClear();
          }
        }}
        aria-label={`Clear all ${selectedValues.length} selected options`}
        className='flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-sm'>
        <XIcon className='h-4 w-4' />
      </div>
      <Separator orientation='vertical' className='flex min-h-6 h-full' />
      <ChevronDown className='h-4 mx-2 cursor-pointer text-muted-foreground' aria-hidden='true' />
    </div>
  </div>
);

export const PlaceholderContent = ({ placeholder }: { placeholder: string }) => (
  <div className='flex items-center justify-between w-full mx-auto'>
    <span className='text-sm text-muted-foreground mx-3'>{placeholder}</span>
    <ChevronDown className='h-4 cursor-pointer text-muted-foreground mx-2' />
  </div>
);

interface OptionsContentProps {
  filteredOptions: MultiSelectOption[] | MultiSelectGroup[];
  hideSelectAll: boolean;
  searchValue: string;
  searchable: boolean;
  selectedValues: string[];
  getAllOptions: () => MultiSelectOption[];
  toggleAll: () => void;
  toggleOption: (value: string) => void;
  handleClear: () => void;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  setSearchValue: Dispatch<SetStateAction<string>>;
  multiSelectId: string;
  emptyIndicator?: ReactNode;
  screenSize: ScreenSize;
}

export const OptionsContent = ({
  filteredOptions,
  hideSelectAll,
  searchValue,
  searchable,
  selectedValues,
  getAllOptions,
  toggleAll,
  toggleOption,
  handleClear,
  setIsPopoverOpen,
  handleInputKeyDown,
  setSearchValue,
  multiSelectId,
  emptyIndicator,
  screenSize
}: OptionsContentProps) => (
  <Command>
    {searchable && (
      <CommandInput
        placeholder='Search options...'
        onKeyDown={handleInputKeyDown}
        value={searchValue}
        onValueChange={setSearchValue}
        aria-label='Search through available options'
        aria-describedby={`${multiSelectId}-search-help`}
      />
    )}
    {searchable && (
      <div id={`${multiSelectId}-search-help`} className='sr-only'>
        Type to filter options. Use arrow keys to navigate results.
      </div>
    )}
    <CommandList
      className={cn(
        'max-h-[40vh] overflow-y-auto multiselect-scrollbar',
        screenSize === 'mobile' && 'max-h-[50vh]',
        'overscroll-behavior-y-contain'
      )}>
      <CommandEmpty>{emptyIndicator || 'No results found.'}</CommandEmpty>{' '}
      {!hideSelectAll && !searchValue && (
        <CommandGroup>
          <CommandItem
            key='all'
            onSelect={toggleAll}
            role='option'
            aria-selected={
              selectedValues.length === getAllOptions().filter(opt => !opt.disabled).length
            }
            aria-label={`Select all ${getAllOptions().length} options`}
            className='cursor-pointer'>
            <div
              className={cn(
                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                selectedValues.length === getAllOptions().filter(opt => !opt.disabled).length
                  ? 'bg-primary text-primary-foreground'
                  : 'opacity-50 [&_svg]:invisible'
              )}
              aria-hidden='true'>
              <CheckIcon className='h-4 w-4' />
            </div>
            <span>
              (Select All
              {getAllOptions().length > 20 ? ` - ${getAllOptions().length} options` : ''})
            </span>
          </CommandItem>
        </CommandGroup>
      )}
      {isGroupedOptions(filteredOptions) ? (
        filteredOptions.map(group => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.options.map(option => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  role='option'
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  aria-label={`${option.label}${isSelected ? ', selected' : ', not selected'}${option.disabled ? ', disabled' : ''}`}
                  className={cn(
                    'cursor-pointer',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={option.disabled}>
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                    aria-hidden='true'>
                    <CheckIcon className='h-4 w-4' />
                  </div>
                  {option.icon && (
                    <option.icon
                      className='mr-2 h-4 w-4 text-muted-foreground'
                      aria-hidden='true'
                    />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))
      ) : (
        <CommandGroup>
          {filteredOptions.map(option => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                role='option'
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                aria-label={`${option.label}${isSelected ? ', selected' : ', not selected'}${option.disabled ? ', disabled' : ''}`}
                className={cn('cursor-pointer', option.disabled && 'opacity-50 cursor-not-allowed')}
                disabled={option.disabled}>
                <div
                  className={cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )}
                  aria-hidden='true'>
                  <CheckIcon className='h-4 w-4' />
                </div>
                {option.icon && (
                  <option.icon className='mr-2 h-4 w-4 text-muted-foreground' aria-hidden='true' />
                )}
                <span>{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      )}
      <CommandSeparator />
      <CommandGroup>
        <div className='flex items-center justify-between'>
          {selectedValues.length > 0 && (
            <>
              <CommandItem onSelect={handleClear} className='flex-1 justify-center cursor-pointer'>
                Clear
              </CommandItem>
              <Separator orientation='vertical' className='flex min-h-6 h-full' />
            </>
          )}
          <CommandItem
            onSelect={() => setIsPopoverOpen(false)}
            className='flex-1 justify-center cursor-pointer max-w-full'>
            Close
          </CommandItem>
        </div>
      </CommandGroup>
    </CommandList>
  </Command>
);

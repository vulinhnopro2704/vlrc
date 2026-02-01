import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Icons from '@/components/Icons';
import type { BaseSelectOption, SelectValue } from '@/components/Select';

/**
 * Component to render tags for multi-select with responsive behavior
 */
export function MultiSelectTags<T extends SelectValue = SelectValue>({
  selectedOptions,
  maxTagCount = 'responsive',
  onRemove,
  disabled,
  tagRender
}: {
  selectedOptions: BaseSelectOption<T>[];
  maxTagCount?: number | 'responsive';
  onRemove: (value: T) => void;
  disabled?: boolean;
  tagRender?: (option: BaseSelectOption<T>, onRemove: () => void) => React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(selectedOptions.length);
  const [hiddenOptions, setHiddenOptions] = useState<BaseSelectOption<T>[]>([]);

  useEffect(() => {
    if (maxTagCount === 'responsive' && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth - 60; // Reserve space for +N badge
      let totalWidth = 0;
      let count = 0;

      const children = Array.from(container.children);
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.classList.contains('select-tag')) {
          const childWidth = child.offsetWidth + 4; // Include gap
          if (totalWidth + childWidth <= containerWidth) {
            totalWidth += childWidth;
            count++;
          } else {
            break;
          }
        }
      }

      if (count < selectedOptions.length) {
        setVisibleCount(Math.max(1, count - 1)); // Show at least 1 tag
        setHiddenOptions(selectedOptions.slice(Math.max(1, count - 1)));
      } else {
        setVisibleCount(selectedOptions.length);
        setHiddenOptions([]);
      }
    } else if (typeof maxTagCount === 'number') {
      setVisibleCount(Math.min(maxTagCount, selectedOptions.length));
      setHiddenOptions(selectedOptions.slice(maxTagCount));
    } else {
      setVisibleCount(selectedOptions.length);
      setHiddenOptions([]);
    }
  }, [selectedOptions, maxTagCount]);

  const defaultTagRender = (option: BaseSelectOption<T>, handleRemove: () => void) => (
    <Badge
      key={option.value}
      variant='secondary'
      className='select-tag flex items-center gap-1 px-2 py-0.5 text-xs whitespace-nowrap'>
      {option.icon && <span className='text-xs'>{option.icon}</span>}
      <span className='truncate max-w-[100px]'>{option.label}</span>
      {!disabled && (
        <Icons.XIcon
          className='w-3 h-3 cursor-pointer hover:text-destructive'
          onClick={e => {
            e.stopPropagation();
            handleRemove();
          }}
        />
      )}
    </Badge>
  );

  const renderTag = tagRender || defaultTagRender;

  return (
    <div ref={containerRef} className='flex items-center gap-1 flex-wrap flex-1 min-w-0'>
      {selectedOptions.slice(0, visibleCount).map(opt => renderTag(opt, () => onRemove(opt.value)))}
      {hiddenOptions.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant='outline' className='cursor-help text-xs px-2 py-0.5'>
                +{hiddenOptions.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='max-w-xs'>
              <div className='flex flex-col gap-1'>
                {hiddenOptions.map(opt => (
                  <div key={opt.value} className='flex items-center gap-2 text-xs'>
                    {opt.icon && <span>{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

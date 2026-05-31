import {
  type MultiSelectProps,
  type MultiSelectGroup,
  type MultiSelectOption,
  type AnimationConfig
} from './type';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveSettings {
  maxCount: number;
  hideIcons: boolean;
  compactMode: boolean;
}

export interface WidthConstraints {
  minWidth: string;
  maxWidth: string;
  width: string;
}

export const isGroupedOptions = (
  opts: MultiSelectOption[] | MultiSelectGroup[]
): opts is MultiSelectGroup[] => {
  return Array.isArray(opts) && opts.length > 0 && 'heading' in opts[0];
};

export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

export const buildAllOptions = (
  options: MultiSelectOption[] | MultiSelectGroup[],
  deduplicateOptions: boolean
): { options: MultiSelectOption[]; duplicates: string[] } => {
  if (options.length === 0) return { options: [], duplicates: [] };
  const flatOptions = isGroupedOptions(options) ? options.flatMap(group => group.options) : options;
  const valueSet = new Set<string>();
  const duplicates: string[] = [];
  const uniqueOptions: MultiSelectOption[] = [];

  flatOptions.forEach(option => {
    if (valueSet.has(option.value)) {
      duplicates.push(option.value);
      if (!deduplicateOptions) {
        uniqueOptions.push(option);
      }
    } else {
      valueSet.add(option.value);
      uniqueOptions.push(option);
    }
  });

  return {
    options: deduplicateOptions ? uniqueOptions : flatOptions,
    duplicates
  };
};

export const computeResponsiveSettings = (
  responsive: MultiSelectProps['responsive'],
  maxCount: number,
  screenSize: ScreenSize
): ResponsiveSettings => {
  if (!responsive) {
    return {
      maxCount,
      hideIcons: false,
      compactMode: false
    };
  }

  if (responsive === true) {
    const defaultResponsive = {
      mobile: { maxCount: 2, hideIcons: false, compactMode: true },
      tablet: { maxCount: 4, hideIcons: false, compactMode: false },
      desktop: { maxCount: 6, hideIcons: false, compactMode: false }
    } satisfies Record<ScreenSize, ResponsiveSettings>;

    const currentSettings = defaultResponsive[screenSize];
    return {
      maxCount: currentSettings?.maxCount ?? maxCount,
      hideIcons: currentSettings?.hideIcons ?? false,
      compactMode: currentSettings?.compactMode ?? false
    };
  }

  const currentSettings = responsive[screenSize];
  return {
    maxCount: currentSettings?.maxCount ?? maxCount,
    hideIcons: currentSettings?.hideIcons ?? false,
    compactMode: currentSettings?.compactMode ?? false
  };
};

export const buildBadgeAnimationClass = (
  isAnimating: boolean,
  animationConfig?: AnimationConfig
): string => {
  if (animationConfig?.badgeAnimation) {
    switch (animationConfig.badgeAnimation) {
      case 'bounce':
        return isAnimating ? 'animate-bounce' : 'hover:-translate-y-1 hover:scale-110';
      case 'pulse':
        return 'hover:animate-pulse';
      case 'wiggle':
        return 'hover:animate-wiggle';
      case 'fade':
        return 'hover:opacity-80';
      case 'slide':
        return 'hover:translate-x-1';
      case 'none':
        return '';
      default:
        return '';
    }
  }

  return isAnimating ? 'animate-bounce' : '';
};

export const buildPopoverAnimationClass = (animationConfig?: AnimationConfig): string => {
  if (animationConfig?.popoverAnimation) {
    switch (animationConfig.popoverAnimation) {
      case 'scale':
        return 'animate-scaleIn';
      case 'slide':
        return 'animate-slideInDown';
      case 'fade':
        return 'animate-fadeIn';
      case 'flip':
        return 'animate-flipIn';
      case 'none':
        return '';
      default:
        return '';
    }
  }

  return '';
};

export const filterOptions = (
  options: MultiSelectOption[] | MultiSelectGroup[],
  searchValue: string,
  searchable: boolean
): MultiSelectOption[] | MultiSelectGroup[] => {
  if (!searchable || !searchValue) return options;
  if (options.length === 0) return [];

  if (isGroupedOptions(options)) {
    return options
      .map(group => ({
        ...group,
        options: group.options.filter(
          option =>
            option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
            option.value.toLowerCase().includes(searchValue.toLowerCase())
        )
      }))
      .filter(group => group.options.length > 0);
  }

  return options.filter(
    option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase())
  );
};

export const buildWidthConstraints = (
  screenSize: ScreenSize,
  autoSize: boolean,
  minWidth?: string,
  maxWidth?: string
): WidthConstraints => {
  const defaultMinWidth = screenSize === 'mobile' ? '0px' : '200px';
  const effectiveMinWidth = minWidth || defaultMinWidth;
  const effectiveMaxWidth = maxWidth || '100%';

  return {
    minWidth: effectiveMinWidth,
    maxWidth: effectiveMaxWidth,
    width: autoSize ? 'auto' : '100%'
  };
};

export const countMatchingOptions = (options: MultiSelectOption[], searchValue: string): number => {
  if (!searchValue) return options.length;
  const lowered = searchValue.toLowerCase();
  return options.filter(
    opt => opt.label.toLowerCase().includes(lowered) || opt.value.toLowerCase().includes(lowered)
  ).length;
};

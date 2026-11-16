import { RefObject, useLayoutEffect } from "react";

type UseAutoScrollIntoViewProps = {
  elementRef: RefObject<HTMLElement | null>;
  containerRef?: RefObject<HTMLElement | null>;
  dependencies?: any[];
  disabled?: boolean;
  behavior?: ScrollBehavior;
};

export function useAutoScrollIntoView({
  elementRef,
  containerRef,
  dependencies = [],
  disabled = false,
  behavior = "smooth",
}: UseAutoScrollIntoViewProps) {
  useLayoutEffect(() => {
    const element = elementRef.current;
    const container = containerRef?.current;

    if (!element || !container || disabled) return;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Actual visible boundaries of the scrollable container.
    const visibleTop = containerRect.top + container.clientTop;
    const visibleBottom = visibleTop + container.clientHeight;

    // Scroll only if the element is below the visible area.
    if (elementRect.bottom > visibleBottom) {
      const overflow = elementRect.bottom - visibleBottom;

      const targetScroll = Math.min(
        container.scrollTop + overflow,
        container.scrollHeight - container.clientHeight,
      );

      if (targetScroll > container.scrollTop) {
        container.scrollTo({
          top: targetScroll,
          behavior,
        });
      }
    }
  }, [elementRef, containerRef, disabled, behavior, ...dependencies]);
}

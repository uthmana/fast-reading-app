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

    // Check whether the entire highlighted text is visible.
    const isFullyVisible =
      elementRect.top >= visibleTop && elementRect.bottom <= visibleBottom;

    if (isFullyVisible) return;

    // Calculate the centers.
    const elementCenter = elementRect.top + elementRect.height / 2;
    const containerCenter = visibleTop + container.clientHeight / 2;

    const offset = elementCenter - containerCenter;

    // Keep scrolling within container boundaries.
    const maxScroll = container.scrollHeight - container.clientHeight;

    const targetScroll = Math.max(
      0,
      Math.min(container.scrollTop + offset, maxScroll),
    );

    container.scrollTo({
      top: targetScroll,
      behavior,
    });
  }, [elementRef, containerRef, disabled, behavior, ...dependencies]);
}

import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

interface AnchoredPopoverRefs {
  triggerRef: RefObject<HTMLElement | null>;
  popoverRef: RefObject<HTMLElement | null>;
}

export function useAnchoredPopoverPosition(
  isOpen: boolean,
  { triggerRef, popoverRef }: AnchoredPopoverRefs,
): CSSProperties | undefined {
  const [position, setPosition] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(undefined);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;
      if (!trigger || !popover) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const viewportPadding = 12;
      const gap = 8;
      const width = Math.min(
        popoverRect.width,
        window.innerWidth - viewportPadding * 2,
      );
      const maxLeft = window.innerWidth - width - viewportPadding;
      const left = Math.max(
        viewportPadding,
        Math.min(triggerRect.left, maxLeft),
      );
      const spaceBelow =
        window.innerHeight - triggerRect.bottom - gap - viewportPadding;
      const spaceAbove = triggerRect.top - gap - viewportPadding;
      const popoverFitsBelow = popoverRect.height <= spaceBelow;
      const popoverFitsAbove = popoverRect.height <= spaceAbove;
      const openAbove =
        !popoverFitsBelow && (popoverFitsAbove || spaceAbove > spaceBelow);
      const availableHeight = Math.max(
        0,
        openAbove ? spaceAbove : spaceBelow,
      );
      const top = openAbove
        ? Math.max(
            viewportPadding,
            triggerRect.top - gap - Math.min(popoverRect.height, availableHeight),
          )
        : triggerRect.bottom + gap;

      setPosition({
        position: "fixed",
        top,
        left,
        width,
        maxHeight: availableHeight,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const observer = new ResizeObserver(updatePosition);
    if (triggerRef.current) observer.observe(triggerRef.current);
    if (popoverRef.current) observer.observe(popoverRef.current);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer.disconnect();
    };
  }, [isOpen, popoverRef, triggerRef]);

  return position;
}

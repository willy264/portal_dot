"use client";

import { useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";

/** A decorative indicator; links/buttons retain their native focus and selection semantics. */
export function PillGroup({
  as: Tag = "div",
  activeKey,
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "div" | "nav"; activeKey: string }) {
  const ref = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ x: 0, y: 0, width: 0, height: 0 });
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const selected = group.querySelector<HTMLElement>(
        '[aria-current="page"], [aria-pressed="true"]',
      );
      const next =
        selected && selected.getClientRects().length
          ? {
              x: selected.offsetLeft,
              y: selected.offsetTop,
              width: selected.offsetWidth,
              height: selected.offsetHeight,
            }
          : { x: 0, y: 0, width: 0, height: 0 };
      setPill((old) =>
        Object.keys(next).every(
          (key) =>
            old[key as keyof typeof next] === next[key as keyof typeof next],
        )
          ? old
          : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    group
      .querySelectorAll("a,button")
      .forEach((node) => observer.observe(node));
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [activeKey, children]);
  return (
    <Tag
      {...props}
      ref={ref as React.Ref<HTMLDivElement>}
      className={`pill-group ${className}`}
      data-pill-ready={pill.width > 0}
    >
      <span
        aria-hidden="true"
        className="selection-pill"
        style={{
          width: pill.width,
          height: pill.height,
          transform: `translate(${pill.x}px, ${pill.y}px)`,
        }}
      />
      {children}
    </Tag>
  );
}

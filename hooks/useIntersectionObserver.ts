import { useCallback, useEffect, useRef, useState, RefObject } from "react";

export type IOOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
};

type Target<T extends Element = Element> =
  | RefObject<T>
  | T
  | Array<RefObject<T> | T>
  | null
  | undefined;

export function useIntersectionObserver<T extends Element = Element>(
  target: Target<T>,
  callback?: (entry: IntersectionObserverEntry) => void,
  options: IOOptions = {}
) {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const isIntersecting = !!entry?.isIntersecting;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const optionsRef = useRef<IOOptions>({
    root,
    rootMargin,
    threshold,
    freezeOnceVisible,
  });
  optionsRef.current = { root, rootMargin, threshold, freezeOnceVisible };

  const getElementsFromTarget = useCallback((t: Target<T>): T[] => {
    if (!t) return [];
    if (Array.isArray(t)) {
      return t
        .map((item) =>
          item && "current" in item
            ? (item.current as T | null)
            : (item as T | null)
        )
        .filter(Boolean) as T[];
    }
    if ("current" in t) {
      return t.current ? [t.current as T] : [];
    }
    return (t ? [t as T] : []) as T[];
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const opts = optionsRef.current;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setEntry(e);
          if (callback) {
            try {
              callback(e);
            } catch (err) {
            }
          }
        });

        if (opts.freezeOnceVisible) {
          const anyVisible = entries.some((e) => e.isIntersecting);
          if (anyVisible && observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        root: opts.root ?? null,
        rootMargin: opts.rootMargin,
        threshold: opts.threshold,
      }
    );

    const elements = getElementsFromTarget(target);
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [target, callback]);

  return {
    entry,
    isIntersecting,
    observer: observerRef.current,
  } as const;
}

export function useOnScreen<T extends Element = Element>(
  ref: RefObject<T> | null,
  opts: Omit<IOOptions, "freezeOnceVisible"> = {}
) {
  const { entry, isIntersecting } = useIntersectionObserver<T>(
    ref,
    undefined,
    opts
  );
  return isIntersecting;
}

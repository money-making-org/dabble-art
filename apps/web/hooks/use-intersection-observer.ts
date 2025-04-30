import { useEffect, useState } from "react";

export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {
    threshold: 0,
    root: null,
    rootMargin: "0px",
  }
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]) {
        setIsIntersecting(entries[0].isIntersecting);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
} 
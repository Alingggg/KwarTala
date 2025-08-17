import { useCallback, useRef } from "react";

function useFetchOnScroll(
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetching: boolean
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage();
          }
        },
        {
          threshold: 1.0,
        }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetching]
  );

  return sentinelRef;
}

export default useFetchOnScroll;

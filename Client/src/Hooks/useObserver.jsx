import { useRef, useCallback } from "react";
const useObserver = (configuration, onObserve, dependencies) => {
  const observer = useRef();
  const mostMessagesRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        ([entry]) => onObserve(entry),
        configuration
      );
      if (node) observer.current.observe(node);
    },
    [...dependencies]
  );
  return [mostMessagesRef];
};

export default useObserver;

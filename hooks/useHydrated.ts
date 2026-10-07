import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/**
 * False on the server and during hydration, true after. Use it to hide
 * content for an entrance animation only once JS is running to reveal it.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

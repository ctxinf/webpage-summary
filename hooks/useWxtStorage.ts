import { useEffect, useState, useRef, useCallback } from 'react';
import { storage, type StorageItemKey } from '#imports';

/**
 * A React hook to read, write, and synchronize state with WXT storage.
 * Supports cross-context updates automatically.
 *
 * @param key The storage key (must be prefixed with local:, sync:, session:, or managed:)
 * @param defaultValue The fallback value if storage is empty
 */
export default function useWxtStorage<T>(key: StorageItemKey, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Track default value in a ref to avoid recreating the effect if the reference changes
  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      try {
        const storedValue = await storage.getItem<T>(key, {
          fallback: defaultValueRef.current,
        });
        if (active) {
          setValue(storedValue ?? defaultValueRef.current);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error(`[useWxtStorage] Failed to get storage key "${key}":`, error);
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    loadInitial();

    // Watch for changes (from other scripts / tabs / options pages)
    const unwatch = storage.watch<T>(key, (newValue) => {
      if (active) {
        setValue(newValue ?? defaultValueRef.current);
      }
    });

    return () => {
      active = false;
      unwatch();
    };
  }, [key]);

  // Writable wrapper
  const setStorageValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        let resolvedValue: T;
        if (typeof newValue === 'function') {
          // Note: Since setStorageValue is async, we evaluate it with current value
          resolvedValue = (newValue as Function)(value);
        } else {
          resolvedValue = newValue;
        }

        setValue(resolvedValue);
        await storage.setItem(key, resolvedValue);
      } catch (error) {
        console.error(`[useWxtStorage] Failed to set storage key "${key}":`, error);
      }
    },
    [key, value]
  );

  return [value, setStorageValue, isLoaded] as const;
}

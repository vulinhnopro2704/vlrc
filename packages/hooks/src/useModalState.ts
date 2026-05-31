import { useEffect, useMemo, useRef, useState } from 'react';

export type ModalState = { load: boolean; open: boolean };

export type UseModalStateOptions = {
  destroyDelay?: number;
};

export function useModalState<const T extends ReadonlyArray<string>>(
  keyList: T,
  options?: UseModalStateOptions
) {
  type Key = T[number];

  const destroyDelay = options?.destroyDelay ?? 300;
  const keySignature = useMemo(() => JSON.stringify(keyList), [keyList]);

  const makeInitial = (keys: ReadonlyArray<string>) =>
    keys.reduce<Record<string, ModalState>>((acc, key) => {
      acc[key] = { load: false, open: false };
      return acc;
    }, {});

  const [modal, setModal] = useState<Record<Key, ModalState>>(
    () => makeInitial(keyList) as Record<Key, ModalState>
  );

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    setModal(prev => {
      let changed = false;
      const next = { ...(prev as Record<string, ModalState>) } as Record<Key, ModalState>;

      for (const key of keyList) {
        if (!(key in next)) {
          next[key as Key] = { load: false, open: false };
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [keyList, keySignature]);

  const openModal = (name: Key) => {
    setModal(prev => {
      if (!(name in prev)) return prev;

      const timer = timersRef.current.get(String(name));
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(String(name));
      }

      return {
        ...prev,
        [name]: { ...prev[name], open: true, load: true }
      };
    });
  };

  const closeModal = (name: Key) => {
    setModal(prev => {
      if (!(name in prev)) return prev;

      return {
        ...prev,
        [name]: { ...prev[name], open: false }
      };
    });

    if (destroyDelay <= 0) {
      setModal(prev => {
        if (!(name in prev)) return prev;
        return { ...prev, [name]: { ...prev[name], load: false } };
      });
      return;
    }

    const key = String(name);
    const existing = timersRef.current.get(key);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(key);
    }

    const timer = setTimeout(() => {
      setModal(prev => {
        if (!(name in prev)) return prev;
        return { ...prev, [name]: { ...prev[name], load: false } };
      });
      timersRef.current.delete(key);
    }, destroyDelay);
    timersRef.current.set(key, timer);
  };

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  return {
    modal,
    openModal,
    closeModal
  } as {
    modal: Record<Key, ModalState>;
    openModal: (name: Key) => void;
    closeModal: (name: Key) => void;
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';

type ModalState = { load: boolean; open: boolean };

type UseModalStateOptions = {
  destroyDelay?: number;
};

export function useModalState<const T extends ReadonlyArray<string>>(
  keyList: T,
  options?: UseModalStateOptions
) {
  type Key = T[number];

  const destroyDelay = options?.destroyDelay ?? 300;

  const makeInitial = (keys: ReadonlyArray<string>) =>
    keys.reduce<Record<string, ModalState>>((acc, k) => {
      acc[k] = { load: false, open: false };
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
      for (const k of keyList) {
        if (!(k in next)) {
          next[k as Key] = { load: false, open: false } as ModalState;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [JSON.stringify(keyList)]);

  const openModal = useCallback((name: Key) => {
    setModal(prev => {
      if (!(name in prev)) {
        return prev;
      }
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
  }, []);

  const closeModal = useCallback(
    (name: Key) => {
      setModal(prev => {
        if (!(name in prev)) {
          return prev;
        }
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

      const keyStr = String(name);
      const existing = timersRef.current.get(keyStr);
      if (existing) {
        clearTimeout(existing);
        timersRef.current.delete(keyStr);
      }
      const t = setTimeout(() => {
        setModal(prev => {
          if (!(name in prev)) return prev;
          return { ...prev, [name]: { ...prev[name], load: false } };
        });
        timersRef.current.delete(keyStr);
      }, destroyDelay);
      timersRef.current.set(keyStr, t);
    },
    [destroyDelay]
  );

  useEffect(() => {
    return () => {
      for (const t of timersRef.current.values()) {
        clearTimeout(t);
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

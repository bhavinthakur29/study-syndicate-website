"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

const Ctx = createContext<(text: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);

  const notify = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, text }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 6000);
  }, []);

  return (
    <Ctx.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => (
          <p
            key={t.id}
            className="pointer-events-auto max-w-md rounded-xl bg-navy-deep px-5 py-3 font-semibold text-white shadow-xl"
          >
            {t.text}
          </p>
        ))}
      </div>
    </Ctx.Provider>
  );
}

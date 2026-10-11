"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/admin/ui";

type Options = { title: string; message: string; confirmLabel: string };

export function useConfirm() {
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const [opts, setOpts] = useState<Options | null>(null);

  const confirm = (o: Options) =>
    new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setOpts(o);
      ref.current?.showModal();
    });

  const yes = () => {
    const r = resolver.current;
    resolver.current = null;
    ref.current?.close();
    r?.(true);
  };

  const dialog = (
    <dialog
      ref={ref}
      onClose={() => {
        resolver.current?.(false);
        resolver.current = null;
      }}
      className="m-auto w-[min(26rem,90vw)] rounded-2xl bg-white p-6 text-navy backdrop:bg-black/55"
    >
      <h2 className="font-display text-xl font-extrabold">{opts?.title}</h2>
      <p className="mt-2 text-navy/70">{opts?.message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={yes}>{opts?.confirmLabel}</Button>
        <Button variant="outline" onClick={() => ref.current?.close()}>
          Cancel
        </Button>
      </div>
    </dialog>
  );

  return { confirm, dialog };
}

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

export default function Page() {
  let [open, setOpen] = useState(false);

  return (
    <div className="mt-8 p-8">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>Click me</Dialog.Trigger>
        <AnimatePresence>
          {open && <MyDialog key="dialog">The contents</MyDialog>}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}

function MyDialog({ children }: { children: ReactNode }) {
  let [isPresent, safeToRemove] = usePresence();
  let [overlay, animateOverlay] = useAnimate();
  let [content, animateContent] = useAnimate();

  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await Promise.all([
          animateOverlay(overlay.current, { opacity: [0, 1] }),
          animateContent(content.current, {
            opacity: [0, 1],
            marginTop: [20, 0],
          }),
        ]);
      };

      enterAnimation();
    } else {
      const exitAnimation = async () => {
        await Promise.all([
          animateOverlay(overlay.current, { opacity: [1, 0] }),
          animateContent(content.current, {
            opacity: [1, 0],
            marginTop: [0, 20],
          }),
        ]);

        safeToRemove && safeToRemove();
      };
      exitAnimation();
    }
  }, [
    animateContent,
    animateOverlay,
    content,
    isPresent,
    overlay,
    safeToRemove,
  ]);

  return (
    <Dialog.Portal forceMount>
      <Dialog.Overlay ref={overlay} className="fixed inset-0 bg-black/50" />
      <Dialog.Content
        ref={content}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-8 shadow"
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

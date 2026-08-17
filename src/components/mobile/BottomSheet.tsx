import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Height as CSS value, defaults to auto (up to 90dvh). */
  maxHeight?: string;
  /** Show drag handle */
  handle?: boolean;
  footer?: ReactNode;
};

/**
 * Mobile-first bottom sheet. Slides up from bottom, supports drag-to-dismiss.
 * On desktop (md+) it centers as a modal instead.
 */
export function BottomSheet({ open, onClose, title, children, maxHeight = "90dvh", handle = true, footer }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const startY = useRef<number | null>(null);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 220);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      currentY.current = dy;
      if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = () => {
    if (sheetRef.current) sheetRef.current.style.transition = "";
    if (currentY.current > 120) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    startY.current = null;
    currentY.current = 0;
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`
          absolute bottom-0 inset-x-0 bg-background shadow-2xl flex flex-col
          rounded-t-2xl md:rounded-2xl md:max-w-lg md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:inset-x-4
          transition-transform duration-200 ease-out
          ${visible ? "translate-y-0" : "translate-y-full md:translate-y-[calc(-50%+40px)] md:opacity-0"}
        `}
        style={{ maxHeight }}
      >
        {handle && (
          <div
            className="pt-2 pb-1 flex justify-center cursor-grab active:cursor-grabbing md:hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="w-10 h-1.5 rounded-full bg-border" />
          </div>
        )}
        {title && (
          <header className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-display font-bold text-lg">{title}</h2>
            <button onClick={onClose} aria-label="إغلاق" className="p-1 tap"><X className="w-5 h-5" /></button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-border p-4 pb-safe bg-card">{footer}</div>}
      </div>
    </div>
  );
}

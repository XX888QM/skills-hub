"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localeMeta, locales, type Locale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

const GAP = 6;
const VIEW_PAD = 8;
const SHORT_VIEWPORT = 380;

type MenuCoords = {
  top: number;
  left: number;
  maxHeight?: number;
};

function placeMenu(button: DOMRect, menuWidth: number, menuHeight: number): MenuCoords {
  const spaceBelow = window.innerHeight - button.bottom - GAP - VIEW_PAD;
  const spaceAbove = button.top - GAP - VIEW_PAD;
  const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;
  const allowScroll = window.innerHeight < SHORT_VIEWPORT;

  let top: number;
  let maxHeight: number | undefined;

  if (openUp) {
    if (allowScroll && menuHeight > spaceAbove) {
      maxHeight = Math.max(spaceAbove, 120);
      top = VIEW_PAD;
    } else {
      top = Math.max(VIEW_PAD, button.top - GAP - menuHeight);
    }
  } else if (allowScroll && menuHeight > spaceBelow) {
    top = button.bottom + GAP;
    maxHeight = Math.max(spaceBelow, 120);
  } else {
    top = button.bottom + GAP;
  }

  const left = Math.min(
    Math.max(VIEW_PAD, button.right - menuWidth),
    Math.max(VIEW_PAD, window.innerWidth - menuWidth - VIEW_PAD),
  );

  return { top, left, maxHeight };
}

function LocaleRow({ locale }: { locale: Locale }) {
  const { flag, native } = localeMeta[locale];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="inline-block w-[1.35em] shrink-0 text-center leading-none" aria-hidden>
        {flag}
      </span>
      {native}
    </span>
  );
}

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function sync() {
      const button = buttonRef.current;
      const menu = menuRef.current;
      if (!button || !menu) return;
      menu.style.maxHeight = "";
      setCoords(placeMenu(button.getBoundingClientRect(), menu.offsetWidth, menu.scrollHeight));
    }

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            className={`fixed z-50 min-w-[10.5rem] rounded-2xl border border-white/15 bg-background py-1 text-[13px] shadow-lg ${
              coords?.maxHeight ? "overflow-y-auto" : "overflow-visible"
            }`}
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              maxHeight: coords?.maxHeight,
              visibility: coords ? "visible" : "hidden",
            }}
          >
            {locales.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item === locale}
                  className={`flex min-h-11 w-full items-center whitespace-nowrap px-3.5 py-2 text-left transition-colors duration-200 ${
                    item === locale ? "text-foreground" : "text-quiet hover:text-foreground"
                  }`}
                  onClick={() => {
                    setLocale(item);
                    setOpen(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                    event.preventDefault();
                    const index = locales.indexOf(item);
                    const next =
                      event.key === "ArrowDown"
                        ? locales[(index + 1) % locales.length]
                        : locales[(index - 1 + locales.length) % locales.length];
                    menuRef.current
                      ?.querySelector<HTMLButtonElement>(`[data-locale="${next}"]`)
                      ?.focus();
                  }}
                  data-locale={item}
                >
                  <LocaleRow locale={item} />
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.label")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-white/15 bg-background px-3.5 text-[13px] text-quiet transition-colors duration-200 hover:text-foreground"
      >
        <LocaleRow locale={locale} />
      </button>
      {menu}
    </div>
  );
}

"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cx } from "@/lib/cx";

export type CustomSelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  id?: string;
  labelId: string;
  name: string;
  options: readonly CustomSelectOption[];
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

export default function CustomSelect({
  id,
  labelId,
  name,
  options,
  placeholder = "Select an option",
  required = false,
  value,
  onChange,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id ?? `${generatedId}-select`;
  const listboxId = `${selectId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsidePointerDown(event: globalThis.PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [isOpen]);

  function openAt(index: number) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function selectOption(index: number) {
    const option = options[index];
    if (!option) return;

    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (options.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openAt(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setActiveIndex((current) => (current + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          openAt(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        } else {
          setActiveIndex((current) => (current - 1 + options.length) % options.length);
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(activeIndex);
        } else {
          openAt(selectedIndex >= 0 ? selectedIndex : 0);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        if (event.key.length === 1 && event.key.trim()) {
          const firstMatch = options.findIndex((option) =>
            option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()),
          );
          if (firstMatch >= 0) {
            event.preventDefault();
            if (isOpen) {
              setActiveIndex(firstMatch);
            } else {
              openAt(firstMatch);
            }
          }
        }
    }
  }

  function handleOptionPointerDown(event: PointerEvent<HTMLLIElement>) {
    if (event.pointerType === "mouse") {
      event.preventDefault();
    }
  }

  return (
    <div className="relative min-w-0" ref={rootRef}>
      <input name={name} type="hidden" value={value} />
      <button
        aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-required={required}
        className="flex min-h-[2.9rem] w-full cursor-pointer items-center justify-between gap-4 rounded-sm border border-line bg-bg/65 px-[0.85rem] py-[0.7rem] text-left font-sans text-[0.9rem] text-body transition-[border-color,box-shadow] duration-150 ease-standard hover:border-mint hover:shadow-[0_0_12px_rgb(140_245_189/0.25)] focus-visible:border-mint focus-visible:shadow-[0_0_12px_rgb(140_245_189/0.25)] aria-expanded:border-mint aria-expanded:shadow-[0_0_12px_rgb(140_245_189/0.25)]"
        id={selectId}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openAt(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        role="combobox"
        type="button"
      >
        <span className={cx("min-w-0 truncate", !selectedOption && "text-muted")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={cx(
            "flex-none text-[0.7rem] text-mint transition-transform duration-150 ease-standard",
            isOpen && "rotate-180",
          )}
        >
          ▼
        </span>
      </button>

      <div
        className={cx(
          "absolute inset-x-0 top-[calc(100%+0.45rem)] z-20 origin-top overflow-hidden rounded-md border border-line bg-[rgb(7_18_15/0.95)] shadow-[0_12px_32px_rgb(0_0_0/0.45)] backdrop-blur-md transition-[opacity,transform,visibility] duration-150 ease-standard",
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-1 scale-99 opacity-0",
        )}
        inert={!isOpen}
        aria-hidden={!isOpen}
      >
        <ul
          aria-labelledby={labelId}
          className="m-0 max-h-[min(16rem,45vh)] list-none overflow-y-auto overscroll-contain py-[0.35rem]"
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                aria-selected={isSelected}
                className={cx(
                  "relative flex min-h-[2.65rem] cursor-pointer items-center justify-between gap-3 py-2.5 pr-3.5 pl-[calc(0.875rem+2px)] font-sans text-sm leading-[1.4] text-body transition-colors duration-120",
                  // Mint bar on the left edge of the highlighted option.
                  "before:absolute before:inset-y-[0.45rem] before:left-0 before:w-0.5 before:bg-mint before:opacity-0 before:transition-opacity before:duration-120",
                  "hover:bg-mint/12 hover:text-mint hover:before:opacity-100",
                  isActive && "bg-mint/12 text-mint before:opacity-100",
                )}
                id={`${listboxId}-option-${index}`}
                key={option.value}
                onClick={() => selectOption(index)}
                onPointerDown={handleOptionPointerDown}
                onPointerMove={(event) => {
                  if (event.pointerType === "mouse") setActiveIndex(index);
                }}
                role="option"
              >
                <span>{option.label}</span>
                <span aria-hidden="true" className="w-4 flex-none text-center font-bold text-mint">
                  {isSelected ? "✓" : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

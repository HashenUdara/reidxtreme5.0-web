"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import styles from "./CustomSelect.module.css";

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
    <div className={styles.root} ref={rootRef}>
      <input name={name} type="hidden" value={value} />
      <button
        aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-required={required}
        className={styles.trigger}
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
        <span className={selectedOption ? styles.value : styles.placeholder}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        className={`${styles.popup} ${isOpen ? styles.popupOpen : ""}`}
        inert={!isOpen}
        aria-hidden={!isOpen}
      >
        <ul
          aria-labelledby={labelId}
          className={styles.listbox}
          id={listboxId}
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                aria-selected={isSelected}
                className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
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
                <span aria-hidden="true" className={styles.checkmark}>
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

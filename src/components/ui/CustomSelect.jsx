/**
 * CustomSelect.jsx
 * Custom styled dropdown to replace native <select> elements.
 * Dark-theme-friendly, animated, mobile-optimized.
 * Uses React Portal so dropdown never gets clipped by parent overflow.
 */

import React from "react";
import ReactDOM from "react-dom";
import { LucideIcon } from "./index.js";

const CustomSelect = React.memo(({
  value,
  onChange,
  options = [],
  placeholder = "Pilih...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dropdownPos, setDropdownPos] = React.useState(null);
  const containerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Find selected option label
  const selectedOption = options.find((opt) =>
    typeof opt === "object" ? String(opt.value) === String(value) : String(opt) === String(value)
  );
  const selectedLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : null;

  // Calculate dropdown position when opening
  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    // Dropdown max height ~280px — if not enough space below, open upward
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    setDropdownPos({
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? viewportH - rect.top + 6 : undefined,
      left: rect.left,
      width: rect.width,
    });
  }, [isOpen]);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Also check if click is inside the portal dropdown
        const portal = document.getElementById("custom-select-portal");
        if (portal && portal.contains(e.target)) return;
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isOpen]);

  // Recalculate position on scroll/resize
  React.useEffect(() => {
    if (!isOpen) return;
    const reposition = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
      setDropdownPos({
        top: openUp ? undefined : rect.bottom + 6,
        bottom: openUp ? viewportH - rect.top + 6 : undefined,
        left: rect.left,
        width: rect.width,
      });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen]);

  // Focus search on open
  React.useEffect(() => {
    if (isOpen && searchRef.current && options.length > 6) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen, options.length]);

  // Scroll selected into view
  React.useEffect(() => {
    if (isOpen && listRef.current && value) {
      setTimeout(() => {
        const active = listRef.current?.querySelector("[data-active='true']");
        if (active) {
          active.scrollIntoView({ block: "nearest" });
        }
      }, 60);
    }
  }, [isOpen, value]);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: opt }
  );

  const filteredOptions = search
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : normalizedOptions;

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setIsOpen(false);
    setSearch("");
  };

  // Ensure portal root exists
  const getPortalRoot = () => {
    let el = document.getElementById("custom-select-portal");
    if (!el) {
      el = document.createElement("div");
      el.id = "custom-select-portal";
      document.body.appendChild(el);
    }
    return el;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          px-3.5 py-2.5 rounded-xl text-sm font-medium
          border-2 transition-all duration-200 text-left
          ${disabled
            ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-100"
            : isOpen
              ? "border-indigo-500 bg-gray-50 shadow-lg shadow-indigo-500/10"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        <span className={selectedLabel ? "text-gray-800 truncate" : "text-gray-400 truncate"}>
          {selectedLabel || placeholder}
        </span>
        <span
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <LucideIcon name="ChevronDown" size={16} className="text-gray-400" />
        </span>
      </button>

      {/* Dropdown Panel — rendered via Portal to escape overflow clipping */}
      {isOpen && dropdownPos && ReactDOM.createPortal(
        <div
          className="fixed bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden"
          style={{
            animation: "selectDropIn 0.15s ease-out",
            maxHeight: "280px",
            zIndex: 99999,
            top: dropdownPos.top != null ? `${dropdownPos.top}px` : undefined,
            bottom: dropdownPos.bottom != null ? `${dropdownPos.bottom}px` : undefined,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
        >
          {/* Search (only if > 6 options) */}
          {options.length > 6 && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                <LucideIcon name="Search" size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari..."
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none border-none p-0"
                  style={{ background: "transparent" }}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            ref={listRef}
            className="overflow-y-auto"
            style={{ maxHeight: options.length > 6 ? "220px" : "260px" }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                Tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    type="button"
                    data-active={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full text-left px-3.5 py-2.5 text-sm
                      flex items-center justify-between gap-2
                      transition-colors duration-100
                      ${isSelected
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <LucideIcon name="Check" size={14} className="text-indigo-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        getPortalRoot()
      )}
    </div>
  );
});

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

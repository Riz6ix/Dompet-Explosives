/**
 * LucideIcon.jsx
 * Wrapper component untuk render Lucide icons via CDN
 * Handles PascalCase → kebab-case conversion & icon name remapping
 */

import React from "react";

// Auto-Mapping for renamed icons in newer Lucide versions
const iconMapping = {
  tool: "wrench",
  pentool: "pen-tool",
  "check-circle-2": "circle-check-2",
  "x-circle": "circle-x",
  "alert-triangle": "triangle-alert",
  "alert-circle": "circle-alert",
  "check-circle": "circle-check",
  piechart: "pie-chart",
  shieldcheck: "shield-check",
  piggybank: "piggy-bank",
  trendingup: "trending-up",
  trendingdown: "trending-down",
  calendaroff: "calendar-off",
  filetext: "file-text",
};

// Helper: Ubah PascalCase ke kebab-case & Handle Lucide v0.400+ Changes
const formatIconName = (str) => {
  if (!str) return "";
  // Support full PascalCase to kebab-case (e.g. XCircle -> x-circle)
  let kebab = str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

  return iconMapping[kebab] || kebab;
};

const LucideIcon = ({ name, size = 20, className = "", color }) => {
  const iconRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.lucide) return;
    try {
      if (iconRef.current) {
        const kebabName = formatIconName(name);
        iconRef.current.innerHTML = `<i data-lucide="${kebabName}" style="width:${size}px; height:${size}px;"></i>`;
        window.lucide.createIcons({
          attrs: {
            class: className,
            stroke: color || "currentColor",
            "stroke-width": 2,
            width: size,
            height: size,
          },
          nameAttr: "data-lucide",
          root: iconRef.current,
        });
      }
    } catch (e) {
      /* Silent fail */
    }
  }, [name, size, className, color]);

  return (
    <span
      ref={iconRef}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
};

export default LucideIcon;

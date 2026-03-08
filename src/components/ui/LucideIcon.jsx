/**
 * LucideIcon.jsx
 * Optimized wrapper for Lucide icons via CDN
 * Uses icon cache to avoid re-creating icons on every render
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

// Helper: Ubah PascalCase ke kebab-case
const formatIconName = (str) => {
  if (!str) return "";
  let kebab = str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return iconMapping[kebab] || kebab;
};

// SVG cache — avoid re-creating the same icon SVG repeatedly
const svgCache = new Map();

const LucideIcon = React.memo(({ name, size = 20, className = "", color }) => {
  const iconRef = React.useRef(null);
  const prevKeyRef = React.useRef("");

  React.useEffect(() => {
    if (!window.lucide || !iconRef.current) return;

    const kebabName = formatIconName(name);
    const cacheKey = `${kebabName}-${size}-${color || "currentColor"}`;

    // Skip if same icon already rendered
    if (prevKeyRef.current === cacheKey) return;
    prevKeyRef.current = cacheKey;

    try {
      // Check cache first
      const cached = svgCache.get(cacheKey);
      if (cached) {
        iconRef.current.innerHTML = cached;
        return;
      }

      // Create new icon
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

      // Cache the result
      if (iconRef.current.innerHTML && !iconRef.current.innerHTML.includes("data-lucide")) {
        svgCache.set(cacheKey, iconRef.current.innerHTML);
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
});

LucideIcon.displayName = "LucideIcon";

export default LucideIcon;

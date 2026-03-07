/**
 * IconDisplay.jsx
 * Wrapper simpel untuk mapping type-name → Lucide icon
 * Contoh: <IconDisplay type="warning" /> → <LucideIcon name="AlertTriangle" />
 */

import React from "react";
import LucideIcon from "./LucideIcon.jsx";

const iconMap = {
  warning: "AlertTriangle",
  danger: "AlertCircle",
  info: "Info",
  bell: "Bell",
  success: "CheckCircle2",
  check: "Check",
  error: "XCircle",
  x: "X",
  clock: "Clock",
  party: "PartyPopper",
  sparkles: "Sparkles",
  up: "TrendingUp",
  down: "TrendingDown",
};

const IconDisplay = ({ type, size = 20, className = "" }) => {
  const iconName = iconMap[type] || "Circle";
  return <LucideIcon name={iconName} size={size} className={className} />;
};

export default IconDisplay;
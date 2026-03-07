/**
 * AnimatedNumberWithTrend.jsx
 * AnimatedNumber + indikator trend (naik/turun) + sparkle effect
 */

import React from "react";
import AnimatedNumber from "./AnimatedNumber.jsx";

const AnimatedNumberWithTrend = ({
  value,
  prefix = "Rp ",
  showTrend = false,
}) => {
  const [trend, setTrend] = React.useState(null);
  const [showSparkle, setShowSparkle] = React.useState(false);
  const prevValueRef = React.useRef(value);
  const hasInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevValueRef.current = value;
      return;
    }
    const prevNum =
      typeof prevValueRef.current === "number" ? prevValueRef.current : 0;
    const newNum = typeof value === "number" ? value : 0;

    if (Math.abs(newNum - prevNum) < 1) return;

    if (newNum > prevNum) {
      setTrend("up");
      setShowSparkle(true);
    } else if (newNum < prevNum) {
      setTrend("down");
      setShowSparkle(true);
    }
    setTimeout(() => setShowSparkle(false), 800);
    setTimeout(() => setTrend(null), 1200);
    prevValueRef.current = newNum;
  }, [value]);

  return (
    <span className="inline-flex items-center gap-1.5 relative">
      <AnimatedNumber
        value={value}
        prefix={prefix}
      />
      {showTrend && trend === "up" && (
        <span className="text-emerald-500 text-xs font-bold animate-slide-up">
          ↗
        </span>
      )}
      {showTrend && trend === "down" && (
        <span className="text-rose-500 text-xs font-bold animate-slide-down">
          ↘
        </span>
      )}
      {showSparkle && trend === "up" && (
        <span className="absolute -top-2 -right-2 text-yellow-400 text-xs animate-sparkle">
          ✨
        </span>
      )}
      {showSparkle && trend === "down" && (
        <span className="absolute -bottom-2 -right-2 text-blue-400 text-xs animate-fade-out">
          💧
        </span>
      )}
    </span>
  );
};

export default AnimatedNumberWithTrend;
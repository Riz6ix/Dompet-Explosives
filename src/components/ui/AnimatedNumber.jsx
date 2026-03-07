/**
 * AnimatedNumber.jsx
 * Komponen angka yang beranimasi saat nilainya berubah
 * Pakai requestAnimationFrame untuk smooth counting
 */

import React from "react";

const AnimatedNumber = ({ value, prefix = "Rp ", id = "num" }) => {
  const [display, setDisplay] = React.useState(value);
  const frameRef = React.useRef();
  const animStateRef = React.useRef({ initialized: false, lastValue: 0 });

  React.useEffect(() => {
    const state = animStateRef.current;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    // First time animation (count up from 0)
    if (!state.initialized) {
      state.initialized = true;
      state.lastValue = value;
      if (value === 0) {
        setDisplay(0);
        return () => {
          if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
      }

      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / 800, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(value * ease));
        if (progress < 1)
          frameRef.current = requestAnimationFrame(animate);
        else setDisplay(value);
      };
      frameRef.current = requestAnimationFrame(animate);
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }

    // Subsequent changes (animate from old → new)
    const oldVal = state.lastValue;
    const newVal = value;
    if (oldVal === newVal) {
      setDisplay(value);
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }

    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 600, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = oldVal + (newVal - oldVal) * ease;
      setDisplay(Math.floor(current));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(newVal);
        state.lastValue = newVal;
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, id]);

  return (
    <span>
      {prefix}
      {(display ?? 0).toLocaleString("id-ID")}
    </span>
  );
};

export default AnimatedNumber;

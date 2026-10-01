"use client";

import { motion } from "framer-motion";

const easeDraw = [0.65, 0, 0.35, 1] as const;

const traceVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, delay: 0.15 + i * 0.12, ease: easeDraw },
      opacity: { duration: 0.15, delay: 0.15 + i * 0.12 },
    },
  }),
};

const traces = [
  "M40,20 L40,60 L85,60",
  "M160,20 L160,60 L115,60",
  "M40,100 L40,60",
  "M160,100 L160,60",
  "M20,60 L40,60",
  "M180,60 L160,60",
];

const nodes = [
  [40, 20],
  [160, 20],
  [40, 100],
  [160, 100],
  [20, 60],
  [180, 60],
];

export default function CircuitDiagram() {
  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full max-w-xs mx-auto"
      fill="none"
      stroke="var(--ink-muted)"
      strokeWidth={1}
    >
      {traces.map((d, i) => (
        <motion.path key={d} d={d} custom={i} variants={traceVariants} initial="hidden" animate="visible" />
      ))}
      {nodes.map(([cx, cy], i) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={2.5}
          fill="var(--ink-muted)"
          stroke="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.12 + 0.55, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <motion.rect
        x={85}
        y={50}
        width={30}
        height={20}
        rx={3}
        stroke="var(--accent)"
        strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
          strokeOpacity: [1, 1, 0.55, 1],
        }}
        transition={{
          opacity: { delay: 1.15, duration: 0.25 },
          scale: { delay: 1.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
          strokeOpacity: { delay: 1.15, duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.55, 0.8, 1] },
        }}
        style={{ transformOrigin: "100px 60px" }}
      />
      <motion.text
        x={100}
        y={63}
        textAnchor="middle"
        fontSize={9}
        className="mono"
        fill="var(--accent)"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }}
      >
        ML
      </motion.text>
    </svg>
  );
}

"use client";

import { useRef, memo, useMemo } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const pointRadiusFrom = 3;
const pointRadiusTo = 8;

const boundary = {
  lat: { min: 48.2882457, max: 48.5149964 },
  lng: { min: -89.4275717, max: -89.11647362649379 },
};

const height = 800;
const width = 728;

const WorldMap = memo(function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = useMemo(() => new DottedMap({
    width: 100, grid: "diagonal", countries: ['TB1', 'TB2', 'TB3', 'TB4']
  }), []);

  // Used for testing if projectPoint is working correctly
  // dots.forEach((dot) => {
  //   map.addPin({
  //     lat: dot.start.lat,
  //     lng: dot.start.lng,
  //     svgOptions: { color: 'red', radius: 1 },
  //   });
  //   map.addPin({
  //     lat: dot.end.lat,
  //     lng: dot.end.lng,
  //     svgOptions: { color: 'red', radius: 1 },
  //   });
  // });

  const { theme } = useTheme();

  const svgMap = useMemo(() => map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  }), [map, theme]);

  const projectPoint = useMemo(() => (lat: number, lng: number) => {
    const x = (lng - boundary.lng.min) / (boundary.lng.max - boundary.lng.min) * width;
    const y = (boundary.lat.max - lat) / (boundary.lat.max - boundary.lat.min) * height;
    return { x, y };
  }, []);

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none select-none w-full h-full"
        alt="world map"
        height={height}
        width={width}
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  // 如需使用点对点连贯动画，取消下面的注释
                  delay: dots.length + i,
                  repeatDelay: dots.length,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r={pointRadiusFrom}
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r={pointRadiusFrom}
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from={pointRadiusFrom}
                  to={pointRadiusTo}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r={pointRadiusFrom}
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r={pointRadiusFrom}
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from={pointRadiusFrom}
                  to={pointRadiusTo}
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
});

export default WorldMap;
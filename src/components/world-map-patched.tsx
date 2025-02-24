"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import DottedMap from "@/lib/dotted-map-patched/with-countries";
import { Card, CardHeader } from "./ui/card";
import { dataSizeLimitForOrders } from "@/extensions/request";
import { Fullscreen, Info, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const WorldMap = function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const { resolvedTheme } = useTheme();

  const [pointRadiusFrom, setPointRadiusFrom] = useState(3);
  const [pointRadiusTo, setPointRadiusTo] = useState(8);
  const [lineWidth, setLineWidth] = useState(1);

  const [fitMode, setFitMode] = useState(false);

  useEffect(() => {
    if (fitMode) {
      setPointRadiusFrom(5);
      setPointRadiusTo(10);
      setLineWidth(3);
    } else {
      setPointRadiusFrom(3);
      setPointRadiusTo(8);
      setLineWidth(1);
    }
  }, [fitMode]);

  lineColor = resolvedTheme === "dark" ? "oklch(0.541 0.281 293.009)" : "oklch(0.432 0.232 292.759)";

  const boundary = {
    lat: { min: 48.2882457, max: 48.5149964 },
    lng: { min: -89.4275717, max: -89.11647362649379 },
  };

  const offset = 0.005;

  if (fitMode && dots.length !== 0) {
    boundary.lat.min = Math.min(...dots.map((dot) => Math.min(dot.start.lat, dot.end.lat))) - offset;
    boundary.lat.max = Math.max(...dots.map((dot) => Math.max(dot.start.lat, dot.end.lat))) + offset;
    boundary.lng.min = Math.min(...dots.map((dot) => Math.min(dot.start.lng, dot.end.lng))) - offset;
    boundary.lng.max = Math.max(...dots.map((dot) => Math.max(dot.start.lng, dot.end.lng))) + offset;
  }

  const height = 800;
  const width = 728;

  const svgRef = useRef<SVGSVGElement>(null);
  const map = DottedMap({
    width: 100,
    grid: "diagonal",
    countries: ["TB1", "TB2", "TB3", "TB4"],
    region: boundary,
  });

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


  const svgMap = map.getSVG({
    radius: 0.22,
    color: resolvedTheme === "dark" ? "oklch(0.371 0 0)" : "oklch(0.87 0 0)",
    shape: "circle",
    backgroundColor: resolvedTheme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x =
      ((lng - boundary.lng.min) / (boundary.lng.max - boundary.lng.min)) *
      width;
    const y =
      ((boundary.lat.max - lat) / (boundary.lat.max - boundary.lat.min)) *
      height;
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
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
          const distance = Math.sqrt(
            Math.pow(startPoint.x - endPoint.x, 2) +
            Math.pow(startPoint.y - endPoint.y, 2),
          );
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth={lineWidth}
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
              >
              </motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={resolvedTheme === "dark" ? "black" : "white"} stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={resolvedTheme === "dark" ? "black" : "white"} stopOpacity="0" />
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
      {dots.length === 0 && (
        <Card className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <CardHeader className="flex flex-row gap-2">
            <Info />
            No trading data available in the last {dataSizeLimitForOrders} hours
          </CardHeader>
        </Card>
      )}
      {dots.length !== 0 && <div className="absolute bottom-0 right-0 flex flex-row gap-2">
        <Button variant="outline" onClick={() => setFitMode(!fitMode)}>
          <Fullscreen /> {fitMode ? "Fit to city" : "Fit to points"}
        </Button>
      </div>}
    </div>
  );
};

export default WorldMap;

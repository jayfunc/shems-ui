"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import DottedMap from "@/lib/dotted-map-patched/with-countries";
import { dataSizeLimitForOrders } from "@/extensions/request";
import { ArrowLeftRight, Fullscreen, LoaderCircle, Unlink } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Image as ImageJS } from 'image-js';

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const WorldMap = function WorldMap({
  dots = [],
}: MapProps) {
  const originalBoundary = {
    lat: { min: 48.2882457, max: 48.5149964 },
    lng: { min: -89.4275717, max: -89.11647362649379 },
  };

  const { resolvedTheme } = useTheme();

  const [pointRadiusFrom, setPointRadiusFrom] = useState(3);
  const [pointRadiusTo, setPointRadiusTo] = useState(8);
  const [lineWidth, setLineWidth] = useState(2);
  const [labelSize, setLabelSize] = useState(20);

  const [fitMode, setFitMode] = useState(false);
  const [dottedMapMode, setMapMode] = useState(false);

  const [boundary, setBoundary] = useState(originalBoundary);

  const [croppedImageAsBase64, setCroppedImageAsBase64] = useState<string | undefined>(undefined);

  const mapFileName = "/tb.png";

  useEffect(() => {
    ImageJS.load(mapFileName).then(async (image) => {
      setCroppedImageAsBase64(await image.toBase64());
    });
  }, []);

  useEffect(() => {
    if (fitMode) {
      setPointRadiusFrom(6);
      setPointRadiusTo(14);
      setLineWidth(4);
      setLabelSize(30);

      const latMin = Math.min(...dots.map((dot) => Math.min(dot.start.lat, dot.end.lat))) - offset;
      const latMax = Math.max(...dots.map((dot) => Math.max(dot.start.lat, dot.end.lat))) + offset;
      const lngMin = Math.min(...dots.map((dot) => Math.min(dot.start.lng, dot.end.lng))) - offset;
      const lngMax = Math.max(...dots.map((dot) => Math.max(dot.start.lng, dot.end.lng))) + offset;

      const latDiff = latMax - latMin;
      const lngDiff = lngMax - lngMin;

      const ratio = (originalBoundary.lat.max - originalBoundary.lat.min) / (originalBoundary.lng.max - originalBoundary.lng.min);

      if (latDiff / lngDiff > ratio) {
        const offset = (latDiff / ratio - lngDiff) / 2;
        setBoundary({
          lat: {
            min: latMin,
            max: latMax,
          },
          lng: {
            min: lngMin - offset,
            max: lngMax + offset,
          },
        });
      } else {
        const offset = (lngDiff * ratio - latDiff) / 2;
        setBoundary({
          lat: {
            min: latMin - offset,
            max: latMax + offset,
          },
          lng: {
            min: lngMin,
            max: lngMax,
          },
        });
      }

    } else {
      setPointRadiusFrom(3);
      setPointRadiusTo(8);
      setLineWidth(2);
      setLabelSize(20);

      setBoundary(originalBoundary);
    }
  }, [fitMode]);

  useEffect(() => {
    const latDiff = originalBoundary.lat.max - originalBoundary.lat.min;
    const lngDiff = originalBoundary.lng.max - originalBoundary.lng.min;

    const latDiffNew = boundary.lat.max - boundary.lat.min;
    const lngDiffNew = boundary.lng.max - boundary.lng.min;

    ImageJS.load(mapFileName).then(async (image) => {
      setCroppedImageAsBase64(await image.crop({
        x: (boundary.lng.min - originalBoundary.lng.min) / lngDiff * image.width,
        y: (originalBoundary.lat.max - boundary.lat.max) / latDiff * image.height,
        width: (lngDiffNew / lngDiff) * image.width,
        height: (latDiffNew / latDiff) * image.height,
      }).toBase64());
    });

  }, [boundary])

  const offset = 0.005;

  const dotColor = resolvedTheme === "dark" ? "white" : "black";

  const labelColor = resolvedTheme === "dark" ? "white" : "black";

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
    return `M ${start.x} ${start.y} ${end.x} ${end.y}`;
    // return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="w-full h-full dark:bg-black bg-white rounded-lg relative">
        {dottedMapMode && <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="pointer-events-none select-none w-full h-full"
          alt="dotted map"
          height={height}
          width={width}
          draggable={false}
        />}
        {!dottedMapMode && <Image
          src={`data:image/png;base64,${encodeURIComponent(croppedImageAsBase64 ?? "")}`}
          alt="normal map"
          className="pointer-events-none select-none w-full h-full rounded-lg"
          height={height}
          width={width}
          draggable={false}
        />}
        {!dottedMapMode && resolvedTheme === "dark" && <div
          className="absolute left-0 top-0 right-0 bottom-0 pointer-events-none select-none w-full h-full rounded-lg bg-black opacity-50"
        />}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full absolute inset-0"
        >
          {dots.map((dot, i) => {
            const startPoint = projectPoint(dot.start.lat, dot.start.lng);
            const endPoint = projectPoint(dot.end.lat, dot.end.lng);
            const distance = Math.sqrt(
              Math.pow(startPoint.x - endPoint.x, 2) +
              Math.pow(startPoint.y - endPoint.y, 2),
            );
            let color = "";
            if (dot.start.label?.startsWith("Seller: Me")) {
              color = "hsl(var(--power-sell))";
            } else if (dot.end.label?.startsWith("Buyer: Me")) {
              color = "hsl(var(--power-buy))";
            }
            return (
              <g key={`path-group-${i}`}>
                <motion.path
                  d={createCurvedPath(startPoint, endPoint)}
                  stroke={color}
                  strokeWidth={lineWidth}
                  strokeDasharray={2}
                  initial={{
                    pathLength: 0,
                    pathOffset: 0,
                    opacity: 0,
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    pathLength: [0, 0.5, 1],
                    pathOffset: [0, 0.5, 1],
                    keyTimes: [0, 0.5, 1],
                  }}
                  transition={{
                    duration: distance / 50,
                    ease: "linear",
                    // 如需使用点对点连贯动画，取消下面的注释
                    // delay: dots.length + i,
                    // repeatDelay: dots.length,
                    // duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  key={`start-upper-${i}`}
                >
                </motion.path>
              </g>
            );
          })}

          {dots.map((dot, i) => (
            <g key={`points-group-${i}`}>
              <g key={`start-${i}`}>
                <circle
                  cx={projectPoint(dot.start.lat, dot.start.lng).x}
                  cy={projectPoint(dot.start.lat, dot.start.lng).y}
                  r={pointRadiusFrom}
                  fill={dotColor}
                />
                <circle
                  cx={projectPoint(dot.start.lat, dot.start.lng).x}
                  cy={projectPoint(dot.start.lat, dot.start.lng).y}
                  r={pointRadiusFrom}
                  fill={dotColor}
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
                <circle
                  cx={projectPoint(dot.start.lat, dot.start.lng).x}
                  cy={projectPoint(dot.start.lat, dot.start.lng).y}
                  r={30}
                  opacity="0"
                  onMouseEnter={() => {
                    document.getElementById(`text-start-${i}`)?.classList.remove('hidden');
                  }}
                  onMouseLeave={() => {
                    document.getElementById(`text-start-${i}`)?.classList.add('hidden');
                  }}
                />
                <svg
                  id={`text-start-${i}`}
                  x={projectPoint(dot.start.lat, dot.start.lng).x + (fitMode ? 20 : 10)}
                  y={projectPoint(dot.start.lat, dot.start.lng).y}
                  className="hidden text-wrap w-10"
                  fontSize={labelSize}
                  fontFamily="math"
                >
                  {dot.start.label?.split("\n").map((line, j) => (
                    <text key={`text-end-${i}-${j}`} dy={(1 + j) * labelSize} fill={labelColor}> {line} </text>
                  ))}
                </svg>
              </g>
              <g key={`end-${i}`}>
                <circle
                  cx={projectPoint(dot.end.lat, dot.end.lng).x}
                  cy={projectPoint(dot.end.lat, dot.end.lng).y}
                  r={pointRadiusFrom}
                  fill={dotColor}
                />
                <circle
                  cx={projectPoint(dot.end.lat, dot.end.lng).x}
                  cy={projectPoint(dot.end.lat, dot.end.lng).y}
                  r={pointRadiusFrom}
                  fill={dotColor}
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
                <circle
                  cx={projectPoint(dot.end.lat, dot.end.lng).x}
                  cy={projectPoint(dot.end.lat, dot.end.lng).y}
                  r={30}
                  opacity="0"
                  onMouseEnter={() => {
                    document.getElementById(`text-end-${i}`)?.classList.remove('hidden');
                  }}
                  onMouseLeave={() => {
                    document.getElementById(`text-end-${i}`)?.classList.add('hidden');
                  }}
                />
                <svg
                  id={`text-end-${i}`}
                  x={projectPoint(dot.end.lat, dot.end.lng).x + (fitMode ? 20 : 10)}
                  y={projectPoint(dot.end.lat, dot.end.lng).y}
                  fontSize={labelSize}
                  className="hidden text-wrap w-10"
                  fontFamily="math"
                >
                  {dot.end.label?.split("\n").map((line, j) => (
                    <text key={`text-end-${i}-${j}`} dy={(1 + j) * labelSize} fill={labelColor}> {line} </text>
                  ))}
                </svg>
              </g>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[hsl(var(--power-buy))]" />
            <Label className="text-muted-foreground">Buy order</Label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[hsl(var(--power-sell))]" />
            <Label className="text-muted-foreground">Sell order</Label>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col md:flex-row gap-2 items-end">
          <Button variant="outline" onClick={() => setFitMode(!fitMode)}>
            <Fullscreen /> {fitMode ? "Fit to city" : "Fit to points"}
          </Button>
          <Button variant="outline" onClick={() => setMapMode(!dottedMapMode)}>
            <ArrowLeftRight /> {dottedMapMode ? "Switch to normal map" : "Switch to dotted map"}
          </Button>
        </div>
      </div>
      {dots.length === 0 && (
        <div className="absolute backdrop-blur-sm -top-1 -left-1 -right-1 -bottom-1 flex flex-col gap-2 items-center justify-center text-center text-muted-foreground">
          <Unlink />
          <Label>No matched order available in the past {dataSizeLimitForOrders} hours</Label>
        </div>
      )}
      {dots.length !== 0 && croppedImageAsBase64 === undefined && (
        <div className="absolute backdrop-blur-sm -top-1 -left-1 -right-1 -bottom-1 flex flex-col gap-2 items-center justify-center text-center text-muted-foreground">
          <LoaderCircle className="animate-spin" />
          <Label>Loading map</Label>
        </div>
      )}
    </div>
  );
};

export default WorldMap;

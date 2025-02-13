import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";
import React, { JSX, useEffect } from "react";

// Array of colors to be animated
const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AuroraGradient = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children }, ref) => {
  // Initialize motion value with the first color
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    // Animate the color changes in a loop
    animate(color, COLORS_TOP, {
      ease: "easeInOut", // Easing function for smooth transitions
      duration: 10, // Duration for the entire color transition cycle
      repeat: Infinity, // Repeat the animation infinitely
      repeatType: "mirror", // Reverses the animation direction on each cycle
    });
  }, [color]);

  // Use motion template to create a dynamic background gradient
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section ref={ref} className={className} style={{ backgroundImage }}>
      {children}
    </motion.section>
  );
});

AuroraGradient.displayName = "AuroraGradient";

export default AuroraGradient;

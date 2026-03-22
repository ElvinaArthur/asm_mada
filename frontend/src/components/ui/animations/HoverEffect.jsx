import React from "react";
import { motion } from "framer-motion";

const HoverEffect = ({
  children,
  scale = 1.05,
  rotate = 0,
  y = -5,
  transition = { duration: 0.2 },
  className = "",
  ...props
}) => {
  return (
    <motion.div
      whileHover={{
        scale,
        rotate,
        y,
        transition: {
          duration: transition.duration,
          ease: "easeOut",
        },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default HoverEffect;

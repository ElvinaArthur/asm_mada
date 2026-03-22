import React from "react";
import { motion } from "framer-motion";

const ShineEffect = ({
  children,
  width = "100%",
  height = "100%",
  duration = 1.5,
  className = "",
  ...props
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {children}
      <motion.div
        className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "400%" }}
        transition={{
          duration,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ShineEffect;

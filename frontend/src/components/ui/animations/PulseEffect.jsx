import React from "react";
import { motion } from "framer-motion";

const PulseEffect = ({
  children,
  scale = [1, 1.05, 1],
  duration = 2,
  repeatType = "loop",
  className = "",
  ...props
}) => {
  return (
    <motion.div
      animate={{ scale }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PulseEffect;

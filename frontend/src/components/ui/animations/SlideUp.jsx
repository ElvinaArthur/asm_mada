import React from "react";
import { motion } from "framer-motion";

const SlideUp = ({
  children,
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideUp;

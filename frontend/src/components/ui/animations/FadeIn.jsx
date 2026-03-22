import React from "react";
import { motion } from "framer-motion";

const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  y = 0,
  once = true,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

import React from "react";
import { motion } from "framer-motion";

const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.5,
  scale = 0.8,
  once = true,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
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

export default ScaleIn;

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxEffect = ({
  children,
  offset = 50,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className} {...props}>
      {children}
    </motion.div>
  );
};

export default ParallaxEffect;

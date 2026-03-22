import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MorphingText = ({
  texts = [],
  interval = 3000,
  className = "",
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [texts.length, interval]);

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{texts[0]}</span>
    </div>
  );
};

export default MorphingText;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TypewriterEffect = ({
  text,
  speed = 50,
  delay = 0,
  className = "",
  cursor = true,
  cursorBlinkSpeed = 0.5,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <div className={`inline-flex items-center ${className}`} {...props}>
      <span>{displayedText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: cursorBlinkSpeed, repeat: Infinity }}
          className="ml-1"
        >
          ▋
        </motion.span>
      )}
    </div>
  );
};

export default TypewriterEffect;

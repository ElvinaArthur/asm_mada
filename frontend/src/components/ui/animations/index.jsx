import React from "react";
import { motion } from "framer-motion";

// Animation de fade-in
export const FadeIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Animation de slide-up
export const SlideUp = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Animation d'effet machine à écrire
export const TypewriterEffect = ({
  text,
  speed = 50,
  className = "",
  cursor = true,
}) => {
  const [displayedText, setDisplayedText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      {displayedText}
      {cursor && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </div>
  );
};

// Animation de stagger pour les enfants
export const StaggerChildren = ({ children, staggerDelay = 0.2 }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      visible: { transition: { staggerChildren: staggerDelay } },
      hidden: {},
    }}
  >
    {children}
  </motion.div>
);

// Animation de hover effect
export const HoverEffect = ({ children }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    {children}
  </motion.div>
);

// Animation d'effet parallaxe
export const ParallaxEffect = ({ children, yOffset = 50 }) => (
  <motion.div
    initial={{ y: yOffset, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.div>
);

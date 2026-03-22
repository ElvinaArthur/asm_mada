import React, { useState } from "react";
import { motion } from "framer-motion";

const FlipCard = ({
  front,
  back,
  className = "",
  flipOnHover = true,
  ...props
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onMouseEnter={flipOnHover ? () => setIsFlipped(true) : undefined}
      onMouseLeave={flipOnHover ? () => setIsFlipped(false) : undefined}
      onClick={!flipOnHover ? handleFlip : undefined}
      {...props}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;

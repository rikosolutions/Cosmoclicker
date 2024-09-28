import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";
import "../assets/css/Tap.css";
import glare from "../assets/glare.png";
import bg from "../assets/svg/home-bg.svg";

const notCoinAppearence = {
  initial: { opacity: 0, scale: 0, y: 1000 },
  animate: { opacity: 1, scale: [0, 1], y: 0 },
  exit: { opacity: 0, scale: 0 },
  transition: {
    duration: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  },
};

const Astronaut = ({ children }) => {
  const [numbers, setNumbers] = useState([]); // Manage numbers with useState
  const buttonTransformRef = useRef({ scale: 1 });

  const clickValue = 1;

  const addNumber = (newNumber) => {
    setNumbers((prevNumbers) => [...prevNumbers, newNumber]); // Update state
  };

  const handleAnimationEnd = (id) => {
    setNumbers((prevNumbers) =>
      prevNumbers.filter((number) => number.id !== id)
    );
  };

  const updateButtonTransform = (newTransform) => {
    buttonTransformRef.current = {
      ...buttonTransformRef.current,
      ...newTransform,
    };
  };

  const getRandomXPosition = () => Math.random() * window.innerWidth;
  const handleTouchStart = (event) => {
    const touchCount = event.touches.length;

    if (touchCount > 0) {
      for (let i = 0; i < touchCount; i++) {
        const touch = event.touches[i];
        const touchX = event.touches[0].clientX; // Get X position of the touch
        const touchY = event.touches[0].clientY; // Get Y position of the touch
        updateButtonTransform({});

        const uniqueId = `${Date.now()}-${Math.random()}-${i}`;

        const x = getRandomXPosition(); // Get random x
        const y = window.innerHeight - 500; // Start from the bottom of the screen
        const newNumber = {
          id: uniqueId,
          value: clickValue,
          startX: touchX, // Use touch X position
          startY: touchY, // Use touch Y position
        };
        updateButtonTransform({ scale: 1 });
        addNumber(newNumber); // Add number immediately
      }
    }
  };

  const handleTouchEnd = () => {
    updateButtonTransform({ scale: 1 });
  };

  const targetPoint = { x: window.innerWidth / 2, y: -500 };

  return (
    <div className="relative w-full h-full z-10">
      <img
        src={bg}
        alt=""
        className="absolute top-0 z-0 w-full h-full object-cover"
      />{" "}
      {/* Added full container styling */}
      <AnimatePresence>
        <motion.div
          className="root w-full h-full flex items-center justify-center"
          key="1"
          {...notCoinAppearence}
        >
          <div className={cn("container")}>
            {children}
            <div
              className={cn("notcoin")}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `scale(${buttonTransformRef.current.scale})`,
              }}
            ></div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Animate the numbers */}
      <AnimatePresence>
        {numbers.map((number) => (
          <motion.div
            key={number.id}
            className="absolute text-5xl font-bold opacity-0  bg-blend-color-dodge mix-blend-color-dodge"
            initial={{ opacity: 1, x: number.startX - 38, y: number.startY -450 }} // Start at bottom
            animate={{
              opacity: 0,
              x: [number.startX, number.startX, targetPoint.x, targetPoint.x], // Converge horizontally to center
              y: -1000, // First go 70% up, then converge to the top
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              times: [0, 1], // Timing the 70% stop and the top converge
            }}
            onAnimationComplete={() => handleAnimationEnd(number.id)} // Remove number after animation
          >
            <img src={glare} alt="" className="mix-blend-color-dodge" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Astronaut;

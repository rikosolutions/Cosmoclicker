import React, { useState } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import nft from "../../assets/robot.png";

function Minerpopup({ open,data, setOpen, children,onClaim }) {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen((preSate) => {
      return {
        ...preSate,
        isopen: false,
      };
    });
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/35 flex backdrop-blur-sm items-center justify-center"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              ease: "easeInOut",
            }}
            className="h-1/3 w-[80%] overflow-hidden  bg-[#0b0b0b] top-1/2 -translate-y-1/2 "
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
          >
            <div
              className={`w-full h-full p-[3px] relative  ${"bg-gradient-to-tr from-[#B80EDE] to-[#FFB400]"}`}>
              <div
                className={`w-full  h-full  relative  bg-gradient-to-tr from-[#34033F] to-[#573E01]`}
              >
                <div className="flex flex-col items-center justify-center w-full h-full px-4">
                <h1 className="text-white/60 text-base text-center my-2">
                  You've earned  
                </h1>
                  <h1 className="text-3xl font-bold text-white flex items-center justify-center "> {data && data.mineAmount && data.mineAmount!='' ? data.mineAmount : 0}</h1>
                 
                </div>
      
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex flex-col gap-1 items-center justify-center">
                  <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px]  w-[90%] ">
                    <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]" 
                     onClick={() => {
                      if (onClaim) onClaim();
                    }}
                    >
                      Thanks
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default Minerpopup;

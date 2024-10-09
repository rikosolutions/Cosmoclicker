import React, { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import defultNft from "../../assets/robot.png";

function MinerBuyDrawer({
  open,
  data,
  setOpen,
  children,
  nft = "",
  onBuy,
  onCancel,
}) {
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

    setOpen((prevState) => ({
      ...prevState,
      isopen: false,
    }));
    onCancel()
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
            className="h-1/2 w-[80%] overflow-hidden bg-[#0b0b0b] top-1/2 -translate-y-1/2"
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
              className={`w-full h-full p-[3px] relative bg-gradient-to-tr from-[#B80EDE] to-[#FFB400]`}
            >
              <div className="w-full h-full relative bg-gradient-to-tr from-[#34033F] to-[#573E01]">
                <img
                  src={nft && nft !== "" ? nft : defultNft}
                  className="w-full h-full object-cover"
                  alt="NFT"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex flex-col gap-1 items-center justify-center">
                  <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px] w-[90%]">
                    <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
                      {data && data.profit_per_hr ? data.profit_per_hr : "0"} Ph
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center w-[90%] gap-1">
                    <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px] w-[90%]">
                      <a
                        className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]"
                        onClick={() => {
                          if (onCancel) onCancel();
                        }}
                      >
                        Cancel
                      </a>
                    </div>
                    <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px] w-[90%]">
                      <a
                        className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]"
                        onClick={() => {
                          if (onBuy) onBuy(data); // Pass the data to onBuy
                        }}
                      >
                        Claim For{" "}
                        {data && data.purchase_amount
                          ? data.purchase_amount
                          : "0"}
                      </a>
                    </div>
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

export default MinerBuyDrawer;

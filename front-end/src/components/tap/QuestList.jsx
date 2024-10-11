import React, { useRef, useState, useEffect } from "react";

import { motion } from "framer-motion";
function QuestList({ title, reward, isCompleted, icon,onClaim, isVerify,isUnlocked,onCheck}) {

    const handleClaim = () => {
        onClaim();
    };

    const handleCheck = () => {
        onCheck();
    };

    return (
      <div  className={`card w-full border-[1px] border-[#3C3B41] flex items-center justify-between p-3 gap-2 
        ${isCompleted ? 'opacity-40' : 'opacity-100'} transition-opacity duration-300`} onClick={!isVerify && isUnlocked ? handleCheck : null}>
        <div className="lhs flex flex-row items-center justify-start gap-2">
          <div className="profile flex items-center h-full">
            <div className="logo bg-gradient-to-b from-[#FFB400] to-[#B80DDF] w-12 h-12 p-[3px]">
              <div className="w-full h-full bg-[#0A090F] flex items-center justify-center">
                {" "}
                <img src={icon} alt="" className="w-full h-full " />
              </div>
            </div>
          </div>
          <div className="titlenreward flex flex-col items-start justify-between h-full">
            <h1 className="text-[#898989] text-sm font-light">{title}</h1>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB400] to-[#B80DDF] text-base font-medium">
              +{reward}
            </h1>
          </div>
        </div>
        {!isCompleted && isVerify ? (
          <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px]">
             <motion.a 
                    whileTap={{ background: "#ffffff0a" }}
                    className="text-sm font-semibold text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]"
                    onClick={handleClaim}
                >
                    Claim
                </motion.a>
          </div>
        ) : null}
      </div>
    );
  }


  export default QuestList;
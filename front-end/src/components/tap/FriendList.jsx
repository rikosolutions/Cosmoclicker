import React, { useRef, useState, useEffect } from "react";
import {getName,extractFirstTwoLetters} from "../../utlis/helperfunction";
import { motion } from "framer-motion";

function FriendList({ firstName = "N/A",lastName='', isPremium ,claimScore, isClaimed, onClaim }) {
    const handleClaim = () => {
        onClaim();
    };
    return (
        <div className="card w-full border-[1px] border-[#3C3B41] flex items-center justify-between p-3 gap-2">
            <div className="flex items-center gap-2">
                <div className="logo bg-gradient-to-b from-[#FFB400] to-[#B80DDF] w-12 h-12 p-[3px]">
                    <div className="w-full h-full bg-[#0A090F] flex items-center justify-center">
                        <h1 className="text-white text-xl font-bold">{extractFirstTwoLetters(firstName)}</h1>
                    </div>
                </div>
                <div className="namenreward flex flex-col items-start justify-between h-full">
                    <h1 className="text-white text-base font-medium">{firstName} {" "} {lastName}</h1>
                    <h1 className="text-[#FFB400] text-base font-medium">{claimScore}</h1>
                </div>
            </div>
            {isClaimed && (
                <motion.a 
                    whileTap={{ background: "#ffffff0a" }}
                    className="bg-[#ffffff]/10 text-white px-3 py-2 rounded-full text-base font-helvetica font-semibold ml-auto"
                    onClick={handleClaim}
                >
                    Claim
                </motion.a>
            )}
        </div>
    );
}

export default FriendList;
import React, { useRef, useState, useEffect } from "react";

function EarnCard({ isClaimable, price, isPurchased=false, nft, PPH,onBuy }) {
  const handleClaim = ()=>{
    onBuy()
  }
    return (
      <div
        className={`w-full max-h-[215px] p-[3px] relative  ${
          isClaimable || isPurchased
            ? "bg-gradient-to-tr from-[#B80EDE] to-[#FFB400]"
            : "bg-[#3C3B41] "
        }`}
        onClick={() =>
          isClaimable && !isPurchased ? handleClaim() : null
        }
      >
        <div
          className={`w-full h-52 pt-4 relative  ${
            isClaimable
              ? "bg-gradient-to-tr from-[#34033F] to-[#573E01]"
              : "bg-[#272727] "
          }`}
        >
          <img src={nft} className="w-full h-full object-cover " alt="" />
          {isClaimable & !isPurchased && (
            <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 my-2 w-[90%]">
              <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
                Claim For {price}
              </a>
            </div>
          )}
          {!isClaimable & !isPurchased ? (
             <div className="gradient bg-[#3C3B41] p-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 my-2 w-[90%]">
              <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
                Need Prior Card
              </a>
            </div>
          ):null}
          {!isClaimable & isPurchased ? (
            <div className="gradient bg-[#3C3B41] p-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 my-2 w-[90%]">
              <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
                PPH {PPH}
              </a>
            </div>
          ):null}
        </div>
      </div>
    );
  }

  export default EarnCard;
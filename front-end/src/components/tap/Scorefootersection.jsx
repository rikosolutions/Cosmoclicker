import React, { useRef, useState } from "react";
import electric from "../../assets/svg/electric.svg";

function Scorefootersection({ data ,taps,defultGas}) {
  return (
    <>
      <div className="balance z-20 w-full bg-[#08070B] border-t-[1px] border-[#3C3B41] gap-2 flex flex-col items-start justify-center p-4">
        <div className="balance flex flex-row items-start justify-between w-full h-full">
          <div className="balance flex  flex-col items-start justify-start gap-2">
            <div className=" bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px] w-max ">
              <h1 className="text-white bg-[#08070B] p-1 text-xs font-medium">
                Total Balance
              </h1>
            </div>
            <h1 className="text-4xl text-white font-bold">{data.score}</h1>
          </div>
          <div className="flex-col flex items-center justify-center gap-2">
            <h1 className="text-white text-sm font-medium">Profit</h1>
            <div className="border-2 border-[#525252]/25 px-6 bg-[#111115] py-2">
              <h1 className="text-white text-base font-medium">250 PH</h1>
            </div>
          </div>
        </div>
        <div className="progress w-full h-full">
          <h1 className="text-white text-xs font-medium">Fuel</h1>
          <div className="progresbar w-full bg-white/20 h-3 relative">
            <div
              className={`progress bg-gradient-to-r from-[#FFB400] to-[#B200F1] h-full `}
              style={{ width: `${(taps / defultGas) * 100}%` }}
            ></div>
            <img
              src={electric}
              alt=""
              className="h-6 w-6 absolute top-1/2 -translate-y-1/2 bg-[#B80EDE] px-1 rounded-full border-[#08070B] border-[1px]"
              style={{ left: `${Math.min(taps / defultGas * 100, 95)}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Scorefootersection;
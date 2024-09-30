import React, { useState } from "react";
import Header from "../components/Header";
import bg from "../assets/svg/home-bg.svg";
import robot from "../assets/dummy-robot.png";
import electric from "../assets/svg/electric.svg";
import Navigation from "../components/Navigation";
import Astronaut from "../components/Astronaut";
import astro from "../assets/robot.png";
function EarnCard({ isClaimable, price, isPurchased, nft, PPH }) {
  return (
    <div
      className={`w-full p-[3px]   relative ${
        isClaimable
          ? "bg-gradient-to-tr from-[#B80EDE] to-[#FFB400]"
          : "bg-[#3C3B41] "
      }`}
    >
      <div
        className={`w-full h-52 pt-4 relative ${
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
        {!isClaimable & !isPurchased && (
          <div className="gradient bg-[#3C3B41] p-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 my-2 w-[90%]">
            <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
              Need Prior Card
            </a>
          </div>
        )}
        {!isClaimable & isPurchased && (
          <div className="gradient bg-[#3C3B41] p-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 my-2 w-[90%]">
            <a className="text-sm font-medium text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
              PPH {PPH}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Earn() {
  const [activeTab, setActiveTab] = useState("newCards");
  return (
    <div className="Earn h-screen bg-[#0A090F] w-full">
      <Header />
      <div className="main h-full flex w-full flex-col items-center justify-start pb-20">
        <div className="earner flex flex-col items-center h-full justify-between w-full overflow-y-scroll relative mt-14 px-4 ">
          <div className="content  w-full h-full flex mb-14">
            {activeTab === "newCards" && (
              <div className="w-full h-full  grid grid-cols-2 gap-4">
                <EarnCard nft={astro} isClaimable={true} price={2800} />
                <EarnCard nft={astro} price={2800} />
                <EarnCard nft={astro} price={2800} />
                <EarnCard nft={astro} price={2800} />
              </div>
            )}
            {activeTab === "myCards" && (
              <div className="w-full h-full  grid grid-cols-2 gap-4">
                <EarnCard
                  nft={astro}
                  isClaimable={false}
                  isPurchased={true}
                  PPH={100}
                />
                <EarnCard
                  nft={astro}
                  isClaimable={false}
                  isPurchased={true}
                  PPH={100}
                />
                <EarnCard
                  nft={astro}
                  isClaimable={false}
                  isPurchased={true}
                  PPH={100}
                />
                <EarnCard
                  nft={astro}
                  isClaimable={false}
                  isPurchased={true}
                  PPH={100}
                />
              </div>
            )}
          </div>
          <div className="tab flex w-full flex-row items-center justify-center gap-4 sticky bottom-0">
            {/* My Cards Tab */}
            <div
              className={`gradient  p-[2px] w-full ${
                activeTab === "myCards"
                  ? "bg-gradient-to-b from-[#FFB400] to-[#B80DDF] text-white"
                  : "bg-white/50 text-white/50"
              }`}
            >
              <a
                className={`text-base font-semibold w-full flex items-center justify-center py-4 bg-[#0A090F] `}
                onClick={() => setActiveTab("myCards")}
              >
                My Cards
              </a>
            </div>

            {/* New Cards Tab */}
            <div
              className={`gradient  p-[2px] w-full ${
                activeTab === "newCards"
                  ? "bg-gradient-to-b from-[#FFB400] to-[#B80DDF] text-white"
                  : "bg-white/50 text-white/50"
              }`}
            >
              <a
                className={`text-base font-semibold w-full flex items-center justify-center py-4 bg-[#0A090F] `}
                onClick={() => setActiveTab("newCards")}
              >
                New Cards
              </a>
            </div>
          </div>
        </div>
        <div className="balance z-20 w-full bg-[#08070B] border-t-[1px] border-[#3C3B41] gap-2 flex flex-col items-start justify-center p-4">
          <div className="balance flex flex-row items-start justify-between w-full h-full">
            <div className="balance flex  flex-col items-start justify-start gap-2">
              <div className=" bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[1px] w-max ">
                <h1 className="text-white bg-[#08070B] p-1 px-3 text-xs font-medium">
                  Total Balance
                </h1>
              </div>
              <h1 className="text-4xl text-white font-bold">19,840</h1>
            </div>
            <div className="flex-col flex items-center justify-center gap-2">
              <h1 className="text-white text-sm font-medium">Profit</h1>
              <div className="border-2 border-[#525252]/25 px-6 bg-[#111115] py-2">
                <h1 className="text-white text-base font-medium">100 PH</h1>
              </div>
            </div>
          </div>
          <div className="progress w-full h-full">
            <h1 className="text-white text-xs font-medium">Fuel</h1>
            <div className="progresbar w-full bg-white/20 h-3 relative">
              <div
                className={`progress bg-gradient-to-r from-[#FFB400] to-[#B200F1] h-full `}
                style={{ width: `50%` }}
              ></div>
              <img
                src={electric}
                alt=""
                className="h-6 w-6 absolute top-1/2 -translate-y-1/2 bg-[#B80EDE] px-1 rounded-full border-[#08070B] border-[1px]"
                style={{ left: `${45}% ` }}
              />
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default Earn;

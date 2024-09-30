import React from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import moneystack from "../assets/Moneystack.png";
function Quest() {
  return (
    <div className="home h-screen bg-[#0A090F] w-full">
      <Header />
      <div className="main h-full flex flex-col items-center justify-start w-full pt-14 pb-20">
        <div className="banner  w-full border-y-[1px] border-[#3C3B41] flex flex-col items-start gap-1 p-4 justify-start">
          <div className=" bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[1px] w-max ">
            <h1 className="text-white bg-[#08070B] p-1 px-3 text-xs font-medium">
              Available
            </h1>
          </div>
          <h1 className="text-4xl text-white font-medium">14 Quests</h1>
        </div>
        <div className="quests flex flex-col items-center justify-start h-full gap-2 w-full p-4 px-6 overflow-y-scroll">
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />{" "}
          <QuestList
            title="Follow @DC on Twitter"
            reward="100"
            isCompleted={false}
            icon={moneystack}
          />
        </div>
      </div>
      <Navigation />
    </div>
  );
}

function QuestList({ title, reward, isCompleted, icon }) {
  return (
    <div className="card w-full border-[1px] border-[#3C3B41] flex items-center justify-between p-3 gap-2">
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
      {!isCompleted ? (
        <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px]">
          <a className="text-sm font-semibold text-white flex items-center justify-center py-1 px-4 bg-[#0A090F]">
            Check
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default Quest;

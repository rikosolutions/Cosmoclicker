import React from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

function Friends() {
  return (
    <div className="home h-screen bg-[#0A090F] w-full">
      <Header />
      <div className="main h-full flex flex-col items-center justify-start w-full pt-14 pb-20">
        <div className="banner  w-full border-y-[1px] border-[#3C3B41] flex flex-col items-start gap-1 p-4 justify-start">
          <div className=" bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[1px] w-max ">
            <h1 className="text-white bg-[#08070B] p-1 px-3 text-xs font-medium">
              Invites
            </h1>
          </div>
          <h1 className="text-4xl text-white font-medium">2 Friends</h1>
          <h1 className="text-[#818181] text-sm font-normal ">
            Invite your friends and earn{" "}
            <span className="text-[#FFB400]">1000</span> coins on each referral.
            Inviting Premium Friends will earn you{" "}
            <span className="text-[#B80DDF]">2500</span> coins on each premium
            referral.
          </h1>
        </div>
        <div className="Friends flex flex-col items-center justify-start h-full gap-2 w-full p-4 px-6 overflow-y-scroll">
          <FriendList firstName="Jaiveer" lastName="Yadav" isPremium={false} />
          <FriendList firstName="Jaiveer" lastName="Yadav" isPremium={true} />
          <FriendList firstName="Jaiveer" lastName="Yadav" isPremium={true} />
        </div>
        <div className="button w-full px-6 bg-transparent  my-2 absolute bottom-0 mb-24">
          <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px]">
            <a className="text-base font-semibold text-white w-full flex items-center justify-center py-4 bg-[#0A090F]">
              Invite Friend
            </a>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

function FriendList({ firstName, lastName, isPremium }) {
  return (
    <div className="card w-full border-[1px] border-[#3C3B41] flex items-center justify-start p-3 gap-2">
      <div className="profile flex items-center h-full">
        <div className="logo bg-gradient-to-b from-[#FFB400] to-[#B80DDF] w-12 h-12 p-[3px]">
          <div className="w-full h-full bg-[#0A090F] flex items-center justify-center">
            {" "}
            <h1 className="text-white text-xl font-bold">JY</h1>
          </div>
        </div>
      </div>
      <div className="namenreward flex flex-col items-start justify-between h-full">
        <h1 className="text-white text-base font-medium">
          {firstName} {lastName}
        </h1>
        {!isPremium ? (
          <h1 className="text-[#FFB400] text-base font-medium">1000</h1>
        ) : (
          <h1 className="text-[#B80DDF] text-base font-medium">2500</h1>
        )}
      </div>
    </div>
  );
}

export default Friends;

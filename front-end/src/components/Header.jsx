import React from "react";

function Header() {
  return (
    <div className="header w-full h-14 flex items-center justify-between px-4 absolute top-0 z-20 bg-[#0A090F]">
      <div className="profile flex flex-row items-center justify-center gap-2">
        <div className="logo bg-gradient-to-b from-[#FFB400] to-[#B80DDF] w-10 h-10 p-1">
          <div className="w-full h-full bg-[#0A090F] flex items-center justify-center">
            {" "}
            <h1 className="text-white text-xl font-bold">JY</h1>
          </div>
        </div>
        <h1 className="text-white text-xl font-bold">Jaiveer</h1>
      </div>
    </div>
  );
}

export default Header;

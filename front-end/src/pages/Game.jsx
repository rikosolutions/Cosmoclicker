import React from "react";
import Header from "../components/tap/Header";
import bg from "../assets/svg/home-bg.svg";
import robot from "../assets/dummy-robot.png";
import electric from "../assets/svg/electric.svg";
import Navigation from "../components/tap/Navigation";
import Astronaut from "../components/tap/Astronaut";
import HomeLayout from "../layout/HomeLayout";
function Game() {
  return (
    <HomeLayout>
      <div className="main h-full flex w-full flex-col items-center justify-start pb-20">
        <Astronaut />
      </div>
    </HomeLayout> 
  );
}

export default Game;

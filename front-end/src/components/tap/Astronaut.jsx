import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";
import "../../assets/css/Tap.css";
import glare from "../../assets/glare.png";
import bg from "../../assets/svg/home-bg.svg";
import Scorefootersection from "../tap/Scorefootersection";
import axios from "../../utlis/axiosInstance";
import _, { constant } from "lodash";
import moment from "moment";

const notCoinAppearence = {
  initial: { opacity: 0, scale: 0, y: 1000 },
  animate: { opacity: 1, scale: [0, 1], y: 0 },
  exit: { opacity: 0, scale: 0 },
  transition: {
    duration: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  },
};

const Astronaut = ({ children }) => {
  const [numbers, setNumbers] = useState([]); // Manage numbers with useState
  const buttonTransformRef = useRef({ scale: 1 });

  const [isRestore, setIsRestore] = useState(false);
  const [details, setDetails] = useState({});
  const [currentEnergy, setCurrentEnergy] = useState();
  const eneryRefillIntravelId = useRef(null);
  const syncTimeoutRef = useRef(null);
  const isMounted = useRef(true);

  const clickValue = 1;

  const defultVal = {
    clickcount: 1,
    restoretime: "1sec",
    enerylevel: 1000,
    eneryRefillcount: 1,
    eneryRefillintervel: 1000,
    eneryNeedToplay: 3,
    gamelevel: 1,
  };

  function energyRefilValue(storedEnergy, lastTapTime) {
    const currentTime = moment.utc();
    const restoreTime = moment.utc(lastTapTime);
    const diffTime = currentTime.diff(restoreTime, "seconds");
    let newEnergy = defultVal.enerylevel;
    if (diffTime > 0) {
      newEnergy = Math.min(defultVal.enerylevel, storedEnergy + diffTime);
    } else {
      newEnergy = defultVal.enerylevel;
    }
    return newEnergy;
  }
  function init() {
    var score = parseInt(localStorage.getItem("score"));
    var miner_level = parseInt(localStorage.getItem("miner_level"));
    var restore_time = localStorage.getItem("restore_time");
    var energy = parseInt(localStorage.getItem("energy_remaining"));

    console.log("tap render");
    if (_.isNil(energy) || isNaN(energy)) {
      energy = defultVal.enerylevel;
      localStorage.setItem("energy_remaining", energy);
    }

    if (
      _.isNil(restore_time) ||
      (restore_time !== "" &&
        !moment(restore_time, moment.ISO_8601, true).isValid())
    ) {
      restore_time = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("restore_time", restore_time);
    }

    

    let refilEnery = energyRefilValue(energy, restore_time);
    if (energy == 0 && refilEnery <= 0) {
      energy = defultVal.enerylevel;
      localStorage.setItem("energy_remaining", energy);
    } else {
      energy = refilEnery;
      localStorage.setItem("energy_remaining", energy.toString());
    }

    if (energy < 0 || energy > defultVal.enerylevel) {
      energy = 0;
      localStorage.setItem("energy_remaining", energy);
      let restore_time = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("restore_time", restore_time);
    }

    const local = {
      score,
      miner_level,
      restore_time,
    };
    setCurrentEnergy(energy);
    setDetails(local);
  }

  const addNumber = (newNumber) => {
    setNumbers((prevNumbers) => [...prevNumbers, newNumber]); // Update state
  };
  const handleAnimationEnd = (id) => {
    setNumbers((prevNumbers) =>
      prevNumbers.filter((number) => number.id !== id)
    );
  };
  const updateButtonTransform = (newTransform) => {
    buttonTransformRef.current = {
      ...buttonTransformRef.current,
      ...newTransform,
    };
  };
  const getRandomXPosition = () => Math.random() * window.innerWidth;
  const handleTouchEnd = () => {
    updateButtonTransform({ scale: 1 });
  };
  const handleClick = (count) => {

    if (!isRestore) {

      const newScore = details.score + count * defultVal.clickcount;
      let newEnergy = currentEnergy - count * defultVal.clickcount;
      newEnergy = Math.max(newEnergy, 0);

      localStorage.setItem("score", newScore);
      localStorage.setItem("energy_remaining", newEnergy);

      const restore_time = moment.utc().format('YYYY-MM-DD HH:mm:ss');
      localStorage.setItem("restore_time", restore_time);
  
      setCurrentEnergy(newEnergy);
      setDetails((prevDetails) => ({
        ...prevDetails,
        score: newScore,
        restore_time: restore_time
      }));
      
      if (newEnergy === 0) setIsRestore(true);
      
      resetSyncTimeout();
      
    }
  };
  const handleTouchStart = (event) => {
    const touchCount = event.touches.length;

    handleClick(touchCount);
    if (touchCount > 0) {
      for (let i = 0; i < touchCount; i++) {
        const touch = event.touches[i];
        const touchX = event.touches[0].clientX; // Get X position of the touch
        const touchY = event.touches[0].clientY; // Get Y position of the touch
        updateButtonTransform({});

        const uniqueId = `${Date.now()}-${Math.random()}-${i}`;

        const x = getRandomXPosition(); // Get random x
        const y = window.innerHeight - 500; // Start from the bottom of the screen
        const newNumber = {
          id: uniqueId,
          value: clickValue,
          startX: touchX, // Use touch X position
          startY: touchY, // Use touch Y position
        };
        updateButtonTransform({ scale: 1 });
        addNumber(newNumber); // Add number immediately
      }
    }
  };

  const targetPoint = { x: window.innerWidth / 2, y: -500 };

  useEffect(() => {
    init();
    console.log("inside the use effect");
    return () => {
      isMounted.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        clearInterval(eneryRefillIntravelId.current);
      }
    };
  }, []);
  useEffect(() => {
    if (currentEnergy < defultVal.enerylevel) {
      reSetEneryRefill();
    }
  }, [currentEnergy]);
  const resetSyncTimeout = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(syncData, 1000);
  };

  const reSetEneryRefill = () => {
    if (eneryRefillIntravelId.current) {
      clearInterval(eneryRefillIntravelId.current);
    }
    eneryRefillIntravelId.current = setInterval(
      updateEnergy,
      defultVal.eneryRefillintervel
    );
  };
  const syncData = async () => {
    await axios
      .post("/api/earn/upscore")
      .then((res) => {})
      .catch((err) => {
        const { status } = err.response;
        if (status === 400) {
          var data = err.response.data;
          alert(data.message);
          return navigate("/game");
        }
      });
  };
  const updateEnergy = () => {
    const lastTapTime =
      localStorage.getItem("restore_time") ||
      moment.utc().format("YYYY-MM-DD HH:mm:ss");
    const currentTime = moment.utc();
    setCurrentEnergy((prevEnergy) => {
      const updatedEnergy = prevEnergy + defultVal.eneryRefillcount;

      if (updatedEnergy >= defultVal.eneryNeedToplay && isRestore)
        setIsRestore(false);

      if (updatedEnergy >= defultVal.enerylevel) {
        localStorage.setItem("energy_remaining", defultVal.enerylevel);
        clearInterval(eneryRefillIntravelId.current);
        return defultVal.enerylevel;
      } else {
        localStorage.setItem(
          "restore_time",
          currentTime.format("YYYY-MM-DD HH:mm:ss")
        );
        localStorage.setItem("energy_remaining", updatedEnergy);
        return updatedEnergy;
      }
    });
  };

  return (
    <>
      <div className="clicker flex items-end h-full justify-center w-full  relative mt-14">
        <div className="relative w-full h-full z-10">
          <img
            src={bg}
            alt=""
            className="absolute top-0 z-0 w-full h-full object-cover"
          />{" "}
          {/* Added full container styling */}
          <AnimatePresence>
            <motion.div
              className="root w-full h-full flex items-center justify-center"
              key="1"
              {...notCoinAppearence}
            >
              <div className={cn("container")}>
                {children}
                <div
                  className={cn("notcoin")}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    transform: `scale(${buttonTransformRef.current.scale})`,
                  }}
                ></div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Animate the numbers */}
          <AnimatePresence>
            {numbers.map((number) => (
              <motion.div
                key={number.id}
                className="absolute text-5xl font-bold opacity-0  bg-blend-color-dodge mix-blend-color-dodge"
                initial={{
                  opacity: 1,
                  x: number.startX - 38,
                  y: number.startY - 450,
                }} // Start at bottom
                animate={{
                  opacity: 0,
                  x: [
                    number.startX,
                    number.startX,
                    targetPoint.x,
                    targetPoint.x,
                  ], // Converge horizontally to center
                  y: -1000, // First go 70% up, then converge to the top
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 1], // Timing the 70% stop and the top converge
                }}
                onAnimationComplete={() => handleAnimationEnd(number.id)} // Remove number after animation
              >
                <img src={glare} alt="" className="mix-blend-color-dodge" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <Scorefootersection data={details} taps={currentEnergy} defultGas={1000} />
    </>
  );
};

export default Astronaut;

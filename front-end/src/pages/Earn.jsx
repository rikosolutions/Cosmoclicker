import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Loading from "../components/tap/Loading";
import axios from "../utlis/axiosInstance";
import { Toast } from "../components/tap/Toast";
import { AnimatePresence, motion } from "framer-motion";
import electric from "../assets/svg/electric.svg";
import astro from "../assets/robot.png";
import HomeLayout from "../layout/HomeLayout";
import EarnCard from "../components/tap/EarnCard";
import Error500 from "./error/Error500";
import MinerBuyDrawer from "../components/tap/MinerBuyDrawer";

import robowhite from "../assets/minner/robowhite.png"
import blackrobo from "../assets/minner/blackrobo.png"
import redrobo from "../assets/minner/redrobo.png"
import yellowrobo from "../assets/minner/yellowrobo.png"

import Nft from "../assets/robot.png";

const nfts = {
  "robowhite.png":robowhite,
  "blackrobo.png":blackrobo,
  "redrobo.png":redrobo,
  "yellowrobo.png":yellowrobo,
}


function Earn() {
  const [activeTab, setActiveTab] = useState("newCards");
  const [taskDetails, setTaskDetails] = useState({});
  const [open, setOpen] = useState({ isopen: false, heading: "", description: "",data:{} });
  const [myMinnerDetails, setMyMinnerDetails] = useState([]);
  const [newMinnerDetails, setNewMinnerDetails] = useState([]);
  const [newNft, setnewNft] = useState(Nft)
  const [balance ,setBalance] = useState({ score:0, ph:0 })
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError ,setIsError] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    getTaskList();
  };

  const addToast = (variant, label, description) => {
    setToast({ id: Date.now(), variant, label, description });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // TODO :handle the parsing error
  const getTaskList = async (tab) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/minner/list`);
      if (response.status === 200 && response.data?.data) {
        const { minnerList, score,ph } = response.data?.data;
        const astroMinnner = minnerList["astro"];
        setMyMinnerDetails(astroMinnner["my_minners"]);
        setNewMinnerDetails(astroMinnner["new_minners"]);
        const localScore = localStorage.getItem("score") || ""
        const localPh = localStorage.getItem("ph") || ""
        let PrasedScore = localScore && localScore!=''  ? parseInt(localScore) : setIsError(true);
        let prasedPh = localPh && localPh!='' ? parseInt(localPh) : setIsError(true);
        setBalance({
          "score": PrasedScore,
          "ph": prasedPh
        });
        
      } else {
        addToast("error", "Something went wrong, please try again later", "");
      }
    } catch (error) {
      console.error("error",error)
      addToast("error", "Failed to fetch MINNER details", "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleminnerBuy = async (item) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/minner/upgrade", { minner_id: item.id });
      if (response.status === 200) {
        const { minnerId, score,ph } = response.data?.data;
        // console.log({ minnerId, score,ph })
        localStorage.setItem("score",score) 
        localStorage.setItem("ph",ph) 
        setBalance({
          "score": score,
          "ph": ph
        });
        setNewMinnerDetails((prevNewMinners) => {
          const updatedNewMinners = prevNewMinners.filter((minner) => minner.id !== item.id);
          if (updatedNewMinners.length > 0) {
            updatedNewMinners[0].status = "unlocked"; 
          }
          return updatedNewMinners;
        });
        setMyMinnerDetails((prevMyMinners) => [
          ...prevMyMinners,
          { ...item, status: "Purchased" }, 
        ]);
        setOpen((prevState) => ({
          ...prevState,
          isopen: false,
        }));
        addToast("success", "Wow! Now you've increased your earnings!", "");
      } else if (response.status === 201) {
        const { message } = response?.data;
        setOpen((prevState) => ({
          ...prevState,
          isopen: false,
        }));
        addToast("error", `${message && message !== '' ? message : "Failed to buy the miner"}`, `${message && message !== '' ? '' : "Try again at another time."}`);
      }
      setActiveTab("newCards");
    } catch (error) {
      console.error("error", error);
    }finally{
      setOpen((prevState) => ({
        ...prevState,
        isopen: false,
      }));
      setIsLoading(false);
    }
  };

  const handleCancel =()=>{
    setOpen((prevState) => ({
      ...prevState,
      isopen: false,
    }));
  }

  const handleminnerPopup =(item)=>{
    
    setnewNft(item.image ? nfts[item.image] : Nft )
    setOpen((prevState) => ({
      ...prevState,
      isopen: true,
      data:item
    }));
  } 

  useEffect(() => {
    getTaskList();
  }, []);

  return (
    <>
      {isError ? (
        <Error500 />
      ) : (
        <HomeLayout>

          <div className="main h-full flex w-full flex-col items-center justify-start pb-20">
            <Loading show={isLoading} />
            <AnimatePresence mode="wait">
              {toast && (
                <Toast
                  key={toast.id}
                  id={toast.id}
                  variant={toast.variant}
                  label={toast.label}
                  description={toast.description}
                  onClose={() => setToast(null)}
                />
              )}
            </AnimatePresence>
            <MinerBuyDrawer open={open.isopen} data={open.data} setOpen={setOpen} nft={newNft} onBuy={handleminnerBuy} onCancel={handleCancel}/>
            <div className="earner flex flex-col items-center h-full justify-between w-full overflow-y-scroll relative mt-14 px-4">
              <div className="content w-full h-full flex mb-15">
                {activeTab === "newCards" && (
                  <>
                    {newMinnerDetails.length > 0 ? (
                      <div className="w-full h-15 grid grid-cols-2 gap-4">
                        {newMinnerDetails.map((item) => (
                          <EarnCard
                            key={item.id}
                            nft={item.image ? nfts[item.image] :  astro}
                            isClaimable={item.status === "unlocked"}
                            price={item.purchase_amount}
                            onBuy={() => handleminnerPopup(item)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex w-full h-full justify-center items-center text-white font-medium">
                        Building new Cards....
                      </div>
                    )}
                  </>
                )}
                {activeTab === "myCards" && (
                  <>
                    {myMinnerDetails.length > 0 ? (
                      <div className="w-full h-15 grid grid-cols-2 gap-4">
                        {myMinnerDetails.map((item) => (
                          <EarnCard
                            key={item.id}
                            nft={item.image ? nfts[item.image] :  astro}
                            isClaimable={false}
                            isPurchased= {item.status == "Purchased"}
                            PPH={item.profit_per_hr}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center text-white font-medium">
                        Buy new card to start earning
                      </div>
                    )}
                  </>
                )}
              </div>
  
              <div className="tab flex w-full flex-row items-center justify-center gap-4 sticky bottom-2">
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
                <div className="balance flex flex-col items-start justify-start gap-2">
                  <div className="bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[1px] w-max">
                    <h1 className="text-white bg-[#08070B] p-1 px-3 text-xs font-medium">
                      Total Balance
                    </h1>
                  </div>
                  <h1 className="text-4xl text-white font-bold">
                    {balance && balance.score !== "" ? balance.score : 0}
                  </h1>
                </div>
                <div className="flex-col flex items-center justify-center gap-2">
                  <h1 className="text-white text-sm font-medium">Profit</h1>
                  <div className="border-2 border-[#525252]/25 px-6 bg-[#111115] py-2">
                    <h1 className="text-white text-base font-medium">
                      {balance && balance.ph !== "" ? balance.ph : 0} PPH
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HomeLayout>
      )}
    </>
  );
  
 
}

export default Earn;

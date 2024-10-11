import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utlis/axiosInstance";
import { initUtils } from "@telegram-apps/sdk";
import { Toast } from "../components/tap/Toast";
import Loading from "../components/tap/Loading";
import { AnimatePresence, motion } from "framer-motion";

import HomeLayout from "../layout/HomeLayout";
import FriendList from "../components/tap/FriendList";
function Friends() {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState({
    isopen: false,
    heading: "",
    description: "",
  });

  const [friends, setFriends] = useState([]);
  const [refLink, setRefLink] = useState("");
  const [otherDetails, setOtherDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const effectRan = useRef(false);
  const loadingRef = useRef(null);
  const utils = initUtils();

  const addToast = (variant, label, description) => {
    setToast({ id: Date.now(), variant, label, description });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const axioController = new AbortController();

  const getTasklist = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/referral/list", {
        signal: axioController.signal,
      });
      if (response.status === 200) {
        const res = response?.data?.data;
        const GAME_TG_URL = "https://t.me/CosmoClickerBot/app";
        setRefLink(`${GAME_TG_URL}?startapp=${res.refCode}`);
        setFriends(res.friends);
        setOtherDetails(res.otherdetails);
      } else {
        addToast("error", `Something woring try agian later`, "");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      navigate("/home");
    }
  };
  const claim = async (friendId) => {
    try {
      setIsLoading(true);
      const response =  await axios.post('/api/referral/claim', { friendID:friendId});
      if (response.status === 200) {
        const res = response?.data?.data;
        const updatedCalim = friends.map((item) =>
          item.id === res.friendid ? { ...item, claim_status: "Y" } : item
        );
        const pointsInLocalStorage = localStorage.getItem("score");
        const newScore = parseInt(res.claimedPoint) + parseInt(pointsInLocalStorage);
        localStorage.setItem("score", newScore);
        setFriends(updatedCalim);
        addToast('success',`You clamied ${res.claimedPoint}!`, '');
        
      }else{
        addToast('error',`fail to claim,try agian`, '');
      }
      setIsLoading(false);
    } catch (error) {
      new Error("Claim id :",error);
    }
  };

  const calimall = async()=>{
    try {
      setIsLoading(true);
      const response =  await axios.post('/api/referral/claimall');
      if (response.status === 200) {
       const res = response?.data?.data;
       if(res.claimedUsers && (res.claimedUsers).length>0){
        const updatedClaim = friends.map(item =>
          res.claimedUsers.includes(item.id) ? { ...item, claim_status: "Y" } : item
        );
         const pointsInLocalStorage = localStorage.getItem("score");
         const newScore = parseInt(res.claimedPoints) + parseInt(pointsInLocalStorage);
         localStorage.setItem("score", newScore);
         setFriends(updatedClaim);
         setOtherDetails((prev)=>{
          const unclimedcount = parseInt(prev.totalReferral) - parseInt((res.claimedUsers).length)
          return{
            ...prev,
            claimedReferral:parseInt(prev.claimedReferral) + parseInt((res.claimedUsers).length),
            unClaimedReferral:unclimedcount >0 ? unclimedcount : 0
          }
         })
         
         addToast('success',`You clamied ${res.claimedPoints}!`, '');
       }else{
        
        addToast('info',`${response && response.data!="" && response.data?.message ? response.data?.message  : 'No Calim Found' }`, '');
       }
       setIsLoading(false);
      }else{
        addToast('error',`fail to claim,try agian`, '');
      }
     }catch (error) {
        navigate("/game");
     }
  }
  const triggerInvate=(e)=>{
    e.preventDefault();
    utils.shareURL(
      refLink,
      "Don't miss out on exciting rewards, Cosmo now!"
    );
  }

  useEffect(() => {
    getTasklist();
  }, []);



  return (
    <HomeLayout>
      <div className="main h-full flex flex-col items-center justify-start w-full pt-14 pb-20">
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
        <div className="banner  w-full border-y-[1px] border-[#3C3B41] flex flex-col items-start gap-1 p-4 justify-start">
          <div className=" bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[1px] w-max ">
            <h1 className="text-white bg-[#08070B] p-1 px-3 text-xs font-medium">
              Invites
            </h1>
          </div>
          <h1 className="text-4xl text-white font-medium flex items-center w-full">
            {otherDetails && otherDetails.totalReferral
              ? otherDetails.totalReferral
              : 0}{" "}
            Friends
            {otherDetails && otherDetails.unClaimedReferral > 1 ? (
              <motion.a
                whileTap={{ background: "#ffffff0a" }}
                className="bg-[#ffffff]/10 text-white px-3 py-2 rounded-full text-base font-helvetica font-semibold ml-auto h-full flex items-center"
                onClick={()=>{calimall()}}
              >
                Claim All
              </motion.a>
            ) : (
              ""
            )}
          </h1>

          <h1 className="text-[#818181] text-sm font-normal ">
            Invite your friends and earn{" "}
            <span className="text-[#FFB400]">
              {otherDetails.non_premium_score &&
              otherDetails.non_premium_score != ""
                ? ` +${otherDetails.non_premium_score}`
                : ""}
            </span>{" "}
            coins on each referral. Inviting Premium Friends will earn you{" "}
            <span className="text-[#B80DDF]">
              {otherDetails.Premium_score && otherDetails.Premium_score != ""
                ? ` +${otherDetails.Premium_score}`
                : ""}
            </span>{" "}
            coins on each premium referral.
          </h1>
        </div>
        <div className="Friends flex flex-col items-center justify-start h-full gap-2 w-full p-4 px-6 overflow-y-scroll">
          {friends.length > 0 ? (
            friends
              .filter((frd) => frd.claim_status === "N")
              .concat(friends.filter((frd) => frd.claim_status !== "N"))
              .map((frd) => (
                <FriendList
                  key={frd.id}
                  firstName={frd.first_name}
                  lastName= {frd.last_name}
                  isPremium={frd.Premium === "Y"}
                  claimScore={frd.claimscore}
                  isClaimed={frd.claim_status !== "Y"}
                  onClaim={() => claim(frd.id)}
                />
              ))
          ) : (
            <div className="flex w-full items-center justify-center h-full">
              <h1 className="text-white text-lg font-helveticaBold flex flex-row items-center justify-center gap-1">
                No Frens here!{" "}
              </h1>
            </div>
          )}
        </div>
        <div className="button w-full px-6 bg-transparent  my-2 absolute bottom-0 mb-24">
          <div className="gradient bg-gradient-to-b from-[#FFB400] to-[#B80DDF] p-[2px]">
            <a className="text-base font-semibold text-white w-full flex items-center justify-center py-4 bg-[#0A090F]"
            onClick={(e)=>{triggerInvate(e)}} 
            >
              Invite Friend
            </a>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Friends;

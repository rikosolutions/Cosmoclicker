import React, { useEffect, useState,useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Loading from "../components/tap/Loading";
import axios from "../utlis/axiosInstance";
import { Toast } from "../components/tap/Toast";
import { AnimatePresence, motion } from "framer-motion";
import {intiTeleBackBtn} from "../utlis/tg"


import moneystack from "../assets/Moneystack.png";
import HomeLayout from "../layout/HomeLayout";
import QuestList from "../components/tap/QuestList"
function Quest() {

    const [taskDetails, setTaskDetails] = useState({});
    const [otherDetails, setOtherDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    const addToast = (variant, label, description) => {
        setToast({ id: Date.now(), variant, label, description });
        setTimeout(() => {
          setToast(null);
        }, 2000);
    };
    const getTaskList = async (tab) => {
    try {
        setIsLoading(true)
        const response = await axios.get(`/api/task/list`);
        if (response.status === 200 && response.data?.data) {
        const { tasklist, others } = response.data?.data;
        setTaskDetails(tasklist);
        setOtherDetails(others)
        } else {
        addToast("error", "Something went wrong, please try again later", "");
        }
    } catch (error) {
        addToast("error", "Failed to fetch referral details", "");
        // navigate("/");
    } finally {
        setIsLoading(false);
    }
    };
    
    function containsTelegramUrl(url) {
     return url.includes("https://t.me");
    }

    const claim = async (task) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/task/claim", { taskID: task.id });
            if (response.status === 200) {
                const {points} = response?.data;
                const pointsInLocalStorage = localStorage.getItem("score") || "0";
                const newScore = parseInt(points) + parseInt(pointsInLocalStorage);
                localStorage.setItem("score", newScore);
                setTimeout(()=>{
                    getTaskList();
                    setIsLoading(false);
                },3000)
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleCheck = async (task) => {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/task/check", { taskID: task.id });
            if (response.status === 200) {
                const resdata = response?.data?.data;
                if (containsTelegramUrl(task.url)) {
                    window.Telegram.WebApp.openLink(task.url);
                } else if (!task.url.includes("story")) {
                    window.Telegram.WebApp.openLink(task.url);   
                }
                setTimeout(()=>{
                    getTaskList();
                    setIsLoading(false);
                },3000)
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };



    // intiTeleBackBtn("/home")
    useEffect(() => {

        getTaskList();
    
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
              Available
            </h1>
          </div>
          <h1 className="text-4xl text-white font-medium">{otherDetails && otherDetails.avaible_task_count!='' ? otherDetails.avaible_task_count : 0 } Quests</h1>
        </div>
        <div className="quests flex flex-col items-center justify-start h-full gap-2 w-full p-4 px-6 overflow-y-scroll">
        {taskDetails && taskDetails["Quest"] && taskDetails["Quest"].length > 0 ? (
            taskDetails["Quest"]
                .filter((task) => task.status === "unlocked" || task.status === "verify")
                .concat(taskDetails["Quest"].filter((task) => task.status !== "unlocked" && task.status !== "verify"))
                .map((item) => (
                    <QuestList
                        key={item.id}
                        title={item.title}
                        reward={item.points}
                        isCompleted={item.status === "success"}
                        isVerify={item.status === "verify"}
                        isUnlocked={item.status === "unlocked"}
                        icon={moneystack}
                        onClaim={() => claim(item)}
                        onCheck={() => handleCheck(item)}
                    />
                ))
        ) : ''}
          
        </div>
      </div>
      </HomeLayout>
  );
}


export default Quest;

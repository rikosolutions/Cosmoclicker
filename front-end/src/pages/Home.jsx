import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { setItems } from "../utlis/localstorage";
import axios from "../utlis/axiosInstance";
import Error500 from "./error/Error500";

import Loading from "../components/tap/Loading";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const referralBy = params.get("tgWebAppStartParam");

    const [appState, setAppState] = useState({
        isLoading: true,
        error: false,
        isTg: false,
    });

    const apiCallMade = useRef(false); 


    useEffect(() => {
      const axioController = new AbortController();
  
      const retrieveTG = () => {
          return new Promise((resolve) => {
              const { platform } = retrieveLaunchParams();
              const isMobile = platform === "android" || platform === "ios";
              setAppState(prev => ({ ...prev, isTg: isMobile }));
              resolve(isMobile);
          });
      };
  
      const initUserData = async (tgUsers) => {
          try {
              const response = await axios.post("/api/auth/tg", tgUsers, {
                  signal: axioController.signal, 
              });
              if (response.status === 200) {
                  const { isNewUser, sync_data } = response.data;
  
                  if (sync_data && sync_data !== "") {
                    
                    setItems(sync_data);
                    navigate("/game");
                  } else {
                    setAppState(prev => ({ ...prev, error: true }));
                  }
              }
          } catch (error) {
            console.log("error",error)
              
            setAppState(prev => ({ isLoading: false, isTg: false, error: true }));
                
          }
      };
  
      retrieveTG().then(isTg => {
          if (isTg) {
              const { initDataRaw, initData, platform } = retrieveLaunchParams();
              const tgUsers = {
                  initDataRaw,
                  initData,
                  platform,
                  referralBy,
              };
              initUserData(tgUsers);
          }
      }).finally(() => {
          setAppState(prev => ({ ...prev, isLoading: false }));
      });
  
      return () => {
         
      };
  }, [navigate, location.search]);


    const { isLoading, error, isTg } = appState;

    return (
        <>
            {error && !isLoading && !isTg && <Error500 />}
            {!error && isLoading && <Loading show={isLoading} />}
            {!isLoading && !error && !isTg && (
              // TODO need to add qr code
              null
                // <Qrcode url="https://t.me/asdgjhaduhy_bot/test_taptap" />
            )}
        </>
    );
}

export default Home;

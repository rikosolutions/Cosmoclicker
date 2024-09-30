
import { useEffect, useState } from "react";
import { initTG, getTGUser } from "../utlis/tg";

import Navigation from "../components/tap/Navigation";
import Auth from "../components/Auth";
import Header from "../components/tap/Header";

import Error500 from "../pages/error/Error500";

function HomeLayout({ children }) {
  
  var tgUser = getTGUser();

  
  return (
    <Auth>   
      
      {tgUser && tgUser!='' ?  (
        <div className="home h-screen bg-[#0A090F] w-full">
          <Header data={tgUser}/>
            {children}
          <Navigation />
        </div>
        // TODO : navtive to /home
      ) : null }
      
    </Auth>
  );
}

export default HomeLayout;
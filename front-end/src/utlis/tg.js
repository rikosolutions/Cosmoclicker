import { useNavigate } from "react-router-dom";

export function initTG() {
    
    if (typeof window !== "undefined" && window.Telegram) {
        const tg = window.Telegram.WebApp;
        if (tg) {
            console.log("Telegram WebApp found, initializing...");
            tg.expand();
            tg.ready();
            tg.enableClosingConfirmation(true);
            tg.setHeaderColor('#000000');
            return true
        } else {
            console.error("Telegram WebApp is not available.");
            return false
        }
    } else {
        console.error("window.Telegram is undefined.");
        return false
    }
}

export function getTGUser() {

    if(!window.Telegram || window.Telegram==='') {
        console.log("Telegram is not init")
        return false
    }

    if (window.Telegram.WebApp.initDataUnsafe.user !== undefined) {
        
        return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return false;
}

export function intiTeleBackBtn(url=""){
    
    
    if(!window.Telegram || window.Telegram==='') {
        console.log("Telegram is not init")
        return false
    }

    const tg = window.Telegram.WebApp;
    const navigate = useNavigate();
    const URL = url!=''? url : "/home"

    if (tg) {
        console.log("Back Button is initializing...");
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            navigate(URL);
            tg.BackButton.hide();
        });
        return true;
    } else {
        console.error("Back Button is not available.");
        return false;
    }


}
import React, { useEffect, useState } from "react";
import "../../assets/css/Loading.css";
import progress from "../../assets/circularprogresswhite.svg";

const Loading = ({ show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  return (
    <div
      className={`loading-container fixed inset-0 flex items-center justify-center z-50 ${
        isVisible ? "visible" : "invisible"
      }`}
      style={{
        background: "rgba(0, 0, 0, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        border: "1px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="loading-content p-4 rounded-2xl">
        <img src={progress} alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    </div>
  );
};

export default Loading;

import { useEffect, useState } from "react";
import successIcon from "../assets/icons/success.svg";
import errorIcon from "../assets/icons/error.svg";
import warningIcon from "../assets/icons/warning.svg";
import infoIcon from "../assets/icons/info.svg";

const Toast = ({ type, message }) => {
  const [icon, setIcon] = useState(successIcon);
  const [bgColor, setBgColor] = useState("bg-green-600");

  useEffect(() => {
    switch (type) {
      case "success":
        setIcon(successIcon);
        setBgColor("bg-green-600");
        break;
      case "error":
        setIcon(errorIcon);
        setBgColor("bg-red-600");
        break;
      case "warning":
        setIcon(warningIcon);
        setBgColor("bg-orange-600");
        break;
      case "info":
        setIcon(infoIcon);
        setBgColor("bg-blue-600");
        break;
      default:
        setIcon(successIcon);
        setBgColor("bg-green-600");
    }
  }, [type]);

  return (
    <div
      className={`max-w-xs text-center min-h-12 rounded-lg flex items-center justify-between gap-3 px-3 ${bgColor} text-white fixed top-5 left-1/2 -translate-x-1/2 shadow-lg`}  
    >
      <img src={icon} width={20} alt={type} />
      <h3 className="mr-auto">{message}</h3>
    </div>
  );
};

export default Toast;

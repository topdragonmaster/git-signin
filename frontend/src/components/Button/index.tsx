import React from "react";
import { IUserInfo } from "src/types";

import "./index.scss";

const Button = ({
  userInfo,
  type,
  disabled,
  children,
  variant,
  onClick,
}: {
  userInfo?: IUserInfo;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  children: any;
  variant: "primary" | "second"
  onClick?: () => void;
}) => {
  return (
    <button 
      className={`button ${variant}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

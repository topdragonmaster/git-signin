import React, { useEffect } from "react";
import { CirclesWithBar } from 'react-loader-spinner'
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { getGitAuth } from "../../Api";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
} from "../../constants/constants";
import "./index.scss"

const CallbackAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [_, setCookie] = useCookies();
  const navigate = useNavigate();
  const fetchToken = async (code: string) => {
    const data = new FormData();
    data.append("client_id", CLIENT_ID);
    data.append("client_secret", CLIENT_SECRET);
    data.append("code", code);
    data.append("redirect_uri", REDIRECT_URI);
    const response = await fetch(
      `https://github.com/login/oauth/access_token`,
      {
        method: "POST",
        body: data,
      }
    );

    console.log("re", response)
    const res = await response.text();


    let params = new URLSearchParams(res);
    const access_token = params.get("access_token");
    if (access_token) {
      console.log("token_response: ", access_token);
      const res = await getGitAuth(access_token);
      const user_token = res.data.token;
      setCookie("AuthCookie", user_token, { path: "/", secure: false });
    } else {
      console.log("Login Failed");
    }

    navigate("/");
  };

  useEffect(() => {
    const code = searchParams.get("code");

    if (code !== null) {
      fetchToken(code);
    }
  }, []);

  return <div className="callback">
    <CirclesWithBar
      height="100"
      width="100"
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      outerCircleColor=""
      innerCircleColor=""
      barColor=""
      ariaLabel='circles-with-bar-loading'
    />
  </div>;
};

export default CallbackAuth;

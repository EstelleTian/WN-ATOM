import React, { Fragment } from "react";
import LoginPage from "./LoginPage";
import "./LoginClient.scss";

function LoginClient(props) {
  alert("登录页面初始化");
  return (
    <Fragment>
      <LoginPage pageType="client"></LoginPage>
    </Fragment>
  );
}

export default LoginClient;

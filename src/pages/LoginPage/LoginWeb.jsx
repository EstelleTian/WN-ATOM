import React, { Fragment } from "react";
import LoginPage from "./LoginPage";
import "./LoginWeb.scss";

function LoginWeb(props) {
  return (
    <Fragment>
      <LoginPage pageType="web"></LoginPage>
    </Fragment>
  );
}

export default LoginWeb;

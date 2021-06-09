/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-06-08 19:04:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\components\NavBar\NavBar.jsx
 */
import React from "react";
import { withRouter } from "react-router-dom";
import { Layout, Avatar, Radio, Tag, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import RightNav from "./RightNav";
// import LeftNav from "./LeftNav";
import LeftTitleNav from "./LeftTitleNav";
import User from "./User";
import NavBellNews from "./NavBellNews";
import "./NavBar.scss";

const { Header } = Layout;

//顶部导航模块
function NavBar(props) {
  const getHeader = () => {
    const { location, title } = props;
    const pathname = location.pathname || "";
    // console.log( "当前url是：",props.location.pathname );
    //放行监控页面
    if (pathname.indexOf("/clearance") > -1) {
      return (
        <div className="layout-row space-between multi_nav">
          <LeftTitleNav />
          {/* <LeftNav /> */}
          {/*<h4 style={{ color: 'red'}}>web自动更新 3/4/1430 </h4>*/}
          <RightNav />
        </div>
      );
    } else {
      return (
        <div className="layout-row space-between simple_nav">
          <div className="layout-nav-left layout-row">
            <span>{title}</span>
          </div>
          <div className="layout-nav-right layout-row">
            {/* <div className="single_bell">
                                <NavBellNews />
                            </div> */}
            <div className="single_user">
              <div className="user_icon" />
              <User />
            </div>
          </div>
        </div>
      );
    }
  };

  return <Header className="nav_header">{getHeader()}</Header>;
}

export default withRouter(NavBar);

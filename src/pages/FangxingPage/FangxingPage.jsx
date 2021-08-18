/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-08-18 09:14:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { Layout, Spin, Menu } from "antd";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { ReqUrls } from "utils/request-urls";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import NavBar from "components/NavBar/NavBar.jsx";
import Topic from "components/NavBar/Topic.jsx";
import DateRange from "components/Common/DateRange.jsx";
import PostUserInfo from "components/Common/PostUserInfo.jsx";
import FlightSearch from "components/FlightSearch/FlightSearch";
import LeftMultiCanvas from "components/LeftMultiCanvas/LeftMultiCanvas";
import SideStickBar from "components/LeftMultiCanvas/SideStickBar";
import RightMultiCanvas from "components/RightMultiCanvas/RightMultiCanvas";
import { isValidVariable } from "utils/basic-verify";
import "./FangxingPage.scss";

const { Sider, Content, Header } = Layout;

const FlightTableModal = lazy(() =>
  import("components/FlightTable/FlightTableModal")
);
// const VirtualModal = lazy(() =>
//   import("components/FlightVirtualTable/VirtualModal")
// );
//放行监控布局模块
function FangxingPage({ systemPage, match }) {
  const [collapsed, setCollapsed] = useState(true);
  const [login, setLogin] = useState(false);
  const url = match.url || "";
  const params = match.params || {};
  const systemType = params.systemType || "";
  let from = "";

  if (url.indexOf("web") > -1) {
    from = "web";
  }

  const { carriers, airports } = useMemo(() => {
    const userStr = localStorage.getItem("user") || "{}";
    const user = JSON.parse(userStr);
    const { carriers, airports } = user;
    return { carriers, airports };
  }, []);

  useEffect(
    function () {
      const id = systemPage.user.id;
      if (isValidVariable(id)) {
        setLogin(true);
      }
    },
    [systemPage.user]
  );
  const onCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="">
      <Topic from={from}></Topic>
      <DateRange></DateRange>
      {from === "web" && <PostUserInfo />}
      <Layout className="">
        <Content className="site-layout">
          <div className="side_menu">
            <NavBar
              className="nav_bar"
              title="空中交通运行放行监控系统"
              username=""
            />
          </div>

          {login && (
            <div className="nav_body">
              <div className="cont_left">
                <div className="left_cont">
                  {systemPage.systemKind.indexOf("CRS") > -1 &&
                  systemPage.leftActiveName !== "" ? (
                    <div className="left_left">{<LeftMultiCanvas />}</div>
                  ) : (
                    <SideStickBar />
                  )}
                  <div className="left_right">
                    <Suspense
                      fallback={
                        <div className="load_spin">
                          <Spin tip="加载中..." />
                        </div>
                      }
                    >
                      <FlightTableModal from={from} />
                      {/* <VirtualModal /> */}
                    </Suspense>
                  </div>
                </div>
              </div>

              <RightMultiCanvas from={from} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default withRouter(inject("systemPage")(observer(FangxingPage)));

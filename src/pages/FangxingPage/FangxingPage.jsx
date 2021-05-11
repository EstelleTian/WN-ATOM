/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-05-10 16:04:11
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
import FlightSearch from "components/FlightSearch/FlightSearch";
import LeftMultiCanvas from "components/LeftMultiCanvas/LeftMultiCanvas";
import RightMultiCanvas from "components/RightMultiCanvas/RightMultiCanvas";
import { isValidVariable } from "utils/basic-verify";
// import Stomp from 'stompjs'
import "./FangxingPage.scss";

const { Sider, Content, Header } = Layout;

const FlightTableModal = lazy(() =>
  import("components/FlightTable/FlightTable")
);
// const VirtualModal = lazy(() =>
//   import("components/FlightVirtualTable/VirtualModal")
// );
//放行监控布局模块
function FangxingPage(props) {
  const { systemPage, match } = props;
  const { leftActiveName, user = {} } = systemPage;
  const [collapsed, setCollapsed] = useState(true);
  const [login, setLogin] = useState(false);
  const params = match.params || {};
  const from = params.from || "";

  const { carriers, airports } = useMemo(() => {
    const userStr = localStorage.getItem("user") || "{}";
    const user = JSON.parse(userStr);
    const { carriers, airports } = user;
    return { carriers, airports };
  }, []);

  useEffect(
    function () {
      const id = user.id;
      if (isValidVariable(id)) {
        // alert("登录成功:" + props.systemPage.user.id);
        setLogin(true);
      } else {
        //TODO 测试用，正式去掉该else
        // setTimeout(function(){
        //     if( !isValidVariable( props.systemPage.user.id ) ){
        //         // alert("未登录成功:" + props.systemPage.user.id);
        //         props.systemPage.setUserData({
        //             id: 14,
        //             descriptionCN: "--",
        //             username: 'lanzhouflw'
        //         });
        //         setLogin(true);
        //     }
        // },1)
      }
    },
    [user.id]
  );
  const onCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="">
      <Topic></Topic>
      {from === "web" && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sider_canvas"
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" selectedKeys={["clearance"]}>
            {/* <Menu.Item key="clearance" className="sider_icon clearance"> */}
            <Menu.Item
              key="clearance"
              icon={collapsed && <div className="sider_icon clearance" />}
              onClick={(e) => {
                window.open("./#/clearance/web", "_self");
              }}
            >
              放行监控
            </Menu.Item>
            {/* <Menu.Item key="monitor" className="sider_icon monitor"> */}
            <Menu.Item
              key="monitor"
              icon={collapsed && <div className="sider_icon monitor" />}
              onClick={(e) => {
                // window.open("./#/web/monitor", "_self");
                const url =
                  ReqUrls.mapWebUrl +
                  "?fullscreen=true&airport=" +
                  airports +
                  "&airline=" +
                  carriers;
                // alert(url);
                window.open(url);
              }}
            >
              态势监控
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout className="">
        <Content className="site-layout">
          <div className="side_menu">
            {from === "web" && (
              <div className="side_menu_icon">
                {collapsed ? (
                  <MenuUnfoldOutlined
                    className="onCollapse_icon"
                    onClick={onCollapseClick}
                  />
                ) : (
                  <MenuFoldOutlined
                    className="onCollapse_icon"
                    onClick={onCollapseClick}
                  />
                )}
              </div>
            )}
            <NavBar
              className="nav_bar"
              title="空中交通运行放行监控系统"
              username=""
            />
          </div>

          {login && (
            <div className="nav_body">
              {/* <FlightSearch /> */}
              <div className="cont_left">
                {/*<SchemeTitle />*/}
                <div className="left_cont">
                  {from !== "web" && leftActiveName !== "" && (
                    <div className="left_left">{<LeftMultiCanvas />}</div>
                  )}
                  <div className="left_right">
                    <Suspense
                      fallback={
                        <div className="load_spin">
                          <Spin tip="加载中..." />
                        </div>
                      }
                    >
                      <FlightTableModal />
                      {/* <VirtualModal /> */}
                    </Suspense>
                  </div>
                </div>
              </div>

              <RightMultiCanvas />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
    // <div className="layout">
    //   <Sider
    //     trigger={null}
    //     collapsible
    //     collapsed={collapsed}
    //     className="sider_canvas"
    //   >
    //     <div className="logo" />
    //     <Menu theme="dark" mode="inline" defaultSelectedKeys={["clearance"]}>
    //       {/* <Menu.Item key="clearance" className="sider_icon clearance"> */}
    //       <Menu.Item key="clearance">放行监控</Menu.Item>
    //       {/* <Menu.Item key="monitor" className="sider_icon monitor"> */}
    //       <Menu.Item key="monitor">态势监控</Menu.Item>
    //     </Menu>
    //   </Sider>
    //   <NavBar
    //     className="nav_bar"
    //     title="空中交通运行放行监控系统"
    //     username=""
    //   />
    //   <Topic></Topic>
    //   {login && (
    //     <div className="nav_body">
    //       <div className="cont_left">
    //         {/*<SchemeTitle />*/}
    //         <div className="left_cont">
    //           {from !== "web" && leftActiveName !== "" && (
    //             <div className="left_left">
    //               <LeftMultiCanvas />
    //               {/* <ModalBox
    //                                         title="航班查询"
    //                                         style={{
    //                                             height: 330
    //                                         }}
    //                                         showDecorator={true}
    //                                         className="flight_search"
    //                                     >
    //                                         <FlightSearch />
    //                                     </ModalBox> */}
    //             </div>
    //           )}
    //           <div className="left_right">
    //             {/***/}
    //             <Suspense
    //               fallback={
    //                 <div className="load_spin">
    //                   <Spin tip="加载中..." />
    //                 </div>
    //               }
    //             >
    //               <FlightTableModal />
    //             </Suspense>
    //           </div>
    //         </div>
    //       </div>

    //       <RightMultiCanvas />
    //     </div>
    //   )}
    // </div>
  );
}

export default withRouter(inject("systemPage")(observer(FangxingPage)));

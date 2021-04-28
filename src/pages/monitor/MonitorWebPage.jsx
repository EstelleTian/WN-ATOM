/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-04-27 21:30:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Layout, Spin, Row, Col, Avatar, Radio, message } from "antd";

import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { inject, observer } from "mobx-react";

import ModalBox from "components/ModalBox/ModalBox";
import {
  isValidObject,
  isValidVariable,
  formatTimeString,
} from "utils/basic-verify";
import "components/NavBar/NavBar.scss";
import "components/total/PrimaryPane.scss";

const { Header, Footer, Sider, Content } = Layout;

//带loading遮罩的iframe地图组件
function LoadingIframe(props) {
  const [loading, setLoading] = useState(true);
  let focus = props.focus || "";
  // iframe 加载完成后关闭loading
  const iframeLoaded = () => {
    setLoading(false);
  };
  return (
    <Spin spinning={loading}>
      <iframe
        className="map-frame"
        id="simpleMap"
        width="100%"
        height="100%"
        frameBorder={0}
        scrolling="no"
        onLoad={() => {
          iframeLoaded();
        }}
        // src={ReqUrls.mapWebUrl + "?key=" + focus + "&value=CCA"}
        src={ReqUrls.mapWebUrl}
      />
    </Spin>
  );
}

//总体监控布局模块
function MonitorWebPage(props) {
  const { user = {} } = props.systemPage;
  const userId = user.id || "";
  //   let { subscribeData } = props.userSubscribeData;
  //   let focus = subscribeData.focus || "";

  // 初始化用户信息
  useEffect(function () {
    // 从localStorage取用户信息并存入stores
    const user = localStorage.getItem("user");
    if (isValidVariable(user)) {
      props.systemPage.setUserData(JSON.parse(user));
    }
  }, []);

  return (
    <Layout>
      <Content className="main-wrapper layout-column">
        <div className="top layout-column">
          <Row className="flex-row">
            <Col className="left-container">
              <ModalBox
                title="缩略地图"
                showDecorator={true}
                className="map-module"
                style={{
                  height: "100%",
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                <div
                  className="map-container"
                  style={{ margin: "0 10px 20px" }}
                >
                  {/* 虽然以下条件里的每个LoadingIframe一样，但一定要这样写，用于解决iframe src值变更后iframe页面内容不刷新问题  */}

                  <LoadingIframe focus={"NW"}></LoadingIframe>
                </div>
              </ModalBox>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default inject("systemPage")(observer(MonitorWebPage));

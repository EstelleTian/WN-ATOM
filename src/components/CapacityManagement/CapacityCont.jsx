/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-04-26 14:12:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { Menu, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import { requestGet, request } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import ModalBox from "components/ModalBox/ModalBox";
import {
  isValidVariable,
  getFullTime,
  formatTimeString,
} from "utils/basic-verify";
import CapacityTable from "./CapacityTable";
import RouteMenu from "./RouteMenu";
import DynamicWorkSteps from "./DynamicWorkSteps";
import { customNotice } from "utils/common-funcs";
import "./CapacityCont.scss";

const { SubMenu } = Menu;

//容量管理内容页
function CapacityCont(props) {
  const { capacity, pane, systemPage } = props;
  const dateRange = capacity.dateRange;
  const loading = capacity.loading;
  const elementName = pane.key || "";
  const elementType = pane.type || "";
  const firId = pane.firId || "";
  // alert("elementName: "+elementName+"  elementType: "+elementType+"  firId: "+firId);
  let staticTimer = useRef();
  let dynamicTimer = useRef();
  const generateTime = capacity.dynamicDataGenerateTime || "";

  const requestStaticData = useCallback(() => {
    if (!isValidVariable(elementName) || !isValidVariable(elementType)) {
      return;
    }
    const timerFunc = function () {
      if (nextRefresh) {
        staticTimer.current = setTimeout(function () {
          requestStaticData(nextRefresh);
        }, 30 * 1000);
      }
    };
    const opt = {
      url: ReqUrls.capacityBaseUrl + "static/retrieveCapacityStatic",
      method: "POST",
      params: {
        date: getFullTime(new Date(), 4),
        elementName,
        routeName: "",
        firId: firId,
        elementType,
      },
      resFunc: (data) => {
        const { capacityMap, generateTime } = data;
        props.capacity.setStaticData(capacityMap[elementName]);
        timerFunc();
      },
      errFunc: (err) => {
        customNotice({
          type: "error",
          message: "静态容量数据获取失败",
        });
        timerFunc();
      },
    };

    request(opt);
  }, []);

  //动态容量获取
  const requestDynamicData = useCallback((nextRefresh) => {
    if (
      !isValidVariable(elementName) ||
      !isValidVariable(elementType) ||
      capacity.editable
    ) {
      return;
    }
    let selRoute = props.capacity.selRoute || "";
    if (elementType === "ROUTE" && selRoute === "") {
      return;
    }

    let userObj = systemPage.user || "";
    if (!isValidVariable(userObj.username)) {
      return;
    }
    const timerFunc = function () {
      if (nextRefresh) {
        dynamicTimer.current = setTimeout(function () {
          requestDynamicData(nextRefresh);
        }, 20 * 1000);
      }
    };
    let date = capacity.getDate();
    let params = {};
    if (elementType === "ROUTE") {
      params = {
        date,
        elementName: selRoute,
        routeName: elementName,
        // elementName: elementName,
        // routeName: selRoute,
        firId: firId,
        elementType,
      };
    } else {
      params = {
        date,
        elementName,
        routeName: "",
        firId: firId,
        elementType,
      };
    }
    const opt = {
      url:
        ReqUrls.capacityBaseUrl +
        "dynamic/retrieveCapacityDynamic/" +
        userObj.username,
      method: "POST",
      params,
      resFunc: (data) => {
        const { capacityMap, generateTime, authMap, elementNameFs } = data;
        let obj = {};
        for (let key in capacityMap) {
          obj = capacityMap[key];
        }
        props.capacity.setDynamicData(obj);
        props.capacity.setOtherData(generateTime, authMap, elementNameFs);

        if (props.capacity.forceUpdateDynamicData) {
          //获取数据
          props.capacity.forceUpdateDynamicData = false;
        }
        props.capacity.toggleLoad(false);
        timerFunc();
      },
      errFunc: (err) => {
        customNotice({
          type: "error",
          message: "动态容量数据获取失败",
        });
        if (props.capacity.forceUpdateDynamicData) {
          //获取数据
          props.capacity.forceUpdateDynamicData = false;
        }
        props.capacity.toggleLoad(false);
        timerFunc();
      },
    };

    request(opt);
  }, []);

  //用户信息获取
  useEffect(function () {
    const user = localStorage.getItem("user");
    if (isValidVariable(user)) {
      props.systemPage.setUserData(JSON.parse(user));
      if (isValidVariable(props.systemPage.user.id)) {
        //获取数据
        // requestStaticData(true);
        requestDynamicData(true);
      }
    } else {
      alert("请先登录");
    }
    return () => {
      console.log("卸载");
      clearTimeout(staticTimer.current);
      staticTimer.current = "";
      clearTimeout(dynamicTimer.current);
      dynamicTimer.current = "";
    };
  }, []);

  useEffect(
    function () {
      if (isValidVariable(props.capacity.selRoute)) {
        //获取数据
        if (!isValidVariable(dynamicTimer.current)) {
          requestDynamicData(true);
        } else {
          props.capacity.toggleLoad(true);
          requestDynamicData(false);
        }
      }
    },
    [props.capacity.selRoute]
  );

  useEffect(
    function () {
      if (props.capacity.forceUpdateDynamicData) {
        //获取数据
        props.capacity.toggleLoad(true);
        requestDynamicData(false);
      }
    },
    [props.capacity.forceUpdateDynamicData]
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <div className="cap_set_canvas">
        <div className="set_top">
          {/* <div className="left_wrapper">
                        <ModalBox
                            title="静态容量——默认配置"
                            style={{
                                height: 140
                            }}
                            showDecorator = {true}
                            className="static_cap_modal"
                        >
                            <CapacityTable type="line1" kind="default"/>
                        </ModalBox>
                        <ModalBox
                            title="静态容量——时段配置"
                            showDecorator = {true}
                            className="static_cap_modal static_cap_modal_24 modal_static"
                        >
                            <CapacityTable  type="line24" kind="static"/>
                        </ModalBox>
                    </div> */}
          <div className="right_wrapper">
            {elementType === "AREA" && (
              <div className="capacity_title">
                {props.capacity.elementNameFs}
              </div>
            )}

            <div className="filter_menu">
              <Menu
                selectedKeys={[capacity.dateRange + ""]}
                defaultOpenKeys={["date"]}
                mode="inline"
                theme="dark"
                onClick={({ item, key, keyPath, selectedKeys, domEvent }) => {
                  if (!capacity.editable) {
                    capacity.dateRange = key * 1;
                    props.capacity.toggleLoad(true);
                    //强制刷新
                    props.capacity.forceUpdateDynamicData = true;
                    //获取数据
                    requestDynamicData(false);
                  } else {
                    customNotice({
                      type: "warn",
                      message: "容量处于编辑状态，请取消后再操作",
                    });
                  }
                }}
                // inlineCollapsed={this.state.collapsed}
              >
                <SubMenu key="date" icon={<CalendarOutlined />} title="日期">
                  <Menu.Item key="-1">昨日</Menu.Item>
                  <Menu.Item key="0">今日</Menu.Item>
                  <Menu.Item key="1">明日</Menu.Item>
                </SubMenu>
              </Menu>
              {elementType === "ROUTE" && (
                <RouteMenu
                  elementName={elementName}
                  elementType={elementType}
                />
              )}
            </div>

            <ModalBox
              //   title={`动态容量——时段配置(${formatTimeString(generateTime)})`}
              title={`动态容量配置(${formatTimeString(generateTime)})`}
              showDecorator={true}
              className="static_cap_modal static_cap_modal_24 modal_dynamic"
            >
              <Spin spinning={loading}>
                <CapacityTable
                  type="line24"
                  kind="dynamic"
                  airportName={pane.key}
                  paneType={pane.type}
                  routeName={props.capacity.selRoute}
                />
              </Spin>
            </ModalBox>
            <DynamicWorkSteps
              pane={pane}
              routeName={props.capacity.selRoute}
            ></DynamicWorkSteps>
          </div>
        </div>
      </div>
    </div>
  );
}

export default inject("capacity", "systemPage")(observer(CapacityCont));

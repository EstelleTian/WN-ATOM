import React, { Fragment, useMemo } from "react";
import { Radio, Badge, Button, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { observer, inject } from "mobx-react";
// import { withRouter } from "react-router-dom";
import TodoNav from "./TodoNav";
import ExchangeSlotNav from "components/exchangeSlot/ExchangeSlotNav";
import SubTableNav from "./SubTableNav";
import User from "./User";
import { isValidVariable } from "utils/basic-verify";
import RefreshBtn from "components/SchemeList/RefreshBtn";
import DateRange from "./DateRangeBar";
import MapBar from "./MapBar";
// import DirectionBar from "./DirectionBar";
import SystemBar from "./SystemBar";
import ParameterConfiguration from "./ParameterConfiguration";
import RunwayConfiguration from "./RunwayConfiguration";
import "./RightNav.scss";
import { openMapFrame } from "../../utils/client";

function RightNav({ systemPage, schemeListData }) {
  //执行KPI
  const groupRightChange = (e) => {
    const value = e.target.value;
    systemPage.setLeftActiveName(value);
  };
  //方案列表、外部流控
  const groupRightChange2 = (e) => {
    const value = e.target.value;
    systemPage.setRightActiveName(value);
  };
  //豁免、等待池、特殊、失效、航班协调
  const groupRightChange3 = (e) => {
    const value = e.target.value;
    systemPage.setModalActiveName(value);
  };

  // 取默认激活的系统对象
  const activeSystem = systemPage.activeSystem || {};
  // 系统名称
  const system = activeSystem.system || "";
  // 是否为CDM
  const isCDM = system.indexOf("CDM") > -1;

  //根据方向过滤方案
  const schemeList = useMemo(() => {
    let list = schemeListData.sortedList || [];
    const activeDir = systemPage.activeDir || {};
    let name = activeDir.name || "";
    if (name !== "ALL") {
      list = list.filter((item) => {
        const tacticDirection = item.tacticDirection || "";
        if (tacticDirection.indexOf(name) > -1) {
          return true;
        } else {
          return false;
        }
      });
    }

    return list;
  }, [schemeListData.sortedList, systemPage.activeDir]);

  return (
    <div className="layout-nav-right layout-row nav_right">
      <div className="nav_bar">
        {systemPage.user.id !== "" && (
          <span>
            <DateRange />
            {/* <DirectionBar /> */}
            <Radio.Group buttonStyle="solid">
              <RefreshBtn />
            </Radio.Group>
            <SystemBar />
            {systemPage.systemKind.indexOf("CRS") > -1 && (
              <Radio.Group
                value={systemPage.leftActiveName}
                buttonStyle="solid"
                onChange={groupRightChange}
              >
                {systemPage.userHasAuth(12513) && (
                  <Radio.Button value="kpi">执行KPI</Radio.Button>
                )}
              </Radio.Group>
            )}

            <Radio.Group
              value={systemPage.modalActiveName}
              buttonStyle="solid"
              onChange={groupRightChange3}
            >
              {/* 豁免、等待池、特殊、失效 */}
              <SubTableNav />
              {/* 时隙交换列表 */}
              {systemPage.userHasAuth(12522) && <ExchangeSlotNav />}
              {/* 航班协调 */}
              {systemPage.userHasAuth(12505) && <TodoNav />}
            </Radio.Group>
            <Radio.Group
              value={systemPage.rightActiveName}
              buttonStyle="solid"
              onChange={groupRightChange2}
            >
              {systemPage.userHasAuth(12506) && (
                <Radio.Button value="scheme">
                  方案列表
                  <Badge
                    // className="site-badge-count-109"
                    count={schemeList.length}
                    style={{ backgroundColor: "rgb(61, 132, 36)" }}
                  />
                </Radio.Button>
              )}
              {/* {systemPage.userHasAuth(12507) && (
                <Radio.Button value="outer_scheme">外部流控</Radio.Button>
              )} */}
              {systemPage.userHasAuth(12518) && isCDM && (
                <RunwayConfiguration />
              )}
            </Radio.Group>
            {systemPage.userHasAuth(12519) && <MapBar />}
            {systemPage.userHasAuth(12514) && <ParameterConfiguration />}
            {systemPage.userHasAuth(12517) && (
              <Radio.Group
                value={systemPage.activeFlightSearch ? "search" : ""}
                buttonStyle="solid"
              >
                <Radio.Button
                  value="search"
                  onClick={(e) => {
                    const value = e.target.value;
                    systemPage.toggleFlightSearch();
                  }}
                >
                  航班查询
                </Radio.Button>
              </Radio.Group>
            )}
          </span>
        )}
      </div>
      {/* <div className="single_user">
        <div className="user_icon" />
        <User />
      </div> */}
    </div>
  );
}

export default inject("systemPage", "schemeListData")(observer(RightNav));

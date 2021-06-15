import React, { Fragment } from "react";
import { Radio, Badge, Button, Avatar } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { observer, inject } from "mobx-react";
// import { withRouter } from "react-router-dom";
import TodoNav from "./TodoNav";
import SubTableNav from "./SubTableNav";
import User from "./User";
import { isValidVariable } from "utils/basic-verify";
import RefreshBtn from "components/SchemeList/RefreshBtn";
import DateRange from "./DateRangeBar";
import SystemBar from "./SystemBar";
import ParameterConfiguration from "./ParameterConfiguration";
import "./RightNav.scss";

function RightNav(props) {
  const { systemPage } = props;
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
  return (
    <div className="layout-nav-right layout-row nav_right">
      <div className="nav_bar">
        {systemPage.user.id !== "" && (
          <span>
            <DateRange />
            <Radio.Group buttonStyle="solid">
              <RefreshBtn />
            </Radio.Group>
            <SystemBar />
            {systemPage.systemKind === "CRS" && (
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
              {/* 航班协调 */}
              {systemPage.userHasAuth(12505) && <TodoNav />}
            </Radio.Group>
            <Radio.Group
              value={systemPage.rightActiveName}
              buttonStyle="solid"
              onChange={groupRightChange2}
            >
              {systemPage.userHasAuth(12506) && (
                <Radio.Button value="scheme">方案列表</Radio.Button>
              )}
              {/* {systemPage.userHasAuth(12507) && (
                <Radio.Button value="outer_scheme">外部流控</Radio.Button>
              )} */}

              <Radio.Button value="runway">跑道配置</Radio.Button>
            </Radio.Group>
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
      <div className="single_user">
        <div className="user_icon" />
        <User />
      </div>
    </div>
  );
}

export default inject("systemPage")(observer(RightNav));

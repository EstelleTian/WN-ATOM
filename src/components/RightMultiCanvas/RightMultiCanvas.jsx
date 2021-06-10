/*
 * @Author: liutianjiao
 * @Date: 2021-01-07 20:35:06
 * @LastEditTime: 2021-06-10 19:29:30
 * @LastEditors: Please set LastEditors
 * @Description: 左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-ATOM\src\components\RightMultiCanvas\RightMultiCanvas.jsx
 */
import React, { lazy, Suspense } from "react";
import { inject, observer } from "mobx-react";
import { Empty, Spin } from "antd";
import ModalBox from "components/ModalBox/ModalBox";
import FlightSearch from "components/FlightSearch/FlightSearch";

import { formatTimeString } from "utils/basic-verify";
import "./RightMultiCanvas.scss";

//TODO 真实数据，用于公司环境
const SchemeListModal = lazy(() => import("components/SchemeList/SchemeList"));
//TODO 本地模拟数据，用于无接口调试样式
// const SchemeList = lazy(() => import('components/SchemeList/SchemeListMock') );
const RunwayList = lazy(() => import("components/Runway/RunwayList"));

function RightMultiCanvas(props) {
  const { systemPage, from } = props;
  const { rightActiveName, activeFlightSearch } = systemPage;
  return (
    <div className="cont_right">
      <div className="list-container">
        {rightActiveName === "scheme" || rightActiveName === "runway" ? (
          <ModalBox
            className={rightActiveName === "scheme" ? "" : "hidden"}
            // title="方案列表"
            title={`方案列表 (数据时间:${formatTimeString(
              props.schemeListData.generateTime
            )})`}
            showDecorator={true}
          >
            <Suspense
              fallback={
                <div className="load_spin">
                  <Spin tip="加载中..." />
                </div>
              }
            >
              <SchemeListModal />
            </Suspense>
          </ModalBox>
        ) : (
          ""
        )}
        {rightActiveName === "outer_scheme" ? (
          <ModalBox title="外部流控列表" showDecorator={true}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{ color: "#fff" }}
            />
          </ModalBox>
        ) : (
          ""
        )}
        {rightActiveName === "runway" ? (
          <ModalBox
            // title="方案列表"
            title={`跑道列表 (数据时间:${formatTimeString(
              props.schemeListData.generateTime
            )})`}
            showDecorator={true}
            className="runway_modal"
          >
            <Suspense
              fallback={
                <div className="load_spin">
                  <Spin tip="加载中..." />
                </div>
              }
            >
              <RunwayList />
            </Suspense>
          </ModalBox>
        ) : (
          ""
        )}
      </div>
      {systemPage.userHasAuth(12512) && activeFlightSearch && (
        <div className="fixed-container">
          <FlightSearch />
        </div>
      )}
    </div>
  );
}

export default inject(
  "systemPage",
  "schemeListData"
)(observer(RightMultiCanvas));

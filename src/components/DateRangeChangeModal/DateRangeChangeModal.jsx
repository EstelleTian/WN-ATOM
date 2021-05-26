/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-05-26 13:38:31
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { useEffect } from "react";
import { Collapse, Form, Space, Row, Col } from "antd";
import { inject, observer } from "mobx-react";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { isValidObject, isValidVariable } from "utils/basic-verify";
import DraggableModal from "components/DraggableModal/DraggableModal";
import DateRangeChangeForm from "./DateRangeChangeForm";
import "./DateRangeChangeModal.scss";

//计划时间范围模态框
const DateRangeChangeModal = (props) => {
  const { systemPage = {} } = props;
  const { dateRangeVisible } = systemPage;
  // 关闭航班详情
  const closeModal = () => {
    systemPage.setDateRangeVisible(false);
  };

  return (
    <DraggableModal
      // 是否垂直居中展示
      centered={true}
      title="计划时间范围"
      // centered为true 则无需设置style
      // style={{ top: "300px", left: "0px" }}
      visible={dateRangeVisible}
      handleOk={() => {}}
      handleCancel={() => {
        closeModal();
      }}
      width={800}
      maskClosable={false}
      mask={true}
      className="date-range-modal"
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <DateRangeChangeForm></DateRangeChangeForm>
    </DraggableModal>
  );
};

export default inject("systemPage")(observer(DateRangeChangeModal));

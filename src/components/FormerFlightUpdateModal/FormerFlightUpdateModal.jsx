/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-05-12 18:39:25
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { useEffect,} from "react";
import {
  Collapse,
  Form,
  Space,
  Row,
  Col,
} from "antd";
import { inject, observer } from "mobx-react";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import {
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import DraggableModal from "components/DraggableModal/DraggableModal";
import FormerFlightUpdateForm from "components/FormerFlightUpdateModal/FormerFlightUpdateForm";
// import FlightInfo from "./FlightInfo";

//指定前序航班模态框
const FormerFlightUpdateModal= (props) => {
  const { formerFlightUpdateFormData } = props;
  const {modalVisible}= formerFlightUpdateFormData
  // 关闭航班详情
  const closeModal = () => {
    formerFlightUpdateFormData.toggleModalVisible(false);
  };

  //获取航班详情数据
  const getDetailData = async () => {
    if (isValidVariable(id)) {
      const flightId = flight.id || "";
      const res = await requestGet2({
        url: ReqUrls.getAlterFormerFlightListUrl + id,
      });
      // flightDetailData.updateFlightDetailData(res);
    } else {
      alert("未获取到航班信息");
    }
  };

  // 初始化用户信息
  // useEffect(
  //   function () {
  //     if (modalVisible) {
  //       getDetailData();
  //     }
  //   },
  //   [modalVisible]
  // );
  return (
    <DraggableModal
      // 是否垂直居中展示
      centered ={true}
      title="指定前序航班"
      // centered为true 则无需设置style
      // style={{ top: "300px", left: "0px" }}
      visible={modalVisible}
      handleOk={() => {}}
      handleCancel={() => {
        closeModal();
      }}
      width={800}
      maskClosable={false}
      mask={true}
      className="flight-detail-modal"
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <FormerFlightUpdateForm></FormerFlightUpdateForm>
      
    </DraggableModal>
  );
};

export default inject("formerFlightUpdateFormData")(observer(FormerFlightUpdateModal));

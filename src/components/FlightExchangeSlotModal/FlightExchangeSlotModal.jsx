/*
 * @Author: your name
 * @Date: 2020-12-14 13:47:11
 * @LastEditTime: 2021-05-12 18:39:25
 * @LastEditors: Please set LastEditors
 * @Description: 执行KPI
 * @FilePath: WN-ATOM\src\components\FlightDetail\FlightDetail.jsx
 */
import React, { useEffect,} from "react";
import { inject, observer } from "mobx-react";
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import {
  isValidObject,
  isValidVariable,
} from "utils/basic-verify";
import DraggableModal from "components/DraggableModal/DraggableModal";
import FlightExchangeSlotForm from "components/FlightExchangeSlotModal/FlightExchangeSlotForm";

//航班时隙交换模态框
const FlightExchangeSlotModal= (props) => {
  const { flightExchangeSlotFormData } = props;
  const {modalVisible}= flightExchangeSlotFormData
  // 关闭航班详情
  const closeModal = () => {
    flightExchangeSlotFormData.toggleModalVisible(false);
  };

  return (
    <DraggableModal
      // 是否垂直居中展示
      centered ={true}
      title="时隙交换"
      // centered为true 则无需设置style
      // style={{ top: "300px", left: "0px" }}
      visible={modalVisible}
      handleOk={() => {}}
      handleCancel={() => {
        closeModal();
      }}
      width={1000}
      maskClosable={false}
      mask={true}
      className="flight-exchange-slot-modal"
      // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
      destroyOnClose={true}
      footer={""}
    >
      <FlightExchangeSlotForm></FlightExchangeSlotForm>
      
    </DraggableModal>
  );
};

export default inject("flightExchangeSlotFormData")(observer(FlightExchangeSlotModal));

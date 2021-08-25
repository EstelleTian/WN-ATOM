import React, { useState, useEffect, useCallback } from "react";
import { Modal, message, Button } from "antd";
import { requestGet, request } from "utils/request";
import { isValidObject } from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";
import SchemeDetail from "components/SchemeList/SchemeDetail";
import SchemeForm from "components/RestrictionForm/SchemeForm";
import { inject, observer } from "mobx-react";
import { customNotice } from "utils/common-funcs";
import DraggableModal from "components/DraggableModal/DraggableModal";

const SchemeModal = (props) => {
  let [flowData, setFlowData] = useState({});
  const { visible, modalId, modalType, setVisible, userId } = props;

  //获取方案详情数据成功回调方法
  const updateDetailData = useCallback((data) => {
    //更新flowData
    setFlowData(data);
  });
  //请求错误处理
  const requestErr = useCallback((err, content) => {
    message.error({
      content,
      duration: 4,
    });
  });
  //根据modalId获取方案详情
  const requestSchemeDetail = useCallback(() => {
    const opt = {
      url: ReqUrls.schemeDetailByIdUrl + userId + "/" + modalId,
      method: "GET",
      params: {},
      resFunc: (data) => {
        updateDetailData(data);
        // setManualRefresh(false);
      },
      errFunc: (err) => {
        requestErr(err, "方案详情数据获取失败");
        // setManualRefresh(false);
      },
    };
    requestGet(opt);
  });

  //获取方案数据成功回调方法
  const updateSchemeData = useCallback((data) => {

    //更新flowData
    setFlowData(data);
    // 更新方案表单store数据
    let tacticProcessInfo = data.tacticProcessInfo || {};
    console.log(tacticProcessInfo);
    props.schemeFormData.updateSchemeData(tacticProcessInfo);
  });
  // 获取方案数据失败
  const requestSchemeDataErr = useCallback((err, content) => {
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
      errMsg = err.message;
    } else if (isValidVariable(err)) {
      errMsg = err;
    }
    customNotice({
      type: "error",
      message: (
        <div>
          <p>{`${content}`}</p>
          <p>{errMsg}</p>
        </div>
      ),
    });
  });

  // 方案修改-请求方案数据(与获取方案详情不是同一接口,专门用于方案修改的)
  const requestSchemeData = (schemeID) => {
    // 请求参数
    const opt = {
      url: ReqUrls.schemeDataByIdForUpdateUrl + schemeID,
      method: "GET",
      params: {},
      resFunc: (data) => updateSchemeData(data),
      errFunc: (err) => requestSchemeDataErr(err, "方案数据获取失败"),
    };
    // 发送请求
    request(opt);
  };

  useEffect(
    function () {
      if (visible) {
        console.log(modalType);
        if (modalType === "DETAIL") {
          //根据modalId获取方案详情
          requestSchemeDetail(modalId);
        } else if (modalType === "MODIFY") {
          //根据modalId获取方案数据,用于修改方案
          requestSchemeData(modalId);
        }
      }
    },
    [visible, modalId]
  );
  const closeModal = useCallback(() => {
    setVisible(false);
  });

  const setModalContent = useCallback(() => {
    if (modalType === "DETAIL") {
      return (
        <DraggableModal
          // 是否垂直居中展示
          centered={true}
          title={`方案详情 - ${tacticName}`}
          // centered为true 则无需设置style
          // style={{ top: "300px", left: "0px" }}
          visible={visible}
          handleOk={() => setVisible(false)}
          handleCancel={() => setVisible(false)}
          width={1000}
          maskClosable={false}
          mask={true}
          className="flight-table-config-modal"
          // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
          destroyOnClose={true}
          footer={
            <div>
              <Button type="primary" onClick={closeModal}>
                确认
              </Button>
            </div>
          }
        >
          <SchemeDetail flowData={flowData} />
        </DraggableModal>
      );
    } else if (modalType === "MODIFY") {
      return (
        <DraggableModal
          // 是否垂直居中展示
          centered={true}
          title={`模拟方案调整 - ${tacticName} `}
          // centered为true 则无需设置style
          // style={{ top: "300px", left: "0px" }}
          visible={visible}
          handleOk={() => setVisible(false)}
          handleCancel={() => setVisible(false)}
          width={1280}
          maskClosable={false}
          mask={true}
          className="flight-table-config-modal"
          // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
          destroyOnClose={true}
          footer={null}
        >
          <SchemeForm
            pageType="MODIFY"
            operationDescription="修改方案"
            primaryButtonName="提交修改"
            setModalVisible={setVisible}
            bordered={false}
          />
        </DraggableModal>
      );
    } else if (modalType === "RECREATE") {
      return (
        <Modal
          title={`方案发布`}
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          width={1200}
          // maskClosable={false}
          destroyOnClose={true}
          footer={null}
        >
          <SchemeForm
            pageType="RECREATE"
            operationDescription="创建方案"
            primaryButtonName="创建方案"
            setModalVisible={setVisible}
            bordered={false}
          />
        </Modal>
      );
    }
  });

  // 方案数据对象
  // 方案数据对象
  let tacticProcessInfo = isValidObject(flowData.tacticProcessInfo)
    ? flowData.tacticProcessInfo
    : {};
  // 方案基本信息数据对象
  let basicTacticInfo = isValidObject(tacticProcessInfo.basicTacticInfo)
    ? tacticProcessInfo.basicTacticInfo
    : {};

  const { tacticName = "", id = "" } = basicTacticInfo;


  return setModalContent();
};

// export default SchemeModal
export default inject("schemeFormData", "systemPage")(observer(SchemeModal));

/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-09-22 09:48:40
 * @LastEditors: liutianjiao
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\FlightTableColumnConfigModal\FlightTableColumnConfigModal.jsx
 */
import React, {
  Fragment,
  useRef,
} from "react";
import { Modal, Button } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable, isValidObject } from "utils/basic-verify";
import { request2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import DraggableModal from "components/DraggableModal/DraggableModal";
import FlightTableColumnConfigTable from "components/FlightTableColumnConfigModal/FlightTableColumnConfigTable";

import "./FlightTableColumnConfigModal.scss";

function FlightTableColumnConfigModal({ systemPage = {}, columnConfig }) {
  const timerId = useRef();
  const user = systemPage.user || {};
  const userId = user.id || "";
  // 保存按钮点击事件
  const handleSave = () => {
    Modal.info({
      title: "保存",
      // icon: <ExclamationCircleOutlined />,
      centered: true,
      closable: true,
      content: (
        <div>
          <p>确定保存表格列序配置?</p>
        </div>
      ),
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        save();
      },
    });
  }

  // 保存列序配置数据
  const save = async () => {
    try {
      const requestData = columnConfig.requestData || {};
      const columnData = columnConfig.columnData || {};
      const columnDataStr = JSON.stringify(columnData);
      let operation = { ...requestData, value: columnDataStr };
      console.log(operation);
      // const url =
      //   ReqUrls.flightTableColumnConfigUrl +
      //   "/updateUserPropertyConfig?userId=" +
      //   userId;
        const url =
        ReqUrls.flightTableColumnConfigUrl;
      const data = await request2({
        url,
        method: "POST",
        params: {
          ...operation,
        },
      });
      console.log(66,data);
      const { userPropertys = [] } = data;
      let propertys = userPropertys[0] || {};
      columnConfig.setRequestData(propertys);
      Modal.success({
        title: "保存成功",
        content: (
            <span>
                <span>表格列序配置保存成功</span>
            </span>
        ),
        centered: true,
        okText: "确定",
        onOk: () => {
            // 关闭列序配置模态框
            columnConfig.toggleModalVisible(false);
        },
    });
    } catch (errorInfo) {
      let errMsg = "";
        if (isValidObject(errorInfo) && isValidVariable(err.message)) {
            errMsg = errorInfo.message;
        } else if (isValidVariable(errorInfo)) {
            errMsg = errorInfo;
        }
        Modal.error({
            title: "保存失败",
            content: (
                <span>
                    <span>表格列序配置保存失败</span>
                    <br />
                    <span>{errMsg}</span>
                </span>
            ),
            centered: true,
            okText: "确定",
        });
    }
  };

  return (
    <Fragment>
      <DraggableModal
        // 是否垂直居中展示
        centered={true}
        title="表格列序配置"
        // centered为true 则无需设置style
        // style={{ top: "300px", left: "0px" }}
        visible={true}
        handleOk={() => { }}
        handleCancel={() => {
          columnConfig.toggleModalVisible(false);
        }}
        width={800}
        maskClosable={false}
        mask={true}
        className="flight-table-config-modal"
        // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
        destroyOnClose={true}
        footer={
          <div>

            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
            <Button
              onClick={(e) => {
                columnConfig.resetColumnData();
              }}
            >
              重置
            </Button>
          </div>
        }
      >
        <FlightTableColumnConfigTable />
      </DraggableModal>
    </Fragment>
  );
}

export default inject(
  "systemPage",
  "columnConfig"
)(observer(FlightTableColumnConfigModal));

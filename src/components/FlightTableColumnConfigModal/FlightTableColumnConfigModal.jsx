
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useRef, useState } from "react";
import { Tabs, Radio, Badge, Menu, Button } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import FlightTableColumnConfigTable from 'components/FlightTableColumnConfigModal/FlightTableColumnConfigTable'

import './FlightTableColumnConfigModal.scss'


function FlightTableColumnConfigModal(props) {
    const timerId = useRef();
    const { systemPage = {} } = props;
    const user = systemPage.user || {};
    
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
                // handleCancel={hideModal}
                width={800}
                maskClosable={false}
                mask={true}
                className="flight-table-config-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={<Button>sss</Button>}
            >
                
                <FlightTableColumnConfigTable />
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage")(observer(FlightTableColumnConfigModal))
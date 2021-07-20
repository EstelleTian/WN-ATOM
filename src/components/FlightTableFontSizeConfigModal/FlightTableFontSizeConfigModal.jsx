
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

import FlightTableFontSizeConfigTable from 'components/FlightTableFontSizeConfigModal/FlightTableFontSizeConfigTable'
import './FlightTableFontSizeConfigModal.scss'


function FlightTableFontSizeConfigModal(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const timerId = useRef();
    const { systemPage = {} } = props;
    const user = systemPage.user || {};
    const activeParameterConfigModal = systemPage.activeParameterConfigModal || "";
    const configName = "flightTableFontSize"
    useEffect( ()=>{
        if( activeParameterConfigModal === configName ){
            setModalVisible(true);
        } else{
            setModalVisible(false);
        }
    }, [activeParameterConfigModal]);

    // 关闭模态框
    const hideModal = () => {
        // setTodoModalVisible(false);
        props.systemPage.updateActiveParameterConfigModalChange("");
    }

    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                centered={true}
                title="表格字体配置"
                // centered为true 则无需设置style
                // style={{ top: "300px", left: "0px" }}
                visible={modalVisible}
                handleOk={() => { }}
                handleCancel={hideModal}
                width={1000}
                maskClosable={false}
                mask={true}
                className="flight-table-config-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={<Button>sss</Button>}
            >
                
                <FlightTableFontSizeConfigTable />
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage")(observer(FlightTableFontSizeConfigModal))
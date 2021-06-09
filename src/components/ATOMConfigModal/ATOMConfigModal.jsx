
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import ATOMConfigForm from 'components/ATOMConfigModal/ATOMConfigForm'

function ATOMConfigModal(props) {
    const { ATOMConfigFormData={} } = props;
    // 模态框显隐
    const modalVisible = ATOMConfigFormData.modalVisible
    // 关闭模态框
    const hideModal = () => {
        ATOMConfigFormData.toggleModalVisible(false)
    }
    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                // centered={true}
                title="ATOM引接应用配置"
                // centered为true 则无需设置style
                style={{ top: "300px"}}
                visible={modalVisible}
                handleOk={() => { }}
                handleCancel={hideModal}
                width={800}
                maskClosable={false}
                mask={true}
                className="ATOM-config-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={""}
            >
                <ATOMConfigForm />
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","ATOMConfigFormData")(observer(ATOMConfigModal))
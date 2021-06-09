
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-NTFM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import NTFMConfigForm from 'components/NTFMConfigModal/NTFMConfigForm'

function NTFMConfigModal(props) {
    const { NTFMConfigFormData={} } = props;
    // 模态框显隐
    const modalVisible = NTFMConfigFormData.modalVisible
    // 关闭模态框
    const hideModal = () => {
        NTFMConfigFormData.toggleModalVisible(false)
    }
    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                // centered={true}
                title="NTFM引接应用配置"
                // centered为true 则无需设置style
                style={{ top: "300px"}}
                visible={modalVisible}
                handleOk={() => { }}
                handleCancel={hideModal}
                width={800}
                maskClosable={false}
                mask={true}
                className="NTFM-config-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={""}
            >
                <NTFMConfigForm />
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","NTFMConfigFormData")(observer(NTFMConfigModal))
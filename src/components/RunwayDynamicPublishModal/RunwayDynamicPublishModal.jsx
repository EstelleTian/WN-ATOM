
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import RunwayDynamicPublishForm from 'components/RunwayDynamicPublishModal/RunwayDynamicPublishForm'

// 动态跑道发布模态框
function RunwayDynamicPublishModal(props) {
    const { RunwayDynamicPublishFormData={} } = props;
    // 机场名称
    const airport = RunwayDynamicPublishFormData.airport || "";
    // 模态框显隐
    const modalVisible = RunwayDynamicPublishFormData.modalVisible
    // 关闭模态框
    const hideModal = () => {
        RunwayDynamicPublishFormData.toggleModalVisible(false)
        // 清空store数据
        RunwayDynamicPublishFormData.updateConfigData({})
    }
    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                centered={true}
                title={`(${airport}) 动态跑道发布`}
                // centered为true 则无需设置style
                visible={modalVisible}
                handleOk={() => { }}
                handleCancel={hideModal}
                width={1200}
                maskClosable={false}
                mask={true}
                className="runway-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={""}
            >
                <RunwayDynamicPublishForm />
               
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","RunwayDynamicPublishFormData")(observer(RunwayDynamicPublishModal))
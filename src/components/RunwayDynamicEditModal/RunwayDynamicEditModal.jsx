
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import RunwayDynamicEditForm from 'components/RunwayDynamicEditModal/RunwayDynamicEditForm'
// 动态跑道修改模态框
function RunwayDynamicPublishModal(props) {
    const { RunwayDynamicEditFormData={} } = props;
    // 模态框显隐
    const modalVisible = RunwayDynamicEditFormData.modalVisible
    // 机场名称
    const airport = RunwayDynamicEditFormData.airport || "";
    // 关闭模态框
    const hideModal = () => {
        RunwayDynamicEditFormData.toggleModalVisible(false)
    }
    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                centered={true}
                title={`(${airport}) 动态跑道修改`}
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
                <RunwayDynamicEditForm />
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","RunwayDynamicEditFormData")(observer(RunwayDynamicPublishModal))
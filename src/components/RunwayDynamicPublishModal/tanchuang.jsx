
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import RunwayDynamicPublishForm from 'components/RunwayDynamicPublishModal/RunwayDynamicPublishForm'
import IsForm from 'components/RunwayDynamicPublishModal/isForm'

// 动态跑道发布模态框
function Tan(props) {
    const { RunwayDynamicPublishFormData={} ,RunwayFormworkmanagementData} = props;
    // 机场名称
    const airport = RunwayDynamicPublishFormData.airport || "";
    // 模态框显隐
    const AddVisible = RunwayFormworkmanagementData.AddVisible
    // 关闭模态框
    const toAddVisible = () => {
        RunwayFormworkmanagementData.toAddVisible(false)
    }
    return (
        <Fragment>
            
            <DraggableModal
                // 是否垂直居中展示
                centered={true}
                title={`(${airport})`}
                // centered为true 则无需设置style
                visible={AddVisible}
                handleOk={() => { }}
                handleCancel={toAddVisible}
                width={1200}
                maskClosable={false}
                mask={true}
                className="runway-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={""}
            >
                <IsForm />
               
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","RunwayDynamicPublishFormData",'RunwayFormworkmanagementData')(observer(Tan))
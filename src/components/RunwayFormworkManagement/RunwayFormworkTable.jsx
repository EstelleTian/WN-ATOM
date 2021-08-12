
import React, { Fragment, } from "react";
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import RunwayFormworkConfiguration from 'components/RunwayFormworkManagement/RunwayFormworkConfiguration'

// 跑道模板表格模态框
function RunwayFormworkTable(props) {
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
                title={`模板内容`}
                visible={AddVisible}
                handleOk={() => { }}
                handleCancel={toAddVisible}
                width={1200}
                maskClosable={false}
                mask={true}
                className="runway-modal"
                destroyOnClose={true}
                footer={""}
            >
                <RunwayFormworkConfiguration />
               
            </DraggableModal>
        </Fragment>

    )
}

export default inject("systemPage","RunwayDynamicPublishFormData",'RunwayFormworkmanagementData')(observer(RunwayFormworkTable))
import React, {useEffect, useState} from 'react'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button, Modal,   Form, message} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import FlowList from './FlowList'
import { handleImportControl } from 'utils/client'
import { getDayTimeFromString, isValidObject, isValidVariable } from '../../utils/basic-verify'
import { request } from 'utils/request'


//表单整体
function FlowForm(props){
    const form = Form.useForm();
    return (
        <div>
            <Form
                form={form}
                size="small"
                onFinish={(values) => {
                    console.log(values);
                }}
                className="flow_form"
            >
                <StaticInfoCard
                    disabledForm={props.disabledForm}
                    updateBasicStartTimeDisplay={updateBasicStartTimeDisplay }
                    updateBasicEndTimeDisplay={updateBasicEndTimeDisplay }
                />
                <FlowList
                    disabledForm={props.disabledForm}
                    updateFlowControlStartTimeDisplay={updateFlowControlStartTimeDisplay }
                    updateFlowControlEndTimeDisplay={updateFlowControlEndTimeDisplay }
                    updateRestrictionMode={ updateRestrictionMode }
                    updatePublishType={ updatePublishType }
                />

            </Form>
            {
                showImportBtn
                    ?  <div>
                        <Button
                            className="r_btn btn_import"
                            type="primary"
                            onClick={handleImportClick}
                            disabled ={ importButtonDisable }
                        >
                            导入
                        </Button>
                        <Modal
                            title="流控导入"
                            visible={isModalVisible}
                            maskClosable={false}
                            style={{ top: 200 }}
                            onOk ={ handleImportFormData }
                            onCancel={handleCancel}
                            confirmLoading = { confirmLoading }
                        >
                            <p>确定导入当前流控?</p>
                        </Modal>
                    </div>
                    : ""
            }


        </div>
    )
}

export default FlowForm
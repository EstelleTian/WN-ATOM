import React, {useEffect} from 'react'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button,  Form} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import FlowList from './FlowList'
import { sendMsgToClient } from 'utils/client'
import './RestrictionForm.scss'

//表单整体
function RestrictionForm(props){
    let initialValues = {
        staticName: "AAA",
        origFlowContent: "BBB",
        publicUnit: "CCC",
        publicUser: "DDD",
        unit: "DDD",
        prevUnit: "DDD",
        nextUnit: "DDD",
        prevExempt: "DDD",
        nextExempt: "DDD",
        resHigh: "DDD",
    };
    const [form] = Form.useForm();
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    return (
        <div>
        <Form
            form={form}
            size="small"
            initialValues={initialValues}
            onFinish={(values)=>{
               const newStartTime =  moment(values.startTime).format('YYYYMMDDHHmm');
                console.log(values);
                console.log(newStartTime);
                sendMsgToClient(message)

            }}
            className="destriction_form"
        >
            <StaticInfoCard disabledForm={props.disabledForm}/>
            <FlowList disabledForm={props.disabledForm} />

        </Form>
        <Button className="r_btn btn_import" type="primary" onClick={onCheck} >
            导入
        </Button>
        </div>
    )
}

export default RestrictionForm
import React, {useEffect} from 'react'
import  moment  from 'moment'
import "moment/locale/zh-cn"
import {Button,  Form} from 'antd'
import StaticInfoCard from './StaticInfoCard'
import FlowList from './FlowList'
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
    return (
        <Form
            form={form}
            size="small"
            initialValues={initialValues}
            onFinish={(values)=>{
               const newStartTime =  moment(values.startTime).format('YYYYMMDDHHmm');
                console.log(values);
                console.log(newStartTime)

            }}
            className="destriction_form"
        >
            <StaticInfoCard />
            <FlowList />
            <Button type="primary" htmlType="submit">
                导入
            </Button>
        </Form>

    )
}

export default RestrictionForm
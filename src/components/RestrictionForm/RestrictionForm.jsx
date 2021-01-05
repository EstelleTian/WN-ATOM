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
    const  { flowData } = props;
    const { restrictionInfo={} } = flowData;
    const { basicTacticInfo={} } = restrictionInfo;

    const { tacticName, tacticPublishUnit, tacticPublishUser } = basicTacticInfo;

    let initialValues = {
        staticName: tacticName || '',
        origFlowContent: "BBB",
        publicUnit: tacticPublishUnit || "",
        publicUser:  tacticPublishUser || "",
        unit: "DDD",
        prevUnit: "DDD",
        nextUnit: "DDD",
        prevExempt: "DDD",
        nextExempt: "DDD",
        resHigh: "DDD",
    };
    const [form] = Form.useForm();
    useEffect(function(){
        form.resetFields();//重置，用以表单初始值赋值
    },[])
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const setFieldsValue =(values) => {
        console.log(values);
        return initialValues
    }

    form.setFieldsValue(setFieldsValue());

    return (
        <div>
        <Form
            form={form}
            size="small"
            // initialValues={initialValues}
            onFinish={(values)=>{
               const newStartTime =  moment(values.startTime).format('YYYYMMDDHHmm');
                console.log(values);
                console.log(newStartTime);
                // sendMsgToClient(message)

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
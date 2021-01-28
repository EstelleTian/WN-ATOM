/*
 * @Author: your name
 * @Date: 2021-01-26 16:45:23
 * @LastEditTime: 2021-01-27 19:29:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\StaticSetting.jsx
 */
import React, {useState, useEffect, useRef} from 'react'
import { AlertOutlined,ArrowRightOutlined  } from '@ant-design/icons';
import { Input, Form, Button } from 'antd'
import { REGEXP } from 'utils/regExpUtil'

import './StaticSetting.scss'

const rules  = [
    {
        pattern: REGEXP.NUMBER3,
        message: "请输入0~999的整数"
    },
    {
        required: true,
        message: `必填项`,
    }
]
const formItemLayout = {
    labelCol: { span:24 },
    wrapperCol: { span: 24 },
  };

const CInput = (props) => {

}

//静态容量配置
function StaticSetting (props){
    const [ formData, setFormData] = useState({});
    const [ orgData, setOrgData] = useState({});
    const [ disabled, setDisabled] = useState(true);
    
    const [ form ] = Form.useForm();
    const inputRef = useRef(null);

    const save = async () => {
        try {
          let values = await form.validateFields();
          console.log(values);
          setFormData(values);
         
        } catch (errInfo) {
          console.log("Save failed:", errInfo);
        }
    };   

    useEffect(() => {
        setOrgData({
            capacityVal: 30,
            capacityL1: 2,
            capacityL2: 8,
            capacityL3: 10,
        }) 
        setFormData({
            capacityVal: 30,
            capacityL1: 2,
            capacityL2: 8,
            capacityL3: 10,
        });
        
    }, [])
    useEffect(() => {
        form.setFieldsValue(formData);
        
    }, [formData])
      
    return (
        <div className="total_set">
                <Form form={form} >
                    <div className="set_item">
                        <span className="span_title">容量值:</span>
                        <Form.Item
                            {...formItemLayout}
                            className="set_item_input"
                            rules={rules}
                            name="capacityVal"
                            >

                            <Input  maxLength={3} className={` ${ (orgData.capacityVal*1 !== formData.capacityVal*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} disabled={disabled}/>
                        </Form.Item>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值:</span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL1"
                            >
                            <Input maxLength={3} className={` ${ (orgData.capacityL1*1 !== formData.capacityL1*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef}  disabled={disabled}/>
                        </Form.Item>
                        <ArrowRightOutlined /><AlertOutlined className="alarm alarm_yellow"/>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值:</span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL2"
                            >
                            <Input maxLength={3} className={` ${ (orgData.capacityL2*1 !== formData.capacityL2*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} disabled={disabled} />
                        </Form.Item>
                        <ArrowRightOutlined /><AlertOutlined className="alarm alarm_orange"/>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值:</span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL3"
                            >
                            <Input maxLength={3} className={` ${ (orgData.capacityL3*1 !== formData.capacityL3*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save} ref={inputRef}  disabled={disabled}/>
                        </Form.Item>
                        <ArrowRightOutlined /><AlertOutlined className="alarm alarm_red"/>
                    </div>
                </Form>
                <div className="btns">
                    {
                        disabled 
                        ? <Button size="small" type="primary" onClick={ e => {
                            setDisabled(false);
                        }} >修改</Button> 
                        : <Button size="small" type="primary" onClick={ e => {
                            setDisabled(true);
                        }} >保存</Button>
                    }
                    {
                        disabled 
                        ? ""
                        : <Button size="small" style={{ marginLeft: '1rem'}} onClick={ e => {
                            setFormData({
                                capacityVal: 30,
                                capacityL1: 2,
                                capacityL2: 8,
                                capacityL3: 10,
                            });
                        }} >重置</Button>
                    }
                    
                    
                </div>
            </div>
    )
}

export default StaticSetting;
/*
 * @Author: your name
 * @Date: 2021-01-26 16:45:23
 * @LastEditTime: 2021-01-27 14:14:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\StaticSetting.jsx
 */
import React, {useState, useEffect, useRef} from 'react'
import { AlertOutlined  } from '@ant-design/icons';
import { Input, Form } from 'antd'
import { REGEXP } from 'utils/regExpUtil'

import './StaticSetting.scss'

const rules  = [
    {
        pattern: REGEXP.NUMBER3,
        message: "请输入0~999范围内的整数"
    },
    {
        required: true,
        message: `请输入非空数据`,
    }
]

//静态容量配置
function StaticSetting (props){
    const [ formData, setFormData] = useState({});
    const [ orgData, setOrgData] = useState({});
    
    const [ form ] = Form.useForm();
    const inputRef = useRef(null);

    form.setFieldsValue({
        "capacityVal": 30,
        capacityL1: 2,
        capacityL2: 8,
        capacityL3: 10,
    });
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
                        <span className="span_title">容量值</span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityVal"
                            >
                            <Input className={` ${ (orgData.capacityVal*1 !== formData.capacityVal*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} />
                        </Form.Item>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值 </span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL1"
                            >
                            <Input className={` ${ (orgData.capacityL1*1 !== formData.capacityL1*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} />
                        </Form.Item>
                        <AlertOutlined className="alarm alarm_yellow"/>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值 </span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL2"
                            >
                            <Input className={` ${ (orgData.capacityL2*1 !== formData.capacityL2*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} />
                        </Form.Item>
                        <AlertOutlined className="alarm alarm_orange"/>
                    </div>
                    <div className="set_item">
                        <span className="span_title">超出容量值</span>
                        <Form.Item
                            className="set_item_input"
                            rules={rules}
                            name="capacityL3"
                            >
                            <Input className={` ${ (orgData.capacityL3*1 !== formData.capacityL3*1) ? "yellow" : ""} `}
                                onPressEnter={save} onBlur={save}  ref={inputRef} />
                        </Form.Item>
                        <AlertOutlined className="alarm alarm_red"/>
                    </div>
                </Form>
            </div>
    )
}

export default StaticSetting;
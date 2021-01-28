/*
 * @Author: your name
 * @Date: 2021-01-26 16:45:23
 * @LastEditTime: 2021-01-28 11:00:35
 * @LastEditors: Please set LastEditors
 * @Description: 静态容量设置
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\StaticSetting.jsx
 */
import React, {useState, useEffect, useRef} from 'react'
import { AlertOutlined,ArrowRightOutlined  } from '@ant-design/icons';
import { Input, Form, Button } from 'antd'
import { REGEXP } from 'utils/regExpUtil'
import data from '../../mockdata/static'

import './StaticSetting.scss'

const rules  = [
    {
        pattern: REGEXP.NUMBER3,
        message: "请输入0~999的整数"
    },
    {
        validator: (rule, value) => {
            if(value.trim() !== ""){
                return Promise.resolve();
            }
            return Promise.reject();
        },
        message: `必填项`,
    }
]

//静态容量配置
function StaticSetting (props){
    const [ formData, setFormData] = useState({});   
    const [ form ] = Form.useForm();
    const capacityValRef = useRef();
    const capacityL1Ref = useRef();
    const capacityL2Ref = useRef();
    const capacityL3Ref = useRef();
    const {pane} = props;

    const save = async () => {
        try {
          let values = await form.validateFields();
          console.log(values);
          //保存数据成功，重置formData,重置ref，重置changed
          capacityValRef.current = values.capacityVal;
          capacityL1Ref.current = values.capacityL1;
          capacityL2Ref.current = values.capacityL2;
          capacityL3Ref.current = values.capacityL3;
          resetChangedInput();
          setFormData(values);
         
        } catch (errInfo) {
          console.log("Save failed:", errInfo);
        }
    };   
    
    const requestData = () => {
        console.log(pane);
        const map = data.map;
        capacityValRef.current = map.capacityVal;
        capacityL1Ref.current = map.capacityL1;
        capacityL2Ref.current = map.capacityL2;
        capacityL3Ref.current = map.capacityL3;
        setFormData(map);
    };

    useEffect(() => {
        requestData();
    }, []);
    
    useEffect(() => {
        form.setFieldsValue(formData);
    }, [formData])

    const judgeIsChanged = ( e, orgRef  ) => {
        const orgVal = orgRef.current*1;
        const target = e.target;
        const tVal = target.value*1;
        let clsssStr = target.getAttribute("class");
        if( (orgVal > 0) && (tVal > 0) && (orgVal !== tVal) ){
            target.setAttribute("class", clsssStr +" yellow")
        }else{
            clsssStr = clsssStr.replace(/ yellow/g, "");
            target.setAttribute("class", clsssStr)
        }
    }
    const resetChangedInput = () => {
        const doms = document.getElementsByClassName("cap_input");
        if( doms.length > 0 ){
            for( let i = 0; i < doms.length; i++ ){
                const dom = doms[i];
                let clsssStr = dom.getAttribute("class");
                clsssStr = clsssStr.replace(/ yellow/g, "");
                dom.setAttribute("class", clsssStr)
            }
            
        }
    }
    return (
        <div className="total_set">
            <Form form={form}>
                <div className="set_item">
                    <span className="span_title">容量值:</span>
                    <Form.Item
                        className="set_item_input"
                        rules={rules}
                        name="capacityVal"
                        >
                            <Input maxLength={3} className="cap_input" ref={capacityValRef} 
                                onChange={ e => {
                                    judgeIsChanged( e, capacityValRef );
                                }}
                            />
                    </Form.Item>
                </div>
                <div className="set_item">
                    <span className="span_title">超出容量值:</span>
                    <Form.Item
                        className="set_item_input"
                        rules={rules}
                        name="capacityL1"
                        >
                        <Input maxLength={3} className="cap_input" ref={capacityL1Ref} 
                            onChange={ e => {
                                judgeIsChanged( e, capacityL1Ref );
                            }}
                        />
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
                        <Input maxLength={3} className="cap_input" ref={capacityL2Ref} 
                            onChange={ e => {
                                judgeIsChanged( e, capacityL2Ref );
                            }}
                        />
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
                        <Input maxLength={3} className="cap_input" ref={capacityL3Ref} 
                            onChange={ e => {
                                judgeIsChanged( e, capacityL3Ref );
                            }}
                        />
                    </Form.Item>
                    <ArrowRightOutlined /><AlertOutlined className="alarm alarm_red"/>
                </div>
            </Form>
            <div className="btns">
                <Button size="small" type="primary" onClick={ save } >修改</Button>   
                <Button size="small" style={{ marginLeft: '1rem'}} onClick={ e => {
                    resetChangedInput( );
                    setFormData({
                        capacityVal: capacityValRef.current,
                        capacityL1: capacityL1Ref.current,
                        capacityL2: capacityL2Ref.current,
                        capacityL3: capacityL2Ref.current,
                    });
                }} >重置</Button>
            </div>
        </div>
    )
}

export default StaticSetting;
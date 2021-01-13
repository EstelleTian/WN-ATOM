/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-13 10:00:18
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {message as antdMessage, message, Popover, Button, Form, Descriptions, Input, DatePicker, Checkbox} from "antd";
import React,{ useCallback, useState } from "react";
import {  isValidVariable, getDayTimeFromString } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { request, requestGet } from 'utils/request'
import moment from "moment";
import {observer, inject} from "mobx-react";


// TOBT右键协调框
const TOBTPopover = (props) => {
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        let { text, record } = opt;
        let { FLIGHTID, DEPAP, ARRAP } = record;
        let time = "";
        let date = "";
        if( isValidVariable(text) && text.length >= 12 ){
            time = text.substring(8,12);
            date = moment( text.substring(0,8), "YYYY-MM-DD");
        }

        let initialValues = {
            flightid: FLIGHTID || '',
            airport: DEPAP + "-" + ARRAP,
            unit: "",
            locked: "",
            time,
            date,
            comment: ""
        };
        // useEffect(function(){
        //     form.resetFields();//重置，用以表单初始值赋值
        // },[]);
        return (
            <Form
                // form={form}
                size="small"
                onFinish={(values)=>{
                    const newStartTime =  moment(values.startTime).format('YYYYMMDD');
                    console.log(values);
                    console.log(newStartTime);
                }}
                initialValues={initialValues}
                className="time_form tobt_form"
            >
                <Descriptions size="small" bordered column={1}>
                    <Descriptions.Item label="航班">
                        <Form.Item
                            name="flightid"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="机场">
                        <Form.Item
                            name="airport"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="日期" >
                        <Form.Item
                            name="date"
                        >
                            <DatePicker className="clr_date"  format="YYYY-MM-DD"/>
                        </Form.Item>

                    </Descriptions.Item>
                    <Descriptions.Item label="时间">
                        <Form.Item
                            name="time"
                        >
                            <Input/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="申请备注" className="comment_width">
                        <Form.Item
                            name="comment"
                        >
                            <Input.TextArea maxLength={100} />
                        </Form.Item>
                    </Descriptions.Item>
                    <div>
                        <Button size="small" type="primary" htmlType="submit">修改</Button>
                        <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                    </div>
                </Descriptions>

            </Form>
        )
    })
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    const [ visible, setVisible ] = useState(false)
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title="TOBT申请变更"
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
            getContainer={false}

            // visible = {visible}
            // onVisibleChange={(visible) => {
            //     setVisible(true)
            // }}
        >
            <div className={`full-cell`}>
                <div className={`${ isValidVariable(text) ? "" : "empty_cell" } `} title={`${text}`}>
                    <span className="">{getDayTimeFromString(text)}</span>
                </div>
            </div>
        </Popover >
    )
}


export default inject("flightTableData", "systemPage")(observer(TOBTPopover))


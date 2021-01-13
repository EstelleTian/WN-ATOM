/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-13 10:00:18
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {Button, Checkbox, DatePicker, Descriptions, Form, Input, message as antdMessage, message, Popover} from "antd";
import React,{ useCallback, useState } from "react";
import { getDayTimeFromString, formatTimeString, getTimeAndStatus, isValidVariable } from 'utils/basic-verify'
import { FlightCoordination } from 'utils/flightcoordination.js'
import { request, requestGet } from 'utils/request'
import "./CollaboratePopover.scss"
import moment from "moment";
import {observer, inject} from "mobx-react";
import FmeToday from "../../utils/fmetoday";

//过点时间右键协调框
const FFIXTPopover = (props) => {
    const [autoChecked, setAutoChecked] = useState(true);
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        const {text, record, index, col} = opt;
        let { FFIXT, FLIGHTID, DEPAP, ARRAP } = record;
        let date;
        if( isValidVariable(FFIXT) && FFIXT.length > 12 ){
            FFIXT = FFIXT.substring(0, 12);
            date = moment( FFIXT.substring(0,8), "YYYY-MM-DD")
        }

        let initialValues = {
            flightid: FLIGHTID || '',
            airport: DEPAP + "-" + ARRAP,
            unit: "",
            locked: "",
            time: FFIXT,
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
                className="ffixt_form"
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
                    <Descriptions.Item label="">
                        <Form.Item
                            name="locked"
                        >
                            <Checkbox
                                checked={ autoChecked }
                                onChange={e => {
                                    setAutoChecked(e.target.checked)
                                }}
                            >
                                禁止系统自动调整
                            </Checkbox>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        <Form.Item
                            name="comment"
                        >
                            <Input.TextArea maxLength={100} />
                        </Form.Item>
                    </Descriptions.Item>
                    <div>
                        <Button size="small" type="primary"  htmlType="submit">修改</Button>
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
    let { ffixField : { meetIntervalValue } } = orgdata;
    let ftime = "";
    if( isValidVariable(text) && text.length > 12 ){
        ftime = getTimeAndStatus(text)
    }
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title="过点时间修改"
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
            getContainer={false}
        >
            {/*200不满足间隔*/}
            {
                meetIntervalValue === "200" && ftime !== ""
                    ? <div className="interval" title={text}><span  className="interval_red">{ftime}</span></div>
                    : ""
            }
            {
                meetIntervalValue === "100"&& ftime !== ""
                    ? <div className="interval" title={text} ><span  className="interval_green">{ftime}</span></div>
                    : ""
            }
            {
                ( meetIntervalValue === null || meetIntervalValue === "null" ) && ftime !== ""
                    ? <div className="interval" title={text} ><span  className="">{ftime}</span></div>
                    : ""
            }

        </Popover >
    )
}

//CTO右键协调框
const CTOPopover = (props) => {
    let {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    if( !isValidVariable(text) ){
        text = "";
    }
    let ctoField = orgdata.ctoField || {};
    let source = ctoField.source || "";
    let sourceCN = FlightCoordination.getSourceZh( source );
    return(
        <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`} title={`${text}-${sourceCN}`}>
                <span className="">{getTimeAndStatus(text)}</span>
            </div>
        </div>
    )
}

//ATOT右键协调框
const ATOTPopover = (props) => {
    let {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    const fmeToday = orgdata.fmeToday;
    let bgStatus = "";
    if ( FmeToday.hadDEP(fmeToday) && isValidVariable(text) ) {
        bgStatus = "DEP";
    }
    return(
        <div className={`full-cell ATOT`}>
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${bgStatus}`} title={`${text}`}>
                <span className="">{ getDayTimeFromString(text) }</span>
            </div>
        </div>
    )
}

//EAWT右键协调框
const EAWTPopover = (props) => {
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let eapField = orgdata.eapField || {};
    let source = eapField.source || "";
    let value = eapField.value || "";
    let sourceCN = FlightCoordination.getSourceZh( source );
    return(
        <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
            <div className={`${ isValidVariable(value) ? "" : "empty_cell" } ${source}`} title={`${value}-${sourceCN}`}>
                <span className="">{getTimeAndStatus(value)}</span>
            </div>
        </div>
    )
}

//OAWT右键协调框
const OAWTPopover = (props) => {
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }

    let oapField = orgdata.oapField || {};
    let source = oapField.source || "";
    let value = oapField.value || "";
    let sourceCN = FlightCoordination.getSourceZh( source );

    return(
        <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
            <div className={`${ isValidVariable(value) ? "" : "empty_cell" } ${source}`} title={`${value}-${sourceCN}`}>
                <span className="">{getTimeAndStatus(value)}</span>
            </div>
        </div>
    )
}

export { FFIXTPopover, CTOPopover,  EAWTPopover, OAWTPopover, ATOTPopover }


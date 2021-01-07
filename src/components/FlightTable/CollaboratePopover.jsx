import {Button, Checkbox, DatePicker, Descriptions, Form, Input, Popover, Space} from "antd";
import React,{useCallback, useState, useEffect} from "react";
import { getDayTimeFromString, formatTimeString, getTimeAndStatus, isValidVariable } from 'utils/basic-verify'
import "./CollaboratePopover.scss"
import moment from "moment";
//航班号右键协调框
const FLIGHTIDPopover = (props) => {
    // let [ visible, setVisible ] = useState(false);
    const getContent = useCallback((record)  =>{
        return (
            <div className="clr_flightid">
                <button className="c-btn c-btn-blue">查看航班详情</button>
                <button className="c-btn c-btn-green" >标记豁免</button>
                <button className="c-btn c-btn-red ">取消豁免</button>
            </div>
        )
    })
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title=""
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
            // visible={visible}
            // onVisibleChange={ (curVisible) => {
            //     if( curVisible === true && visible === false){
            //         setVisible(true)
            //     }
            // }}
        >
            <div className="ddd">{props.opt.text}</div>
        </Popover >
    )
}
//禁止系统自动调整 表单
const changeOptions = [
    { label: '禁止系统自动调整', value: '1' }
];
//过点时间右键协调框
const FFIXTPopover = (props) => {
    // const getTitle = useCallback((opt)  =>{
    //     const {text, record, index, col} = opt;
    //     return record.FLIGHTID+"过点时间修改"
    // })
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        const {text, record, index, col} = opt;
        let { FFIXT, FLIGHTID, DEPAP, ARRAP } = record;
        FFIXT = FFIXT.substring(0,12);

        let initialValues = {
            flightid: FLIGHTID || '',
            airport: DEPAP + "-" + ARRAP,
            unit: "",
            locked: "",
            time: FFIXT.substring(8,12),
            date: moment( FFIXT.substring(0,8), "YYYY-MM-DD"),
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
                            <Checkbox.Group options={changeOptions} />
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
    let ftime = getTimeAndStatus(text)
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
                meetIntervalValue === "200"
                    ? <div className="interval" title={text}><span  className="interval_red">{ftime}</span></div>
                    : ""
            }
            {
                meetIntervalValue === "100"
                    ? <div className="interval" title={text} ><span  className="interval_green">{ftime}</span></div>
                    : ""
            }
            {
                meetIntervalValue === null || meetIntervalValue === "null"
                    ? <div className="interval" title={text} ><span  className="">{ftime}</span></div>
                    : ""
            }

        </Popover >
    )
}

//COBT右键协调框
const COBTPopover = (props) => {
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        const {text, record, index, col} = opt;
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
                            <Checkbox.Group options={changeOptions} />
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
                        <Button size="small"  type="primary" htmlType="submit">修改</Button>
                        <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                    </div>
                </Descriptions>

            </Form>


        )
    })

    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            // title={getTitle(props.opt)}
            title="预撤时间修改"
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
            getContainer={false}
        >
            <div className="empty_cell"><span className="">{getDayTimeFromString(props.opt.text)}</span></div>
        </Popover >
    )
}

//CTOT右键协调框
const CTOTPopover = (props) => {
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        let { text, record } = opt;
        let { FLIGHTID, DEPAP, ARRAP } = record;
        let time = "";
        let date = "";
        if( text.length >= 12 ){
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
                            <Checkbox.Group options={changeOptions} />
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
                        <Button size="small"  type="primary" htmlType="submit">修改</Button>
                        <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                    </div>
                </Descriptions>

            </Form>


        )
    })
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            // title={getTitle(props.opt)}
            title="预起时间修改"
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}
            getContainer={false}
        >
            <div className="empty_cell"><span className="">{getDayTimeFromString(props.opt.text)}</span></div>

        </Popover >
    )
}
export { FLIGHTIDPopover, FFIXTPopover, COBTPopover, CTOTPopover }
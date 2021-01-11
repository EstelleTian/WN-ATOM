import {Button, Checkbox, DatePicker, Descriptions, Form, Input, message as antdMessage, message, Popover} from "antd";
import React,{useCallback} from "react";
import { getDayTimeFromString, formatTimeString, getTimeAndStatus, isValidVariable } from 'utils/basic-verify'
import { FlightCoordination } from 'utils/flightcoordination.js'
import { request } from 'utils/request'
import "./CollaboratePopover.scss"
import moment from "moment";

const converSource = (source) => {
    let sourceCN = ""
    switch (source) {
        case 'ATOM': sourceCN = "引接ATOM";break;
        case 'NTFM': sourceCN = "引接NTFM";break;
        case 'MANUAL': sourceCN = "人工";break;
        case 'LOCK': sourceCN = "锁定";break;
        case 'AUTO': sourceCN = "自动";break;
    }
    return sourceCN;
}

//航班号右键协调框
const FLIGHTIDPopover = (props) => {
    //数据提交失败回调
    const requestErr =useCallback( (err, content) => {
        antdMessage.error({
            content,
            duration: 4,
        });
    })
    //数据提交成功回调
    const requestSuccess = useCallback( ( data, title ) => {
        console.log(title + '成功:',data);
        const { flightCoordination } = data;
        // this.flight
        message.success(title + '成功');
    });

    //标记豁免 取消标记豁免
    const handleExempty = useCallback(( urlKey, id, title )  =>{
        const data = {
            userId: "42",
            id,
            comment: "",
        };
        const opt = {
            url:'http://192.168.243.126:29891/'+urlKey,
            method:'POST',
            params: JSON.stringify( data ),
            resFunc: (data)=> requestSuccess(data, title),
            errFunc: (err)=> requestErr(err, title+'失败' ),
        };
        request(opt);
    })
    const getContent = useCallback((orgdata)  =>{
        let record = orgdata.record || {};
        let priority = record.priority || "";
        let id = record.id || "";
        return (
            <div className="clr_flightid">
                <button className="c-btn c-btn-blue">查看航班详情</button>
                {
                    priority === FlightCoordination.PRIORITY_EXEMPT
                    ? <button className="c-btn c-btn-red" onClick={ () => { handleExempty("flightExemptCancelRest", id, "取消豁免") } }>取消豁免</button>
                    : <button className="c-btn c-btn-green" onClick={ () => { handleExempty("flightExemptRest", id, "标记豁免") } }>标记豁免</button>
                }
            </div>
        )
    })
    const {text, record, index, col} = props.opt;
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
            <div className="ddd" title={text}>{text}</div>
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
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { cobtField : { source } } = orgdata;
    let sourceCN = converSource( source );
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
            <div className={`${ isValidVariable(text) ? "" : "empty_cell"} ${source}`} title={`${text}-${sourceCN}`}><span className="">{ getDayTimeFromString(text) }</span></div>
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
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { ctotField : { source } } = orgdata;
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
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" }`} title={`${text}-${source}`}><span className="">{getTimeAndStatus(text)}</span></div>

        </Popover >
    )
}

//CTO右键协调框
const CTOPopover = (props) => {
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { ctoField : { source } } = orgdata;
    let sourceCN = converSource( source );
    return(
        <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`} title={`${text}-${sourceCN}`}>
            <span className="">{getTimeAndStatus(text)}</span>
        </div>
    )
}

//EAPT右键协调框
const EAPTPopover = (props) => {
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { eapField : { source , value } } = orgdata;
    let sourceCN = converSource( source );
    return(
        <div className={`${ isValidVariable(value) ? "" : "empty_cell" }  ${source}`} title={`${text}-${sourceCN}`}>
            <span className="">{getTimeAndStatus(value)}</span>
        </div>
    )
}

//OAPT右键协调框
const OAPTPopover = (props) => {
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { eapField : { source , value } } = orgdata;
    let sourceCN = converSource( source );
    return(
        <div className={`${ isValidVariable(value) ? "" : "empty_cell" }  ${source}`} title={`${text}-${sourceCN}`}>
            <span className="">{getTimeAndStatus(value)}</span>
        </div>
    )
}
export { FLIGHTIDPopover, FFIXTPopover, COBTPopover, CTOTPopover, CTOPopover, EAPTPopover, OAPTPopover }
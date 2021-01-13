/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-13 10:00:18
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {Button, Checkbox, DatePicker, Descriptions, Form, Input, message as antdMessage, message, Popover} from "antd";
import React,{useCallback} from "react";
import { getDayTimeFromString, formatTimeString, getTimeAndStatus, isValidVariable } from 'utils/basic-verify'
import { FlightCoordination } from 'utils/flightcoordination.js'
import { request, requestGet } from 'utils/request'
import "./CollaboratePopover.scss"
import moment from "moment";
import {observer, inject} from "mobx-react";

const converSource = (source) => {
    let sourceCN = ""
    switch (source) {
        case 'ATOM': sourceCN = "引接ATOM";break;
        case 'NTFM': sourceCN = "引接NTFM";break;
        case 'MANUAL': sourceCN = "人工";break;
        case 'LOCK': sourceCN = "锁定";break;
        case 'AUTO': sourceCN = "自动";break;
        default: sourceCN = source;
    }
    return sourceCN;
}

//航班号右键协调框
let FLIGHTIDPopover = (props) => {
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
        // props.ta
        // this.flight
        message.success(title + '成功');
    });

    //标记豁免 取消标记豁免
    const handleExempty = useCallback(( type, record, title )  =>{
        const orgdata = record.orgdata || {};
        let orgFlight = JSON.parse(orgdata) || {};
        let urlKey = "";
        if( type === "exempt"){
            urlKey = "flightExempt";
            orgFlight.priority =FlightCoordination.PRIORITY_EXEMPT; //48
        }else if( type === "unexempt"){
            urlKey = "flightExemptCancel";
            orgFlight.priority =FlightCoordination.PRIORITY_NORMAL; //0
        }
        if( isValidVariable(urlKey) ){
            // console.log(JSON.stringify(orgFlight));
            let id = record.id || "";
            const opt = {
                url:'http://192.168.243.162:29891/'+urlKey,
                method: 'POST',
                params: {
                    userId: "13",
                    flightCoordination: orgFlight,
                    comment: "",
                },
                resFunc: (data)=> requestSuccess(data, title),
                errFunc: (err)=> requestErr(err, title+'失败' ),
            };
            request(opt);
        }

    })
    const getContent = useCallback((orgdata)  =>{
        let record = orgdata.record || {};
        let priority = record.priority || "";

        return (
            <div className="clr_flightid">
                <button className="c-btn c-btn-blue">查看航班详情</button>
                {
                    priority === FlightCoordination.PRIORITY_EXEMPT
                        ? <button className="c-btn c-btn-red" onClick={ () => { handleExempty("unexempt", record, "取消豁免") } }>取消豁免</button>
                        : <button className="c-btn c-btn-green" onClick={ () => { handleExempty( "exempt", record, "标记豁免") } }>标记豁免</button>
                }
            </div>
        )
    })
    const {text, record, index, col} = props.opt;
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={record.FLIGHTID}
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
            <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
                <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`} title={`${text}-${sourceCN}`}>
                    <span className="">{getTimeAndStatus(text)}</span>
                </div>
            </div>
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
    let sourceCN = converSource( source );
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
            <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
                <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`} title={`${text}-${sourceCN}`}>
                    <span className="">{getTimeAndStatus(text)}</span>
                </div>
            </div>
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
    let { ctoField : { source } } = orgdata;
    let sourceCN = converSource( source );
    return(
        <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`} title={`${text}-${sourceCN}`}>
                <span className="">{getTimeAndStatus(text)}</span>
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
    let { eapField : { source , value } } = orgdata;
    let sourceCN = converSource( source );
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
    let { oapField : { source , value } } = orgdata;
    let sourceCN = converSource( source );
    return(
        <div className={`full-cell ${ isValidVariable(text) ? source : "" }`}>
            <div className={`${ isValidVariable(value) ? "" : "empty_cell" } ${source}`} title={`${value}-${sourceCN}`}>
                <span className="">{getTimeAndStatus(value)}</span>
            </div>
        </div>
    )
}

//ALARM 右键协调框
const ALARMPopover = (props) => {
    const {text, record, index, col} = props.opt;
    if( isValidVariable(record) ){
        let { orgdata } = record;
        if( isValidVariable(orgdata) ){
            orgdata = JSON.parse(orgdata);
        }
        let { priority } = orgdata;
        return(
            <div className={`full-cell`}>

            </div>
        )
    }
    return ""

}
inject("flightTableData")(observer(FLIGHTIDPopover))
export { FLIGHTIDPopover, FFIXTPopover, COBTPopover, CTOTPopover, CTOPopover, ALARMPopover, EAWTPopover, OAWTPopover }


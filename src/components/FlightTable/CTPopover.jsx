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
import {  isValidVariable, getDayTimeFromString, getTimeAndStatus } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { request, requestGet } from 'utils/request'
import moment from "moment";
import {observer, inject} from "mobx-react";
import FmeToday from "../../utils/fmetoday";


//CTOT COBT 右键协调框 通过 opt.col 列名 区分
const CTPopover = (props) => {
    const [autoChecked, setAutoChecked] = useState(true);
    // 内容渲染
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
            console.log( props.flightTableData.updateSingleFlight );
            const { flightCoordination } = data;
            props.flightTableData.updateSingleFlight( flightCoordination );
            message.success(title + '成功');
            // 创建事件
            const evt = document.createEvent("MouseEvents");
            // 初始化 事件名称必须是mousedown
            evt.initEvent("mousedown", true, true);
            // 触发, 即弹出文字
            document.dispatchEvent(evt);
        });
        //表单提交
        const formSubmit = ( values ) =>{
            const newStartTime =  moment(values.startTime).format('YYYYMMDD'); //日期转化
            const { record } = props.opt;
            const orgdata = record.orgdata || {};
            let orgFlight = JSON.parse(orgdata) || {}; //航班fc
            const userId = props.systemPage.user.id || '14';
            const timestr = newStartTime + "" + values.time;

            orgFlight.locked = autoChecked ? 1 : "";

            let urlKey = "";
            if( col === "COBT"){
                orgFlight.cobtField.value = timestr;
                urlKey = "updateCobt";
            }else if( col === "CTOT"){
                orgFlight.ctotField.value = timestr;
                urlKey = "updateCtot";
            }
            //传参
            const params = {
                userId: userId,
                flightCoordination: orgFlight, //航班原fc
                comment: values.comment,  //备注
            }
            console.log(params);
            const opt = {
                url:'http://192.168.243.162:28089/flight/'+urlKey,
                method: 'POST',
                params: {
                    userId: userId,
                    flightCoordination: orgFlight,
                    comment: "",
                },
                resFunc: (data)=> requestSuccess(data, title),
                errFunc: (err)=> requestErr(err, title+'失败' ),
            };
            request(opt);
        }

        return (
            <Form
                // form={form}
                size="small"
                onFinish={ formSubmit }
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
                        <Button size="small"  type="primary" htmlType="submit">修改</Button>
                        <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                    </div>
                </Descriptions>

            </Form>
        )
    });
    const {opt} = props;
    const {text, record, col} = opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let field = {};
    let title = "";
    if( col === "COBT"){
        field = orgdata.cobtField || {};
        title = "预撤时间修改";
    }else if( col === "CTOT"){
        field = orgdata.ctotField || {};
        title = "预起时间修改";
    }
    let source = field.source || "";
    let sourceCN = FlightCoordination.getSourceZh( source );

    const fmeToday = orgdata.fmeToday;
    let bgStatus = "";
    let content = "";
    if ( FmeToday.hadDEP(fmeToday) && isValidVariable(text) ) {
        bgStatus = "DEP";
        content = "";
        title = "航班已起飞"
    }else{
        content = getContent(props.opt);
    }
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={title}
            content={  content  }
            trigger={[`contextMenu`]}
            getContainer={false}
        >
            <div className={`full-cell ${ isValidVariable(text) ? source : "" } ${col}_${bgStatus}`}>
                <div className={`${ isValidVariable(text) ? "" : "empty_cell" } ${source}`}
                     title={`${text}-${sourceCN}-${ bgStatus === "DEP" ? "已起飞" : "" }`}>
                    <span className="">{getTimeAndStatus(text)}</span>
                </div>
            </div>
        </Popover >

    )
}


export default inject( "systemPage")(observer(CTPopover))


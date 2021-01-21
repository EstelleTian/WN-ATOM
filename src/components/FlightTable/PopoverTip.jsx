/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-01-21 12:17:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
import {
    message,
    Popover,
    Button,
    Form,
    Descriptions,
    Input,
    DatePicker,
    Checkbox,
    Tooltip
} from "antd";
import {observer, inject} from "mobx-react";
import { request } from 'utils/request'
import React,{ useCallback, useState, useEffect } from "react";
import {  isValidVariable  } from 'utils/basic-verify'
import { closePopover, cgreen, cred  } from 'utils/collaborateUtils.js'

import moment from "moment";


 //popover和tip组合协调窗口
const PopoverTip = ( props ) => {
    const [autoChecked, setAutoChecked] = useState(true);
    
    const [ tipObj, setTipObj] = useState({
        visible: false,
        title: "",
        color: ""
    });
    const { title } = props;
    const { record, col } = props.opt;

    useEffect(function(){
        if( tipObj.visible ){
            setTimeout(function(){
                setTipObj({
                    ...tipObj,
                    visible: false
                });
            }, 1000)
        }

    }, [tipObj.visible, props.visible] );
    // 内容渲染
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        let { text, record, col } = opt;
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
            setTipObj({
                visible: true,
                title: content,
                color: cred
            });
            //关闭协调窗口popover
            closePopover();
        })
        //数据提交成功回调
        const requestSuccess = useCallback( ( data, title ) => {
            console.log(title + '成功:',data);
            console.log( props.flightTableData.updateSingleFlight );
            const { flightCoordination } = data;
            props.flightTableData.updateSingleFlight( flightCoordination );
            setTipObj({
                visible: true,
                title: title + '成功',
                color: cgreen
            });
            //关闭协调窗口popover
            closePopover();
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
            let url = "";
            if( col === "COBT"){
                orgFlight.cobtField.value = timestr;
                urlKey = "updateCobt";
                url = 'http://192.168.243.162:28089/flight/'+urlKey;
            }else if( col === "CTOT"){
                orgFlight.ctotField.value = timestr;
                urlKey = "updateCtot";
                url = 'http://192.168.243.162:28089/flight/'+urlKey; //张浩东ip
            }else if( col === "TOBT"){
                orgFlight.tobtField.value = timestr;
                urlKey = "updateTobtApply";
                url = 'http://192.168.243.8:28089/flight/'+urlKey; //薛满林ip
            }
            //传参
            const params = {
                userId: userId,
                flightCoordination: orgFlight, //航班原fc
                comment: values.comment,  //备注
            }
            console.log(params);
            const opt = {
                url,
                method: 'POST',
                params: params,
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
                        {
                            (opt.col === "TOBT" ) 
                            ? <div>
                                <Button size="small" className="c-btn c-btn-yellow"  type="primary" htmlType="submit">申请</Button>
                              </div>
                            : <div>
                                <Button size="small"  type="primary" htmlType="submit">修改</Button>
                                <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                            </div>
                        }
                        
                </Descriptions>

            </Form>
        )
    });
    const content = getContent(props.opt);
    return (
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={ title }
            content={  content  }
            trigger={[`contextMenu`]}
            getContainer={false}
            onVisibleChange = {(visible) => {
                if( visible && col === "TOBT" ){
                    let { COBT, CTOT, CTO } = record;
                    if( isValidVariable(COBT) && isValidVariable(CTOT) && isValidVariable(CTO) ){
                        setTipObj({
                            visible: true,
                            title: "调整TOBT,会清空COBT/CTD,造成航班向后移动",
                            color: cred
                        });
                    }
                
                }
            }}
        >
            <Tooltip  title={ tipObj.title } visible={ tipObj.visible } color={ tipObj.color } >
                { props.textDom }
            </Tooltip>
        </Popover >
    )


}

export default inject( "systemPage", "flightTableData")(observer(PopoverTip));
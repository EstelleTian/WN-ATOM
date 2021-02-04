/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-02-02 20:38:56
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
import { CollaborateUrl, CollaborateIP } from 'utils/request-urls'
import { REGEXP } from 'utils/regExpUtil'
import React,{ useCallback, useState, useEffect } from "react";
import {  isValidVariable, getFullTime  } from 'utils/basic-verify'
import { closePopover, cgreen, cred  } from 'utils/collaborateUtils.js'

import moment from "moment";


 //popover和tip组合协调窗口
const PopoverTip = ( props ) => {
    const [autoChecked, setAutoChecked] = useState(true);
    const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
    const [refuseBtnLoading, serRefuseBtnLoading] = useState(false);
    
    const [ tipObj, setTipObj] = useState({
        visible: false,
        title: "",
        color: ""
    });
    const { title } = props;
    const { record, col } = props.opt;
    const approve = props.approve || {};


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
        const [form] = Form.useForm();
        let { text, record, col } = opt;
        let { FLIGHTID, DEPAP, ARRAP, orgdata } = record;
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

        if( col === "TOBT" && approve.flag ){
            initialValues = {
                flightid: FLIGHTID || '',
                airport: DEPAP + "-" + ARRAP,
                applyComment: "", //申请备注
                applyTime: "", 
                comment: "", //批复备注
                date: moment( new Date(), "YYYY-MM-DD"),
                orgTime: "",
                time: getFullTime(new Date(), 3),
            }
        }

        //数据提交失败回调
        const requestErr =useCallback( (err, content) => {
            setTipObj({
                visible: true,
                title: content,
                color: cred
            });
            setSubmitBtnLoading(false);
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
            setSubmitBtnLoading(false);
            //关闭协调窗口popover
            closePopover();
        });

        const onCheck = async () => {
            try {
              const values = await form.validateFields();
              console.log('Success:', values);
              setSubmitBtnLoading(true)
              const newStartTime =  moment(values.startTime).format('YYYYMMDD'); //日期转化
              const { record } = props.opt;
              const orgdata = record.orgdata || {};
              let orgFlight = JSON.parse(orgdata) || {}; //航班fc
              const userId = props.systemPage.user.id || '14';
              const timestr = newStartTime + "" + values.time;
              console.log(timestr);
              orgFlight.locked = autoChecked ? 1 : "";
              
              let urlKey = "";
              let url = "";
              if( col === "COBT"){
                  orgFlight.cobtField.value = timestr;
                  urlKey = "/updateCobt";
                  url = CollaborateUrl.cobtUrl +urlKey;
              }else if( col === "CTOT"){
                  orgFlight.ctotField.value = timestr;
                  urlKey = "/updateCtot";
                  url = CollaborateUrl.ctotUrl + urlKey; 
              }else if( col === "TOBT"){
                  orgFlight.tobtField.value = timestr;
                  urlKey = "/flight/updateTobtApply";
                  url = CollaborateIP + '/flight'+urlKey; 
              }
              //传参
              let params = {
                  userId: userId,
                  flightCoordination: orgFlight, //航班原fc
                  comment: values.comment,  //备注
                  taskId: ""
              }
              if( col === "TOBT"){
                params["tobtValue"] = timestr;
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
            } catch (errorInfo) {
              console.log('Failed:', errorInfo);
            }
          };

        //TOBT批复
        if( col === "TOBT" ){
            if( approve.flag ){
                return (
                    <Form
                        form = {form}
                        size="small"
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
                            <Descriptions.Item label="原始">
                                <Form.Item
                                    name="orgTime"
                                >
                                    <Input disabled/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="申请">
                                <Form.Item
                                    name="applyTime"
                                >
                                    <Input disabled/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="申请备注">
                                <Form.Item
                                    name="applyComment"
                                >
                                    <Input.TextArea maxLength={100} />
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
                                    rules = {[
                                        {
                                            type: 'string',
                                            pattern: REGEXP.TIMEHHmm,
                                            message: "请输入有效的开始时间"
                                        },
                                        {
                                            required: true,
                                            message: "请输入开始时间"
                                        }
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="批复备注">
                                <Form.Item
                                    name="comment"
                                >
                                    <Input.TextArea maxLength={100} />
                                </Form.Item>
                            </Descriptions.Item>
                            <div>
                                <Button loading={submitBtnLoading} size="small" className="c-btn c-btn-green" type="primary" 
                                    onClick={ e=> {
                                        onCheck(e,"approve");
                                    }}
                                >批复</Button>
                                <Button loading={refuseBtnLoading} size="small" className="c-btn c-btn-red" type="primary" style={{marginLeft: '8px'}}  
                                onClick={ e=> {
                                    onCheck(e,"refuse");
                                }}
                                >拒绝</Button>
                            </div>
                                
                        </Descriptions>
        
                    </Form>
                )
            }
        }
        

        return (
            <Form
                form={form}
                size="small"
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
                            rules = {[
                                {
                                    type: 'string',
                                    pattern: REGEXP.TIMEHHmm,
                                    message: "请输入有效的开始时间"
                                },
                                {
                                    required: true,
                                    message: "请输入开始时间"
                                }
                            ]}
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
                                <Button loading={submitBtnLoading} size="small" className="c-btn c-btn-yellow"  
                                type="primary" 
                                    onClick={ e=> {
                                        onCheck(e,"apply");
                                    }}
                                >申请</Button>
                              </div>
                            : <div>
                                <Button loading={submitBtnLoading} size="small"  type="primary" 
                                    onClick={ e=> {
                                        onCheck(e, "");
                                    }}
                                >修改</Button>
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
                if( visible && col === "TOBT" && approve.flag !== true ){
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
/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-04 11:22:42
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Suspense, useCallback, useState, useEffect, useMemo, useRef} from 'react';
import { Table, Spin, message, Popconfirm, Form, Modal, Button, Input, DatePicker, Descriptions  } from 'antd';
import {inject, observer} from "mobx-react";
import ModalBox from 'components/ModalBox/ModalBox';
import { isValidVariable } from "utils/basic-verify";
import { REGEXP } from 'utils/regExpUtil'
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request  } from "utils/request";
import { getFullTime, getDayTimeFromString  } from "utils/basic-verify";
import './TodoTable.scss';

//根据key识别列表列配置columns
const names = {
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"航班号",
        width: 80,
    },
    "TYPE":{
        "en":"TYPE",
        "cn":"待办类型",
        width: 80,
    },
    "ORIGINAL":{
        "en":"ORIGINAL",
        "cn":"原始值",
        width: 70,
    },
    "VALUE":{
        "en":"VALUE",
        "cn":"协调值",
        width: 70,
    },
    "USER":{
        "en":"USER",
        "cn":"发起人",
        width: 100,
    },
    "TIMESTAMP":{
        "en":"TIMESTAMP",
        "cn":"发起时间",
        width: 80,
    },
    "COMMENT":{
        "en":"COMMENT",
        "cn":"备注",
        width: 80,
    },
    "OPTIONS":{
        "en":"OPTIONS",
        "cn":"操作",
        width: 110,
    },
}

const TOBTModal = (props) => {
    const form = Form.useForm();
    const { setTobtModalVisible, tobtModalVisible } = props;
    const flight = props.flight || {};
    const flightid = flight.flightid || "";
    const tobtFiled = flight.tobtFiled || {};
    const applyTime = tobtFiled.value || "";

    let initialValues = {
        flightid: flightid,
        applyTime: applyTime,
        date: "",
        time: "",
    }

    console.log(initialValues);
    
    return (
        <Modal
        title={`TOBT申请`}
        centered
        visible={ tobtModalVisible }
        onOk={() => {} }
        onCancel={() => {} }
        width={500}
        maskClosable={false}
        destroyOnClose = { true }
        footer = {
            <div>
                <Button type="primary" onClick={ ()=>{
                    setTobtModalVisible(false)
                } }>申请</Button>
                <Button  onClick={ ()=>{
                    setTobtModalVisible(false)
                } }>取消</Button>
            </div>
        }
    >
        <div>
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
                <Descriptions.Item label="原TOBT">
                    <Form.Item
                        name="applyTime"
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
                                message: "请输入有效的时间"
                            },
                            {
                                required: true,
                                message: "请输入时间"
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>

        </Form>
        </div>
    </Modal> 
    )

}


const TodoTable = (props) => {
    const [tableWidth, setWidth] = useState(0);
    const [tableHeight, setHeight] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ popVisible, setPopVisible ] = useState(false); //气泡确认框
    const [ tobtModalVisible, setTobtModalVisible] = useState(false); //TOBT修改确认框
    const [ tobtFlight, setTobtFlight] = useState({}); //TOBT 航班对象
    
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const [ subTableData, setSubTableData ] = useState([]);
    
    const generateTime = useRef(0);
    const timerId = useRef();



    const user = props.systemPage.user || {};

   

    //获取待办工作请求
    const requestDatas = useCallback((triggerLoading) => {
        if( !isValidVariable(user.id) ){
            return;
        }
        if( triggerLoading ){
            setLoading(true);
        }
       
        let url = ReqUrls.todoListUrl+user.username;

        const opt = {
            url,
            method: 'GET',
            resFunc: (data)=> {
                //更新工作流数据
                handleTasksData(data);
                setLoading(false);
                setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '待办工作数据获取失败' );
                setLoading(false);
                setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    },[user.id]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);
    
    //处理 待办工作 数据
    const handleTasksData = useCallback((data) => {
       console.log(data);
       let tableData = [];
       const backLogTasks = data.backLogTasks || {};
       const gTime = data.generateTime || "";
       generateTime.current = gTime;
       for(let key in backLogTasks){
           const backLogTask = backLogTasks[key] || {}; //流水号
           const flight = backLogTask.flight || {};
           const flightid = flight.flightid || "";
           const task = backLogTask.task || {};
           const instance = task.instance || {};
           const processVariables = instance.processVariables || {};
           const agree = processVariables.agree || false;
           const flightCoorType = processVariables.flightCoorType || "";
           const sourceVal = processVariables.sourceVal || "";
           const targetVal = processVariables.targetVal || "";
           const businessName = processVariables.businessName || "";
           const startUserName = instance.startUserName || "";
           let startTime = instance.startTime || "";
           

           let options = {
                key,
                flightCoorType,
                agree,
                flight
           }
           
           let obj = {
                key: key,
                FLIGHTID: flightid,
                TYPE: flightCoorType,
                ORIGINAL: sourceVal,
                VALUE: targetVal,
                USER: startUserName,
                TIMESTAMP: startTime,
                COMMENT: businessName,
                OPTIONS: JSON.stringify(options),    
            }
            tableData.push(obj);
       }
       setSubTableData(tableData)
    },[]);

    //数据提交成功回调
    const requestSuccess = useCallback( ( data, content, key ) => {
        //重新请求数据
        requestDatas(true);

        message.success({
            content,
            duration: 4,
        });

    });


    //处理 操作 同意/拒绝
    const sendResultRequest = ( type, text = "") => {
        const userId = props.systemPage.user.id || '';
        if( !isValidVariable(userId) ){
            return;
        }
        const dataObj = JSON.parse(text);
        const flightCoorType = dataObj.flightCoorType || '';
        const key = dataObj.key || {}; //流水号
        const flight = dataObj.flight || {};
        let params = {
            userId: userId,
            flightCoordination: flight, //航班原fc
            comment: "",  //备注
            taskId: key
        }

        let url = "";
        let title = "";
        if(flightCoorType === "TOBT"){
            if(type === "agree"){
                //TOBT同意
                url = CollaborateIP+"/flight/updateTobtApprove";
                title = "同意TOBT申请"
            }else if(type === "refuse"){
                //TOBT拒绝
                url = CollaborateIP+"/flight/denyTobtApprove";
                title = "拒绝TOBT申请"
            }
        }else if(flightCoorType === "INPOOL"){
            if(type === "agree"){
                //入等待池同意
                url = CollaborateIP+"/flightPutPoolConsent";
                title = "同意入池申请"
            }else if(type === "refuse"){
                //入等待池拒绝
                url = CollaborateIP+"/flightPutPoolDown";
                title = "拒绝入池申请"
            }
        }else if(flightCoorType === "OUTPOOL"){
            if(type === "agree"){
                //出等待池同意
                url = CollaborateIP+"/flightOutPoolConsent";
                title = "同意出池申请"
                //TODO 要验证TOBT和当前时间比较
                params["type"] = "";
                params["tobt"] = "";

                // const curTime = generateTime.current || 0;
                // const tobtTime = flight.tobtFiled.value || 0;
                // if( isValidVariable(curTime) && isValidVariable(tobtTime) ){
                //     if( tobtTime*1 < curTime*1 ){
                //         //提示要先调整tobt再操作
                //         setPopVisible(true);
                //         setTobtFlight(flight);
                //         return;
                //     }
                // }

            }else if(type === "refuse"){
                //出等待池拒绝
                url = CollaborateIP+"/flightOutPoolDown";
                title = "拒绝出池申请"
            }
        }else if(flightCoorType === "EXEMPT"){
            if(type === "agree"){
                //豁免同意
                url = CollaborateIP+"/flightPriorityApproveRest";
                title = "同意豁免申请"
            }else if(type === "refuse"){
                //豁免拒绝
                url = CollaborateIP+"/flightPriorityRefuseRest";
                title = "拒绝豁免申请"
            }
        }else if(flightCoorType === "UNEXEMPT"){
            if(type === "agree"){
                //取消豁免同意
                url = CollaborateIP+"/flightPriorityApproveRest";
                title = "flightCancelAgree"
            }else if(type === "refuse"){
                //取消豁免拒绝
                url = CollaborateIP+"/flightCancelRefused";
                title = "拒绝取消豁免申请"
            }
        }

        if( isValidVariable(url) ){
            const opt = {
                url,
                method: 'POST',
                params: params,
                resFunc: (data)=> requestSuccess(data, title + '成功', key),
                errFunc: (err)=> requestErr(err, title + '失败' ),
            };
            request(opt);
        }
        

    }
    const getColumns = useMemo( function(){
        //表格列配置-默认-计数列
        let columns = [];
        //生成表配置-全部
        for(let key in names){
            const obj = names[key];
            const en = obj["en"];
            const cn = obj["cn"];
            const width = obj["width"];
            let tem = {
                title: cn,
                dataIndex: en,
                align: 'center',
                key: en,
                width: width,
                ellipsis: true,
                className: en,
                showSorterTooltip: false ,
                onHeaderCell: ( column ) => {
                    //配置表头属性，增加title值
                    return {
                        title: cn
                    }
                }
            }
            //发起时间排序
            if( en === "TIMESTAMP" ){
                tem["defaultSortOrder"] ='ascend';
                tem["render"] = (text, record, index) => {
                    const time = getFullTime( new Date(text), 2 )
                    return <div title={time}>{ time }</div>;
                }
            }
            //待办类型
            if( en === "TYPE" ){
                tem["render"] = (text, record, index) => {
                    let type = text;
                    switch( text ){
                        case "EXEMPT": type = "申请豁免"; break;
                        case "UNEXEMPT": type = "取消申请豁免"; break;
                        case "INPOOL": type = "申请入池"; break;
                        case "OUTPOOL": type = "申请出池"; break;
                        case "TOBT": type = "申请TOBT"; break;
                    }
                    return <div title={type}>{ type }</div>;
                }
            }
    
            if( en === "FLIGHTID" ){
                tem["width"] = 80;
                tem["fixed"] = 'left'
            }
            if( en === "ORIGINAL" || en === "VALUE" ){
                // tem["fixed"] = 'right'
                tem["render"] = (text, record, index) => {
                    if( text.length >= 12 && text*1 > 0){
                        return <div title={text}>{getDayTimeFromString(text)}</div>
                    }

                    return <div title={text}>{text}</div>;
                }
            }
    
            if( en === "OPTIONS" ){
                // tem["fixed"] = 'right'
                tem["render"] = (text, record, index) => {
                    return (
                        <div>
                            <a className="todo_opt_btn todo_agree" style={{paddingRight: '10px'}} onClick={ e =>{
                                sendResultRequest("agree", text);
                                
                                // setPopVisible(true);
                                e.stopPropagation();
                            } }>同意</a>
                            <a className="todo_opt_btn todo_refuse" onClick={ e =>{
                                sendResultRequest("refuse", text);
                                 e.stopPropagation();
                             } }>拒绝</a>
                        </div>
                    );
                }
            }
    
            //隐藏列
            if( en === "orgdata" ){
                tem["className"] = "notshow";
                tem["width"] = 0
            }
            columns.push(tem)
        }
        return columns;
    }, [popVisible]);

    useEffect(()=>{
        requestDatas(true);
        timerId.current = setInterval(()=>{
            requestDatas(false);
        }, 60*1000);
        return () => {
            clearInterval(timerId.current)
            timerId.current = null;
        }
    },[])

    useEffect(() => {
        const flightCanvas = document.getElementsByClassName("todo_canvas")[0];
        flightCanvas.oncontextmenu = function(){
            return false;
        };
        const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
        const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];

        let width = boxContent.offsetWidth;
        let height = boxContent.offsetHeight;
        // height -= 40;//标题高度“航班列表”
        // height -= 45;//表头高度
        height -= tableHeader.offsetHeight;//表头高度
        setWidth( width );
        setHeight( height );

    }, [tableWidth, tableHeight]);

    // useEffect(() => {
    //     const { id } = props.flightTableData.getSelectedFlight;
    //     const flightCanvas = document.getElementsByClassName( leftActiveName+"_canvas")[0];
    //     if( isValidVariable( id ) ){
    //         const trDom = flightCanvas.getElementsByClassName(id);
    //         if( trDom.length > 0 ){
    //             highlightRowByDom(trDom[0]);
    //         }else{
    //             const tableTBody = flightCanvas.getElementsByClassName("ant-table-tbody");
    //             const trs = tableTBody[0].getElementsByTagName("tr");
    //             clearHighlightRowByDom(trs);
    //         }
    //         scrollTopById(id, leftActiveName+"_canvas");          
    //     }
    // }, [ props.flightTableData.getSelectedFlight.id ]);



    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <ModalBox
                title={`待办航班列表`}
                showDecorator = {true}
                className={`sub_table_modal todo_canvas todo`}
            >
                <Table
                    columns={ getColumns }
                    dataSource={ subTableData }
                    size="small"
                    bordered
                    pagination={false}
                    loading={ loading }
                    scroll={{
                        x: tableWidth,
                        y: tableHeight
                    }}
                />
                {
                    tobtModalVisible &&
                    <TOBTModal 
                        flight={tobtFlight} 
                        setTobtModalVisible={setTobtModalVisible} 
                        tobtModalVisible={tobtModalVisible} 
                    />
                                   
                }
            </ModalBox>
        </Suspense>

    )

}

export default inject("systemPage")(observer(TodoTable))




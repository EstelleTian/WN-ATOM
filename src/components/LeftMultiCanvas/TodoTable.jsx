/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-02-23 09:55:17
 * @LastEditors: Please set LastEditors
 * @Description:左上切换模块 执行kpi 豁免航班 等待池 特殊航班 失效航班 待办事项
 * @FilePath: \WN-CDM\src\pages\FangxingPage\FangxingPage.jsx
 */
import React, {  Suspense, useCallback, useState, useEffect, useMemo, useRef} from 'react';
import { Table, Spin, message, Popconfirm, Form, Modal, Button, Input, DatePicker, Row, Col  } from 'antd';
import {inject, observer} from "mobx-react";
import { DoubleLeftOutlined, DoubleRightOutlined, SyncOutlined } from '@ant-design/icons';
import ModalBox from 'components/ModalBox/ModalBox';
import { REGEXP } from 'utils/regExpUtil'
import { ReqUrls, CollaborateIP } from "utils/request-urls";
import { requestGet, request  } from "utils/request";
import { getFullTime, getDayTimeFromString, isValidVariable, formatTimeString  } from "utils/basic-verify";
import { FlightCoordination  } from "utils/flightcoordination";
import { OptionBtn  } from "./OptionBtn";
import moment from "moment";
import './TodoTable.scss';


//TOBT修改框
const TOBTModal = (props) => {
    const [form] = Form.useForm();
    const { record = {}, tobtModalVisible, generateTime, setTobtModalVisible, userId } = props;
    let { flight = {}, key, flightCoorType } = record;
    const flightid = flight.flightid || "";
    const tobtFiled = flight.tobtFiled || {};
    const applyTime = tobtFiled.value || "";

    let now = null;

    if( isValidVariable(generateTime) && generateTime.length > 8 ){
        now = moment( generateTime.substring(0,8), "YYYY-MM-DD");
    }else{
        now = moment( new Date(), "YYYY-MM-DD");
    }
    console.log(generateTime, now);

    const save = async () => {
        try {
            let values = await form.validateFields();
            const date =  moment(values.date).format('YYYYMMDD'); //日期转化
            const time = values.time;
            const newTobt = date+''+time;

            //同意出池
            const url = CollaborateIP+"/flightOutPoolConsent";
            const title = "同意出池申请";
            if( isValidVariable(url) ){
                let params = {
                    userId: userId,
                    flightCoordination: flight, //航班原fc
                    comment: "",  //备注
                    taskId: key,
                    tobt: newTobt,
                    type: 'tobt'
                }
                const opt = {
                    url,
                    method: 'POST',
                    params: params,
                    resFunc: (data)=> props.requestSuccess(data, title + '成功', key),
                    errFunc: (err)=> {
                        if( isValidVariable(err) ){
                            props.requestErr(err, err )
                        }else{
                            props.requestErr(err, title + '失败' )
                        }
                    },
                };
                request(opt);
            }
            
        } catch (errInfo) {
            
        }
    };
    return (
        <Modal
        title={`TOBT修改`}
        centered
        visible={ tobtModalVisible }
        onOk={() => {} }
        onCancel={() => {
            setTobtModalVisible(false)
        } }
        width={340}
        maskClosable={false}
        destroyOnClose = { true }
        footer = {
            <div>
                <Button type="primary" onClick={ ()=>{
                    save();
                    setTobtModalVisible(false)
                } }>确认</Button>
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
            initialValues={{ 
                flightid,
                applyTime,
                date: now
             }}
        >
            <Row>
                <Col span={24} >
                    <Form.Item
                        label="航班号"
                        name="flightid"
                        className="tobt_inner_lable"
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px'}}>
                <Col span={24}>
                    <Form.Item
                        label="原TOBT"
                        name="applyTime"
                        className="tobt_inner_lable"
                    >
                        <Input disabled/>
                    </Form.Item>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px'}}>
                <Col span={16} >
                    <Form.Item
                        label="新TOBT"
                        name="date"
                        className="tobt_inner_lable"
                    >
                        <DatePicker  format="YYYY-MM-DD"/>
                    </Form.Item>
                </Col>
                <Col span={8} >
                    <Form.Item
                        label=""
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
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            
        </Form>
        </div>
    </Modal> 
    )

}

//TOBT询问框
const TOBTPop = (props) => {

    return <Popconfirm
        title="预关时间(TOBT)早于当前时间,请先调整预关时间(TOBT)"
        destroyTooltipOnHide={true}
        onConfirm={ () => {
            props.setTobtModalVisible(true);
            props.setTobtFlight(props.record);
        }}
        onCancel={ () => {
            
            
        }}
    >
        { props.children }
    </Popconfirm>
}

//待办事项列表 动态宽度扩展
const OutLineIcon = (props) => {
    const { tableTotalWidth = 1200 } = props;
    
    const [ extend, setExtend ] = useState(false);

    const extendCb = () => {
        const dom = document.querySelector(".left_left_top .todo_canvas");
        let classStr = dom.getAttribute("class")
        console.log("tableTotalWidth；", tableTotalWidth);
        if( !extend ){
            classStr += " extend_canvas"
            dom.style.width = (tableTotalWidth + 30 )+"px"
        }else{
            classStr = classStr.replace(/extend_canvas/, "");
            dom.style.width = "inherit"
        }
        dom.setAttribute("class", classStr);
        
        setExtend( !extend )
    }
    return (
        <div className='extend_icon'
            onClick={ extendCb }
        >
            {
                extend ? <DoubleLeftOutlined title="收起"/> : <DoubleRightOutlined  title="展开"/>
            }
        </div>
    )
}

    //获取屏幕宽度，适配 2k
    let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//根据key识别列表列配置columns
const names = {
    "OPTIONS":{
        "en":"OPTIONS",
        "cn":"操作",
        width: 130,
    },
    "TASKID":{
        "en":"TASKID",
        "cn":"流水号",
        width: 90,
    },
    "FLIGHTID":{
        "en":"FLIGHTID",
        "cn":"航班号",
        width: (screenWidth > 1920) ? 125 : 90,
    },
    "TYPE":{
        "en":"TYPE",
        "cn":"待办类型",
        width: 110,
    },
    "ORIGINAL":{
        "en":"ORIGINAL",
        "cn":"原始值",
        width: (screenWidth > 1920) ? 100 : 90,
    },
    "VALUE":{
        "en":"VALUE",
        "cn":"协调值",
        width: (screenWidth > 1920) ? 100 : 90,
    },
    "USER":{
        "en":"USER",
        "cn":"发起人",
        width: (screenWidth > 1920) ? 210 : 180,
    },
    "TIMESTAMP":{
        "en":"TIMESTAMP",
        "cn":"发起时间",
        width: 110,
    },
    "COMMENT":{
        "en":"COMMENT",
        "cn":"备注",
        width: (screenWidth > 1920) ? 260 : 220,
    },
    
}
const TodoTable = (props) => {
    const [tableWidth, setWidth] = useState(0);
    const [tableHeight, setHeight] = useState(0);
    const [ loading, setLoading ] = useState(false);

    const [ tobtModalVisible, setTobtModalVisible] = useState(false); //TOBT修改确认框
    const [ tobtFlight, setTobtFlight] = useState({}); //TOBT record
    
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    
    const generateTime = useRef(0);
    const timerId = useRef();
    const tableTotalWidth = useRef();

    const user = props.systemPage.user || {};
    const userId = user.id || '';


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
           
           let taskId = "";
           const instanceTasks = task.instanceTasks || {};
           const instanceTasksKeys = Object.keys( instanceTasks );
           if( instanceTasksKeys.length > 0 ){
             taskId = instanceTasksKeys[0] || "";
           }
           

           let options = {
                key,
                flightCoorType,
                agree,
                flight,
                taskId
           }
           
           let obj = {
                key: key,
                TASKID: key,
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
       props.todoList.updateTodosData(tableData);
    },[]);

    //数据提交成功回调
    const requestSuccess = useCallback( ( data, content, key ) => {
        console.log("协调成功：",data)
        // const { flightCoordination = {} } = data;
        // props.flightTableData.updateSingleFlight( flightCoordination );
        //重新请求数据
        requestDatas(true);

        message.success({
            content,
            duration: 4,
        });

    });


    //处理 操作 同意/拒绝
    const sendResultRequest = ( type, text = "", setLoad) => {
        
        if( !isValidVariable(userId) ){
            return;
        }
        const dataObj = JSON.parse(text);
        const flightCoorType = dataObj.flightCoorType || '';
        const key = dataObj.key || ""; //流水号
        const taskId = dataObj.taskId || ""; //流水号
        const flight = dataObj.flight || {};
        let params = {
            userId,
            flightCoordination: flight, //航班原fc
            comment: "",  //备注
            taskId
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
                resFunc: (data)=> {
                    requestSuccess(data, title + '成功', key)
                    setLoad(false);
                },
                errFunc: (err)=> {
                    if( isValidVariable(err) ){
                        requestErr(err, err )
                    }else{
                        requestErr(err, title + '失败' )
                    }
                    setLoad(false);
                },
            };
            request(opt);
            
        }
        

    }
    const getColumns = useMemo( function(){
        let totalWidth = 0;
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
                tem["defaultSortOrder"] ='descend';
                tem["sorter"] = (a, b) => {
                    return a.TIMESTAMP*1 - b.TIMESTAMP*1;
                };
                tem["render"] = (text, record, index) => {
                    const time = getFullTime( new Date(text), 2 )
                    return <div title={time}>{ time }</div>;
                }
            }
            //待办类型
            if( en === "TYPE" ){
                // tem["fixed"] = 'left'
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
            
            if( en === "OPTIONS" ){
                // || en === "FLIGHTID" || en === "TASKID" 
                tem["fixed"] = 'left'
            }

            if( en === "ORIGINAL" || en === "VALUE" ){
                // tem["fixed"] = 'right'
                
                tem["render"] = (text, record, index) => {
                    const { TYPE } = record;
                    if( TYPE === 'TOBT' ){
                        if( text.length >= 12 && text*1 > 0){
                            return <div title={text}>{getDayTimeFromString(text)}</div>
                        }
                    }else if( TYPE === 'EXEMPT' ||  TYPE === 'UNEXEMPT' ){
                        return <div title={text}>{ FlightCoordination.getPriorityZh(text) }</div>
                    }else if( TYPE === 'INPOOL' ||  TYPE === 'OUTPOOL' ){
                        return <div title={text}>{ FlightCoordination.getPoolStatusZh(text) }</div>
                    }else{
                        if( text.length >= 12 && text*1 > 0){
                            return <div title={text}>{getDayTimeFromString(text)}</div>
                        }
                    }
                    
                    

                    return <div title={text}>{text}</div>;
                }
            }
    
            if( en === "OPTIONS" ){
                // tem["fixed"] = 'right'
                tem["render"] = (text, record, index) => {
                    const { TYPE, OPTIONS="{}" } = record;
                    let TOBTFlag = false;
                    if( TYPE === "TOBT" ){
                        const dataObj = JSON.parse(OPTIONS);
                        const flight = dataObj.flight || {};
                        const curTime = generateTime.current || 0;
                        const tobtTime = flight.tobtFiled.value || 0;
                        if( isValidVariable(curTime) && isValidVariable(tobtTime) ){
                            if( tobtTime*1 < curTime*1 ){
                                TOBTFlag = true;
                            }
                        }
                    }
                    
                    return (
                        <div>
                            {
                                TOBTFlag
                                ?  <TOBTPop setTobtModalVisible={setTobtModalVisible} record={JSON.parse(OPTIONS)} setTobtFlight={setTobtFlight} >
                                        <Button size="small" className="todo_opt_btn todo_agree c-btn-blue">同意</Button>
                                    </TOBTPop> 
                                : <OptionBtn type="agree" text="同意" callback = {
                                    (setLoad)=>{ 
                                        sendResultRequest("agree", text, setLoad) 
                                    }
                                } />
                                
                            }
                            <OptionBtn type="refuse" text="拒绝" callback = {
                                (setLoad)=>{ 
                                    sendResultRequest("refuse", text, setLoad) 
                                }
                            } />
                        </div>
                    );
                }
            }
    
            if( en === "FLIGHTID" || en === "USER" || en === "COMMENT" ){
                tem["render"] = (text, record, index) => {
                    return <div title={text} className="full_cell">{text}</div>
                }
            }
            totalWidth += tem.width*1;
            columns.push(tem)
        }
        tableTotalWidth.current = totalWidth;
        return columns;
    }, []);

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
        height -= 10;//表头高度
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

    // console.log( moment( generateTime.current.substring(0,8), "YYYY-MM-DD") ) ;

    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            
            <ModalBox
                title={`待办航班列表(${ formatTimeString(generateTime.current) })`}
                showDecorator = {true}
                className={`sub_table_modal todo_canvas todo`}
            >
                <div className='refresh_icon'
                    onClick = { () => {
                        requestDatas(true)  
                        setRefreshBtnLoading(true);
                    } } 
                >
                    <SyncOutlined title="刷新待办列表" spin={ refreshBtnLoading }  />
                </div>
                
                <OutLineIcon tableTotalWidth={tableTotalWidth.current}/>
                <Table
                    columns={ getColumns }
                    dataSource={ props.todoList.todos }
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
                        userId={userId}
                        record={tobtFlight} 
                        setTobtModalVisible={setTobtModalVisible} 
                        tobtModalVisible={tobtModalVisible} 
                        generateTime = {generateTime.current}
                        setTobtModalVisible = {setTobtModalVisible}
                        requestSuccess = {requestSuccess}
                        requestErr = {requestErr}
                    />
                                   
                }
            </ModalBox>
        </Suspense>

    )

}

export default inject("systemPage", "todoList", "flightTableData")(observer(TodoTable))




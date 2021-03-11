/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-03-11 14:13:15
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import {inject, observer} from 'mobx-react'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { message, Table, Input, Button, Popconfirm, Tooltip, Form, Spin  } from "antd";
import { isValidVariable, isValidObject, formatTimeString } from 'utils/basic-verify';
import { REGEXP } from 'utils/regExpUtil'
import { customNotice } from 'utils/common-funcs'
import { OptionBtn } from "components/Common/OptionBtn";
// import { data1, data24 } from '../../mockdata/static'
import './CapacityTable.scss'
const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;



const EditableRow = (props) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
      title,
      editing,
      children,
      dataIndex,
      record = {},
      handleSave,
      generateTime,
      ...restProps
  }) => {
    const orgData = useRef();
    const form = useContext(EditableContext);
    let cellClass = useMemo(function(){
        if(editing){
            let bgClass = "";
            const obj = record[dataIndex] || {};
            const source = obj.source || "";
            switch( source ){
                case "1" : {
                    bgClass = "alarm alarm_green";
                    break;
                }
                case "2" : {
                    bgClass = "alarm alarm_orange";
                    break;
                }
                case "3" : {
                    bgClass = "alarm alarm_red";
                    break;
                }
                case "wait" : {
                    bgClass = "alarm alarm_yellow";
                    break;
                }
                default: break;
            }
            return bgClass
        }else{
            return "";
        }
    },[editing, record]);
    
    let disabled = false;
    // console.log("generateTime ", generateTime)
    if( record.capacityTime*1 <= new Date().getHours() ){
        disabled = true
    }
    
    useEffect(()=>{
        const obj = record[dataIndex] || {};
        orgData.current = obj.value*1 || "";
        if(editing){
            const obj = record[dataIndex] || {};
            let val = obj.value*1;
            if( val === -1){
                if(disabled){
                    val = "-"
                }else{
                    val = ""
                }
                
            }
            
            form.setFieldsValue({
                [dataIndex]: val,
            });
        }
    },[ editing ])
    useEffect(() => {
        return ()=>{
            orgData.current = -1;
        }
    }, []);
    
    const save = async() => {
        let subvalues = await form.validateFields();
            for(let key in subvalues){
                let resObj = record[key];
                if( subvalues[key] === -1 || subvalues[key] === ""){
                    resObj["value"] = -1;
                }else{
                    resObj["value"] = subvalues[key]*1;
                }
                
            }
            handleSave(record);
    };
    
    let curVal = "";
    if( isValidObject(record) &&  record[dataIndex].value ){
        curVal = record[dataIndex].value*1;
    }
    let flag = ( orgData.current > 0 ) && ( curVal > 0 ) && ( orgData.current !== curVal );

    const inputNode = <Input onBlur={ save } disabled={disabled}/>;
    return (
        <td{...restProps}>
            <div className={cellClass} >
            {
            editing 
                ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        className={` ${ flag ? "yellow" : ""}`}
                        rules={[
                            {
                                pattern: REGEXP.NUMBER3,
                                message: "请输入0~999的整数"
                            },
                          ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) 
                : (
                    children
                )
            }
            </div>
        </td>
    );
};


 //处理列配置
 const getColumns = (type) => {
    const valRender = (text, record, index) => {
        let bgClass = "";
        let title = "";
        let showVal = text.value || "";
        if( showVal === -1){
            showVal = "-"
        }
        let source = "";
        if( text.hasOwnProperty("source") ){
             source = text.source || "";
            
            switch( source ){
                case "1" : {
                    bgClass = "alarm alarm_green";
                    title = "同比大于静态容量值";
                    break;
                }
                case "2" : {
                    bgClass = "alarm alarm_orange";
                    title = "同比静态容量值 小于等于20%";
                    break;
                }
                case "3" : {
                    bgClass = "alarm alarm_red";
                    title = "同比静态容量值 大于20%";
                    break;
                }
                case "wait" : {
                    bgClass = "alarm alarm_yellow";
                    showVal = text.originalValue || "";
                    title = (
                        <span>
                            <div>原&nbsp;&nbsp;&nbsp;&nbsp;值：{text.originalValue}</div>
                            <div>申请值：{text.value}</div>
                        </span>
                    );
                    break;
                }
                default: bgClass = "";  break;
            }
        }
        return <span className={bgClass} >
            {
                source === 'wait' 
                ? ( showVal !== '-' && showVal !== -1 ) ?
                    <Tooltip title={title} color="#164c69">
                    <span> {text.originalValue} -&gt; { text.value || ""} </span> 
                    </Tooltip>
                  : <span>{ showVal || ""}</span> 
                  
                : 
                <Tooltip title={title} color="#164c69">
                    <span>{ showVal || ""}</span>
                   { bgClass !== "" && <QuestionCircleOutlined className="cap_icon" />} 
                </Tooltip>
            }
                
            </span>
    }
    let cColumns = []
    if( type === "AIRPORT"){
        cColumns = [
            {
                title: "时间",
                dataIndex: "capacityTime",
                align: 'center',
                key: "capacityTime",
                fixed: 'left',
                width: (screenWidth > 1920) ? 30 : 30,
                render: (text, record, index) => {
                    if( text === "BASE" ){
                        return <span>全天</span>;
                    }
                    if( text*1 < 10){
                        text = '0'+text;
                    }
                    return <span>{text}时</span>
                }
            },
            {
                title: "小时最大起降架次",
                dataIndex: "capacityDetailsDepArr60",
                align: 'center',
                key: "capacityDetailsDepArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
                
            },
            {
                title: "小时最大起飞架次",
                dataIndex: "capacityDetailsDep60",
                align: 'center',
                key: "capacityDetailsDep60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "小时最大降落架次",
                dataIndex: "capacityDetailsArr60",
                align: 'center',
                key: "capacityDetailsArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大起降架次",
                dataIndex: "capacityDetailsDepArr15",
                align: 'center',
                key: "capacityDetailsDepArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大起飞架次",
                dataIndex: "capacityDetailsDep15",
                align: 'center',
                key: "capacityDetailsDep15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
            {
                title: "15分钟最大降落架次",
                dataIndex: "capacityDetailsArr15",
                align: 'center',
                key: "capacityDetailsArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            },
        ];
    }else{
        cColumns = [
            {
                title: "时间",
                dataIndex: "capacityTime",
                align: 'center',
                key: "capacityTime",
                fixed: 'left',
                width: (screenWidth > 1920) ? 30 : 30,
                render: (text, record, index) => {
                    if( text === "BASE" ){
                        return <span>全天</span>;
                    }
                    if( text*1 < 10){
                        text = '0'+text;
                    }
                    return <span>{text}时</span>
                }
            },
            {
                title: "小时容量值",
                dataIndex: "capacityDetailsDepArr60",
                align: 'center',
                key: "capacityDetailsDepArr60",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
                
            },
            {
                title: "15分钟容量值",
                dataIndex: "capacityDetailsDepArr15",
                align: 'center',
                key: "capacityDetailsDepArr15",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                render: valRender
                
            }
        ];
    }
    return cColumns;
}
//请求错误--处理
const requestErr = (err, content) => {
    message.error({
        content,
        duration: 10,
    });
}

const SaveBtn = function(props){
    const { save } = props;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const inputDom = useRef();
  
    const showPopconfirm = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      setConfirmLoading(true);
      const comment = inputVal;
      save(comment).then( res => {
        //    console.log("保存响应:",res);
           setConfirmLoading(false);
           setVisible(false);
           props.setEditable(false);
           setInputVal("")
      }).catch( err => {
            setConfirmLoading(false);
            setVisible(false);
            setInputVal("")
            // props.setEditable(false);
      })
    };
  
    const handleCancel = () => {
      setVisible(false);
    };
    const onChange = (e) => {
        setInputVal(e.target.value );
    };
    return (
        <Popconfirm
            title={(<div>
                <div>动态容量修改</div>
                <div style={{ fontSize: '1.2rem' }}>原因:</div>
                <Input.TextArea size="small" rows={3} value={inputVal} onChange={ onChange }
                    style={{
                        width: '300px',
                        marginTop: '0.5rem'
                    }}
                />
            </div>)}
            visible={visible}
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            <Button className="" type="primary" onClick={showPopconfirm}>提交 </Button>
        </Popconfirm>
    )
}

    
const ApproveBtn = function(props){
    const { type, username, hisTasks, hisInstance, updateWorkFlow } = props;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [inputVal, setInputVal] = useState("");
    const inputDom = useRef();
  
    const showPopconfirm = () => {
      setVisible(true);
    };
    //数据提交成功回调
    const requestSuccess = useCallback( ( data, content, key ) => {
        //重新请求数据
        updateWorkFlow();
        

        customNotice({
            type: 'success',
            message: content,
            duration: 8
        });

    });
     //处理 操作 同意/拒绝
     const sendResultRequest = ( type ) => {
        if( !isValidVariable(username) ){
            return;
        }
        const len = hisTasks.length;
        let taskId = ""
        if( len > 1 ){
            taskId = hisTasks[len-1].id || "";
        }
        const businessKey = hisInstance.businessKey || ""; //流程id
        const comment = inputVal;
        let url = "";
        let params = {
            businessKey, //流程id
            taskId,  //任务id
            comment,
        }
        let title = "动态容量调整";
        if(type === "agree"){
            //容量审核同意
            url = ReqUrls.capacityBaseUrl + "simulationTactics/approve/"+username;
        }else if(type === "refuse"){
            //容量审核拒绝
            url = ReqUrls.capacityBaseUrl + "simulationTactics/refuse/"+username;
        }else if(type === "reback"){
            //容量审核撤回
            url = ReqUrls.capacityBaseUrl + "simulationTactics/withdraw/"+username;
        }
        if( isValidVariable(url) ){
            const opt = {
                url,
                method: 'POST',
                params: params,
                resFunc: (data)=> {
                    requestSuccess(data, title + '成功')
                    setConfirmLoading(false);
                    setVisible(false);
                },
                errFunc: (err)=> {
                    if( isValidVariable(err) ){
                        requestErr(err, err )
                    }else{
                        requestErr(err, title + '失败' )
                    }
                    setConfirmLoading(false);
                    setVisible(false);
                },
            };
            request(opt);
            
        }
        

    }
  
    const handleOk = () => {
      setConfirmLoading(true);
      
      sendResultRequest(type) 
      
    //   save(comment).then( res => {
            
    //        setConfirmLoading(false);
    //        setVisible(false);
    //        props.setEditable(false);
    //        setInputVal("")
    //   }).catch( err => {
    //         setConfirmLoading(false);
    //         setVisible(false);
    //         setInputVal("");
    //   })
    };
  
    const handleCancel = () => {
      setVisible(false);
    };
    const onChange = (e) => {
        setInputVal(e.target.value );
    };
    return (
        <Popconfirm
            title={(<div>
                <div style={{ fontSize: '1.2rem' }}>请输入原因:</div>
                <Input.TextArea size="small" rows={3} value={inputVal} onChange={ onChange }
                    style={{
                        width: '300px',
                        marginTop: '0.5rem'
                    }}
                />
            </div>)}
            visible={visible}
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            { props.children( showPopconfirm ) }
        </Popconfirm>
    )
}

//设置表格行的 class
const setRowClassName = (record, index) => {
    let classStr = "";
    if( index % 2 === 0 ){
        classStr += " even";
    }else{
        classStr += " odd";
    }
    return classStr;
};

//动态容量配置
const CapacityTable = (props) => {
    const [ loading, setLoading ] = useState(false); 
    const [ tableData, setTableData ] = useState([]); 
    let [ tableHeight, setTableHeight ] = useState(0);
    let [ editable, setEditable] = useState(false);

    const { kind, airportName, paneType } = props;
    const username = props.systemPage.user.username;

    const handleSave = (row) => {
        const newData = [...tableData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
    };

    const updateOrgTableDatas = (kind, resolve, reject, comment = "") => {
            let tableDataObj = {};
            tableData.map( item => {
                const key = item.capacityTime || "";
                if( key !== ""){
                    tableDataObj[key] = item;
                }
            })
            //发送保存请求
            let url = ReqUrls.capacityBaseUrl;
            let title = "";
            //传参
            let capacityData = {};
            if( kind === "default" || kind === "static"){
                url += "static/updateCapacityStatic"
                capacityData = props.capacity.staticData;
                title = "静态容量"
            }else if( kind === "dynamic"){
                if( !isValidObject(props.systemPage.user) || !username){
                    return;
                }
                url += "simulationTactics/"+ username
                capacityData = props.capacity.dynamicData;
                title = "动态容量"
            }
            
            const opt = {
                url,
                method: 'POST',
                params: {
                    elementName: airportName,
                    capacityMap: tableDataObj,
                    comment,
                },
                resFunc: (data)=> {
                    // console.log(data);
                    const { capacityMap } = data;
                    for(let name in capacityMap){
                        const res = capacityMap[name] || {};
                        // console.log("更新表格数据 ",airportName)
                        props.capacity.updateDatas( kind, res );
                        //
                        props.capacity.forceUpdateDynamicWorkFlowData = true;
                    }
                    customNotice({
                        type: 'success',
                        message: title+'保存成功',
                        duration: 10,
                    });
                    resolve("success")
                },
                errFunc: (err, msg)=> {
                    if( isValidVariable(err) ){
                        title = err
                    }else{
                        title = title+'保存失败'
                    }
                    customNotice({
                        type: 'error',
                        message: title
                    });
                    resetOrgTableDatas();
                    reject("error")
                },
            };
            request(opt);
        
    }

    const resetOrgTableDatas = () => {
        const { capacity } = props;
        let obj = {};
        if( kind === "default" ){
            obj = {
                "data": capacity.defaultStaticData
            }
        }else if(kind === "static"){
            obj = {
                "data": capacity.customStaticData
            }
        }else if(kind === "dynamic"){
            obj = {
                "data": capacity.customDynamicData
            }
        }
        const dataArr = JSON.parse( JSON.stringify(obj)).data || [];
        setTableData( dataArr );
        
    }

    const mergedColumns = getColumns(paneType).map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: editable,
                handleSave,
                generateTime: props.capacity.generateTime
            }),
        };
    });

    const save = useCallback((comment)=>{
        return new Promise((resolve, reject) =>{
             //更新初始化数据
             updateOrgTableDatas(kind, resolve, reject, comment);
       })
    },
    [tableData]);

    const { hisInstance ={}, hisTasks =[], generateTime="", authMap={} } = useMemo( ()=> {
        const taskMap = props.capacity.dynamicWorkFlowData.taskMap || {};
        const generateTime = props.capacity.dynamicWorkFlowData.generateTime || {};
        const values = Object.values(taskMap) || [];
        if( values.length > 0 ){
            const taskObj = values[values.length-1] || {};
            const hisTasks = taskObj.hisTasks || [];
            const hisInstance = taskObj.hisInstance || [];
            const authMap = taskObj.authMap || {};
            return  { hisInstance, hisTasks, generateTime, authMap };
        }
        return [];
    }, [props.capacity.dynamicWorkFlowData])

    
    useEffect(() => {
        resetOrgTableDatas();
    }, [kind, props.capacity.staticData, props.capacity.dynamicData ]);

    useEffect(() => {
        if( props.type === "line1" ){
            setTableHeight(80)
         }else if( props.type === "line24" ){
            const dom = document.getElementsByClassName("modal_"+kind)
            const boxContent = dom[0].getElementsByClassName("box_content")
            let height = boxContent[0].offsetHeight - 65;
            if( tableHeight !== height ){
                setTableHeight( height );
            }
            
        }
    }, [tableHeight]);

    useEffect(()=>{
        props.capacity.setDynamicData( {}, "" );
    },[])

    let authBtn = () => {
        return (
            <div className="opt_btns">
                {
                    authMap.AGREE && <ApproveBtn 
                            username={username} 
                            hisTasks={hisTasks} 
                            hisInstance={hisInstance} 
                            type="agree"
                            updateWorkFlow={()=>{
                                props.capacity.forceUpdateDynamicWorkFlowData = true;
                                props.capacity.forceUpdateDynamicData = true;
                            }}
                        >
                        {
                            (showPopconfirm)=>{
                                return <Button  type="primary" text="同意"
                                className="todo_opt_btn todo_agree c-btn-blue"
                                onClick={showPopconfirm} >同意</Button>
                            }
                        }
                        
                    </ApproveBtn>
                }
                {
                    authMap.REFUSE && <ApproveBtn username={username} hisTasks={hisTasks} hisInstance={hisInstance}
                        updateWorkFlow={()=>{
                            props.capacity.forceUpdateDynamicWorkFlowData = true;
                            props.capacity.forceUpdateDynamicData = true;
                        }}
                    type="refuse">
                        {
                            (showPopconfirm)=>{
                                return <Button type="primary" text="拒绝"
                                className="todo_opt_btn todo_refuse c-btn-red"
                                onClick={showPopconfirm} >拒绝</Button>
                            }
                        }
                        
                    </ApproveBtn>
            
                }
                {
                    authMap.REBACK && <ApproveBtn username={username} hisTasks={hisTasks} hisInstance={hisInstance}
                        updateWorkFlow={()=>{
                            props.capacity.forceUpdateDynamicWorkFlowData = true;
                            props.capacity.forceUpdateDynamicData = true;
                        }}
                        type="reback">
                        {
                            (showPopconfirm)=>{
                                return <Button type="primary" text="撤回"
                                className="todo_opt_btn todo_reback c-btn-blue"
                                onClick={showPopconfirm} >撤回</Button>
                            }
                        }
                        
                    </ApproveBtn>
            
                }
                
                {
                    ( !authMap.AGREE && !authMap.REFUSE && !authMap.REBACK && !editable ) &&
                    <Button className="" type="primary" onClick={e =>{
                        setEditable(true);
                    }}>修改 </Button>
                }
                {
                    ( !authMap.AGREE && !authMap.REFUSE && !authMap.REBACK && editable ) &&
                    <span>
                        <SaveBtn save={save} setEditable={setEditable}/>
                        <Button className="reset" onClick={ e =>{
                            resetOrgTableDatas();
                            setEditable(false);
                        } }> 取消 </Button>
                    </span>
                }
            </div>
            )
        }

    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <div className="table_cont">
                {
                    kind === "dynamic" &&
                        authBtn()
                }
                
                {
                    tableData.length > 0 
                    && <Table
                            components={{
                                body: {
                                    row: EditableRow,
                                    cell: EditableCell,
                                },
                            }}
                            loading={ loading }
                            columns={ mergedColumns }
                            dataSource={ tableData }
                            size="small"
                            bordered
                            pagination={false}
                            scroll={{
                                x: 350,
                                y: tableHeight
                            }}
                            rowClassName={ setRowClassName }
                            className="capacity_number_table"
                        />
                }
                
                   
            </div>
        </Suspense>
      );

}


export default inject( "capacity", "systemPage" )(observer(CapacityTable))


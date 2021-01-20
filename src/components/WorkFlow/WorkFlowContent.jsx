import React, {useState, useEffect, useCallback } from 'react'
import { message, Button, Table, Spin } from "antd";
import { requestGet } from 'utils/request'
import { getFullTime, isValidVariable, isValidObject, millisecondToDate } from 'utils/basic-verify'
import './WorkFlowContent.scss'

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const columns = [
    {
        title: "",
        dataIndex: "rowNum",
        align: 'center',
        key: "rowNum",
        width: (screenWidth > 1920) ? 40 : 40,
        fixed: 'left',
        render: (text, record, index) => `第${index+1}步`
    },
    {
        title: "处理步骤",
        dataIndex: "handleStep",
        align: 'center',
        key: "handleStep",
        width: (screenWidth > 1920) ? 80 : 80,

    },
    {
        title: "处理人",
        dataIndex: "handler",
        align: 'center',
        key: "handler",
        width: (screenWidth > 1920) ? 165 : 165,
        render: (text, record, index) => {
            let odata = JSON.parse( record.orgdata );
            const startTime = odata.startTime || 0;
            const endTime = odata.endTime || 0;
            const durationInMillis = odata.durationInMillis || 0;
            return (
                <div className="handler">
                    <div className="handler_1">
                        <span style={{color: '#ec4747'}}>{text} </span>
                            <span className="handler"  style={{color: 'green'}}>[用时：{ millisecondToDate(durationInMillis) } ]</span>
                        {/*{*/}
                        {/*    index === 2*/}
                        {/*        ? <span className="handler"  style={{color: 'green'}}>[已转交下一步,用时：11分钟43秒 ]</span>*/}
                        {/*        : ""*/}
                        {/*}*/}
                        {/*{*/}
                        {/*    index === 3*/}
                        {/*        ? <span className="handler"  style={{color: 'orange'}}>[未接受办理]</span>*/}
                        {/*        : ""*/}
                        {/*}*/}
                        {/*{*/}
                        {/*    index !== 3 && index !== 2*/}
                        {/*        ? <span className="handler"  style={{color: 'green'}}>[已办结,用时：11分钟43秒 ]</span> : ""*/}
                        {/*}*/}

                    </div>
                    <div className="handler_2">开始于：{ getFullTime( new Date(startTime), 1 ) }</div>
                    {
                        index === 3
                            ? ""
                            : <div className="handler_3">结束于：{ getFullTime(new Date(endTime), 1) }</div>
                    }

                </div>
            )
        }
    },
    {
        title: "意见",
        dataIndex: "handleRes",
        align: 'center',
        key: "handleRes",
        width: (screenWidth > 1920) ? 60 : 60,
        render: (text, record, index) => {
            let odata = JSON.parse( record.orgdata );
            const taskLocalVariables = odata.taskLocalVariables || {};
            const agree = taskLocalVariables.agree || "";
            let agreeCN = "";
            let agreeColor = "";
            if( agree === "false" || agree === false ){
                agreeCN = "拒绝";
                agreeColor = '#ec4747';
            }else if( agree === "true" || agree === true ){
                agreeCN = "同意";
                agreeColor = 'green';
            }
            const comment = taskLocalVariables.comment || "";

            return (
                <span style={{color: agreeColor }}>
                    {agreeCN} { comment !== "" ? "("+comment+")" : ""}
                </span>
            )
        }
    },
    {
        title: "",
        dataIndex: "orgdata",
        align: 'center',
        key: "orgdata",
        width: 1,
        render: (text, record, index) => {
            return ""
        }
    },

];

const WorkFlowContent = (props) => {
    const [ loading, setLoading ] = useState(true);
    const [ data, setData ] = useState([]);
    const { modalId } = props;
    //更新工作流列表数据
    const updateDetailData = useCallback( data => {
        const generateTime = data.generateTime || "";
        // const hisInstance = data.hisInstance || {};
        const hisTasks = data.hisTasks || [];
        console.log("hisTasks",hisTasks);
        // if( !isValidObject(hisInstance) ){
        //     //取error
        //     const error = data.error || {};
        //     const msg = error.message || "";
        //     message.error({
        //         msg,
        //         duration: 4,
        //     });
        // }else{
            let newData = [];
            hisTasks.map( (item, index) =>{
                const name = item.name || "";
                const taskLocalVariables = item.taskLocalVariables || {};
                const userNameCn = taskLocalVariables.userNameCn || "";
                const comments = taskLocalVariables.comments || "";
                const obj =
                    {
                        key: index,
                        handleStep: name,
                        handler: userNameCn,
                        handleRes: comments,
                        orgdata: JSON.stringify(item)
                    };
                newData.push(obj);
            } );
            setData( newData );
        // }

    })
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    })
    //根据modalId获取工作流详情
    const requestSchemeDetail = useCallback(( modalId ) => {
        const opt = {
            url: 'http://192.168.243.187:28086/workflow/procTaskHis/' + modalId,
            method: 'GET',
            params:{},
            resFunc: (data)=> {
                console.log( data );
                updateDetailData(data);
                setLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '工作流详情数据获取失败' );
                setLoading(false);
            }
        };
        requestGet(opt);
    });
    useEffect(function(){
        console.log("modalId:"+modalId);
        if( isValidVariable( modalId ) ){
            //根据modalId获取工作流详情
            requestSchemeDetail( modalId );
        }
        // console.log("useEffect", modalId);
    },[  modalId ])

    const closeModal = useCallback(()=>{
        // setVisible(false)
    });

    return (
        <Spin spinning={loading} >
            <div className="workflow_wind_cont">
                {/*<div className="header_canvas">工作流ID:{modalId}</div>*/}
                <div className="cont_canvas">
                    <Table
                        columns={columns}
                        dataSource={ data }
                        size="small"
                        bordered
                        pagination={false}
                        loading={ loading }
                        scroll={{
                            y: 440
                        }}
                        locale={{
                            "emptyText" : "暂无数据",
                        }}
                        // onChange={onChange}
                        // rowClassName={(record, index)=>setRowClassName(record, index)}
                    />
                </div>
                <div className="win_btns">
                    <Button type="primary" className="btn_confirm" onClick={ e => {
                        props.window.hide();
                    } }>确认</Button>
                    <Button onClick={ ()=>{ alert("建设中,敬请期待!")} } style={{ float: 'left'}}>窗口模式</Button>
                </div>
            </div>
        </Spin>
    )
}

export default WorkFlowContent
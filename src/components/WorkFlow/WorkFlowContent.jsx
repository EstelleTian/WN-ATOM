import React, { useState, useEffect, useCallback } from 'react'
import {Modal, message, Button, Table} from "antd";
import { requestGet,  } from 'utils/request'
import {getFullTime, getDayTimeFromString, isValidVariable, isValidObject} from 'utils/basic-verify'


//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const columns = [
    {
        title: "",
        dataIndex: "rowNum",
        align: 'center',
        key: "rowNum",
        width: (screenWidth > 1920) ? 60 : 35,
        fixed: 'left',
        render: (text, record, index) => `第${index+1}步`
    },
    {
        title: "处理步骤",
        dataIndex: "handleStep",
        align: 'center',
        key: "handleStep",
        width: (screenWidth > 1920) ? 60 : 40,
        // fixed: 'left',
        // render:
    },
    {
        title: "处理人",
        dataIndex: "handler",
        align: 'center',
        key: "handler",
        width: (screenWidth > 1920) ? 165 : 165,
        // fixed: 'left',
        render: (text, record, index) => {
            return (
                <div className="handler">
                    <div className="handler_1">
                        <span>{text} 主办 </span>
                        <span className="handler">[已办结,用时：11分钟43秒 ]</span>
                    </div>
                    <div className="handler_2">开始于：2020-12-17 11:07:55</div>
                    <div className="handler_3">结束于：2020-12-17 11:19:38</div>
                </div>
            )
        }
    },
    {
        title: "会签意见",
        dataIndex: "handleRes",
        align: 'center',
        key: "handleRes",
        width: (screenWidth > 1920) ? 60 : 40,
        // fixed: 'left',
        // render:
    },

];

const data = [
    {
        key: '1',
        handleStep: "发起人",
        handler: "兰州流量室",
        handleRes: "发起",
    },
    {
        key: '2',
        handleStep: "主任席",
        handler: "西安主任席",
        handleRes: "修改内容",
    },
    {
        handleStep: "发起人",
        handler: "兰州流量室",
        handleRes: "同意",
    },
    {
        key: '3',
        handleStep: "主任席",
        handler: "西安主任席",
        handleRes: "同意",
    },
    {
        key: '4',
        handleStep: "发起人办结",
        handler: "兰州流量室",
        handleRes: "办结",
    },
];


const WorkFlowContent = (props) => {
    const [ loading, setLoading ] = useState(false);
    let [ flowData, setFlowData ] = useState({});
    const { modalId } = props;
    // console.log(11111, visible, modalId );

    //更新方案列表数据
    const updateDetailData = useCallback( data => {
        //TODO 更新表单数据
        // console.log( data );
        setFlowData(data);
    })
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    })
    //根据modalId获取方案详情
    const requestSchemeDetail = useCallback(() => {
        const opt = {
            url: 'http://192.168.194.21:58189/hydrogen-scheme-flow-server/implementTactics/' + modalId,
            method: 'GET',
            params:{},
            resFunc: (data)=> {
                updateDetailData(data)
                // setManualRefresh(false);
            },
            errFunc: (err)=> {
                requestErr(err, '方案详情数据获取失败' );
                // setManualRefresh(false);
            }
        };
        requestGet(opt);
    });
    useEffect(function(){
        // if( visible ){
            //根据modalId获取方案详情
            // requestSchemeDetail( modalId );
        // }
        // console.log("useEffect", modalId);
    },[  modalId ])

    const closeModal = useCallback(()=>{
        // setVisible(false)
    });

    // 方案数据对象
    let tacticProcessInfo = isValidObject(flowData.tacticProcessInfo) ? flowData.tacticProcessInfo : {};
    // 方案基本信息数据对象
    let basicTacticInfo = isValidObject(tacticProcessInfo.basicTacticInfo) ? tacticProcessInfo.basicTacticInfo : {};

    const {tacticName="", } = basicTacticInfo;

    return (
        <div>
            <div className="header_canvas">工作流ID:{modalId}</div>
            <div className="cont_canvas">
                <Table
                    columns={columns}
                    dataSource={ data }
                    size="small"
                    bordered
                    // pagination={false}
                    loading={ loading }
                    // onChange={onChange}
                    // rowClassName={(record, index)=>setRowClassName(record, index)}
                />
            </div>
            <div>
                <Button type="primary"
                        // onClick={ closeModal }
                >
                    确认</Button>
                <Button onClick={ ()=>{ alert("建设中,敬请期待!")} } style={{ float: 'left'}}>窗口模式</Button>
            </div>
        </div>
    )
}

export default WorkFlowContent
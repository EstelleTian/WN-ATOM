import React, {useState, useEffect, useCallback, Suspense} from 'react'
import {Modal, message, Button, Table, Spin} from "antd";
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
        render: (text, record, index) => {
            return (
                <div className="handler">
                    <div className="handler_1">
                        <span style={{color: '#ec4747'}}>{text} </span>
                        {
                            index === 2
                                ? <span className="handler"  style={{color: 'green'}}>[已转交下一步,用时：11分钟43秒 ]</span>
                                : ""
                        }
                        {
                            index === 3
                                ? <span className="handler"  style={{color: 'orange'}}>[未接受办理]</span>
                                : ""
                        }
                        {
                            index !== 3 && index !== 2
                                ? <span className="handler"  style={{color: 'green'}}>[已办结,用时：11分钟43秒 ]</span> : ""
                        }

                    </div>
                    <div className="handler_2">开始于：2020-12-17 11:07:55</div>
                    {
                        index === 3
                            ? ""
                            : <div className="handler_3">结束于：2020-12-17 11:19:38</div>
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
    const [ loading, setLoading ] = useState(true);
    let [ flowData, setFlowData ] = useState({});
    const { modalId } = props;
    // console.log(11111, visible, modalId );

    //更新方案列表数据
    const updateDetailData = useCallback( data => {
        const generateTime = data.generateTime || "";
        const hisInstance = data.hisInstance || {};
        if( !isValidObject(hisInstance) ){
            //取error
            const error = data.error || {};
            const msg = error.message || "";
            message.error({
                msg,
                duration: 4,
            });
        }else{
            setFlowData(data);
        }
        //TODO 更新表单数据
        // console.log( data );
        // setFlowData(data);
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
                requestErr(err, '方案详情数据获取失败' );
                setLoading(false);
            }
        };
        requestGet(opt);
    });
    useEffect(function(){
        console.log("modalId:"+modalId);
        if( isValidVariable( modalId ) ){
            //根据modalId获取方案详情
            requestSchemeDetail( modalId );
        }
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
        <Spin spinning={loading} >
            <div>
                <div className="header_canvas">工作流ID:{modalId}</div>
                <div className="cont_canvas">
                    <Table
                        columns={columns}
                        dataSource={ [] }
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
        </Spin>
    )
}

export default WorkFlowContent
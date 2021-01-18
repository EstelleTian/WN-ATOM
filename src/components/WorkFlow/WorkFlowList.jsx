/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2020-12-22 20:36:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState, Fragment} from 'react'
import { Layout, Button, Menu, Row, Col, Input,Table } from 'antd'
import { ClockCircleOutlined, CheckOutlined, StarOutlined, PauseCircleOutlined, ExpandAltOutlined, FontColorsOutlined } from '@ant-design/icons'
import { formatTimeString } from 'utils/basic-verify'
import { sendMsgToClient, openTimeSlotFrame, closeMessageDlg, openControlDetail, openMessageDlg } from 'utils/client'
// import Stomp from 'stompjs'
import WorkFlowModal from './WorkFlowModal'
const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;



//消息模块
function WorkFlowList(props){
    const { menuVal } = props;
    const [ loading, setLoading ] = useState(false);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState(false);
    const [ workFlowvisible, setWorkFlowvisible ] = useState(false); //工作流模态框显隐
    const [ workFlowModalId, setWorkFlowModalId ] = useState(""); //当前选中方案工作流的id，不一定和激活方案id一样


    const onSearch = value => console.log(value);
    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys( selectedRowKeys );
    };
    //工作流详情
    const showWorkFlowDetail = ( flag, id ) => {
        setWorkFlowvisible(flag);
        //选中方案id
        setWorkFlowModalId(id);
    }
    const columns = [
        {
            title: "",
            dataIndex: "rowNum",
            align: 'center',
            key: "rowNum",
            width: (screenWidth > 1920) ? 60 : 30,
            // fixed: 'left',
            render: (text, record, index) => `第${index+1}步`
        },
        {
            title: "流水号",
            dataIndex: "sid",
            align: 'center',
            key: "sid",
            width: (screenWidth > 1920) ? 60 : 35,
            // fixed: 'left',
            // render:
        },
        {
            title: "工作名称",
            dataIndex: "sName",
            align: 'center',
            key: "sName",
            width: (screenWidth > 1920) ? 130 : 130,
            // fixed: 'left',
            // render: (text, record, index) => {
            //     return (
            //
            //     )
            // }
        },
        {
            title: "我经办的步骤",
            dataIndex: "steps",
            align: 'center',
            key: "steps",
            width: (screenWidth > 1920) ? 70 : 70,
            // fixed: 'left',
            // render:
        },
        {
            title: "发起人",
            dataIndex: "publisher",
            align: 'center',
            key: "publisher",
            width: (screenWidth > 1920) ? 50 : 50,
            // fixed: 'left',
            // render:
        },
        {
            title: "办结时间",
            dataIndex: "endTime",
            align: 'center',
            key: "endTime",
            width: (screenWidth > 1920) ? 60 : 50,
            // fixed: 'left',
            // render:
        },
        {
            title: "流程状态",
            dataIndex: "status",
            align: 'center',
            key: "status",
            width: (screenWidth > 1920) ? 60 : 40,
            // fixed: 'left',
            render: (text, record, index) => {
                let textClass = ""
                if(text === "已结束"){
                    textClass = "#ec4747";
                }else if(text === "进行中"){
                    textClass = "green";
                }
                return (
                    <span style={{ color: textClass}}>
                    {text}
                </span>

                )
            }
        },
        {
            title: "操作",
            dataIndex: "opt",
            align: 'center',
            key: "opt",
            width: (screenWidth > 1920) ? 120 :100,
            fixed: 'left',
            render: (text, record, index) => {
                return (
                    <span className='opt_btns'>
                    <a onClick={ e =>{
                        showWorkFlowDetail(true, "");
                        e.stopPropagation();
                    } }>详情</a>
                    <a>收回</a>
                    <a>催办</a>
                    <a>导出</a>
                </span>

                )
            }
        },

    ];

    const data = [
        {
            key: '1',
            sid: "181125",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "进行中",
            opt: "",
        },{
            key: '2',
            sid: "181126",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "已结束",
            opt: "",
        },{
            key: '3',
            sid: "181127",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "进行中",
            opt: "",
        },{
            key: '4',
            sid: "181128",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "已结束",
            opt: "",
        },{
            key: '5',
            sid: "181129",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "进行中",
            opt: "",
        },{
            key: '6',
            sid: "181130",
            sName: "15/1835 西南-军事活动 IGAGA 20分钟",
            steps: "第1步：申请人申请",
            publisher: "兰州流量室",
            endTime: "2021-1-15 10:14:15",
            status: "已结束",
            opt: "",
        }]

    return (
        <div className="work_cont">
            <div className="work_search">
                <Search placeholder="请输入要查询的工作号" onSearch={onSearch} style={{ width: 500 }} />
            </div>
            <div className="work_btns">
                <Button type="primary" loading = {loading}>
                    新建工作流
                </Button>
                <Button type="primary" loading = {loading}>
                    导出工作流
                </Button>
                <Button type="primary" loading = {loading}>
                    刷新
                </Button>
            </div>
            <div>
                <div></div>
                <div className="cont_canvas">
                    <Table
                        columns={columns}
                        dataSource={ data }
                        size="small"
                        bordered
                        rowSelection={true}
                        expandable={{
                            expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                            rowExpandable: record => record.name !== 'Not Expandable',
                        }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `共 ${total} 条`
                        }}
                        loading={ loading }
                        // onChange={onChange}
                        // rowClassName={(record, index)=>setRowClassName(record, index)}
                    />
                </div>
            </div>
            {
                workFlowvisible ? <WorkFlowModal visible={workFlowvisible} setVisible={setWorkFlowvisible} modalId={workFlowModalId} /> : ""
            }
        </div>
    )
}


// export default withRouter( InfoPage );
export default WorkFlowList;


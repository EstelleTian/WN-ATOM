/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-01-25 18:23:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, {useEffect, useState, useCallback} from 'react'
import ReactDom from 'react-dom';
import { withRouter, Link } from 'react-router-dom'
import { Button, Input, Table, message} from 'antd'
import { Window as WindowDHX } from "dhx-suite";
import { getFullTime, formatTimeString } from 'utils/basic-verify'
import { requestGet } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { inject, observer } from 'mobx-react'
import {isValidVariable} from "utils/basic-verify";
import './InfoHistoryList.scss'

const { Search } = Input;
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;



//消息历史列表
function InfoHistoryList(props){
    const [ searchVal, setSearchVal ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    const [ workFlowModalId, setWorkFlowModalId ] = useState(""); //当前选中工作流工作流的id，不一定和激活工作流id一样


    const { systemPage, infoHistoryData } = props;
    let { infoData = [] } = infoHistoryData;
    // const { activeTab } = infoHistoryData;
    const { user } = systemPage;


    //查询框
    const onSearch = value => {
        // console.log(value);
        setSearchVal(value);
    }

    const onChange = e => {
        const value = e.target.value;
        // console.log(e.target.value);
        setSearchVal(value);
    }

    //用户信息获取
    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }
        else{
            props.history.push('/')
        }

    }, []);
    const columns = [
        {
            title: "",
            dataIndex: "id",
            align: 'center',
            key: "id",
            width: (screenWidth > 1920) ? 35 : 35,
        },
        {
            title: "时间",
            dataIndex: "time",
            align: 'center',
            key: "time",
            width: (screenWidth > 1920) ? 120 : 120,

        },
        {
            title: "消息发出方",
            dataIndex: "sender",
            align: 'center',
            key: "sendersteps",
            // width: (screenWidth > 1920) ? 70 : 70,
            width: (screenWidth > 1920) ? 90 : 90,

        },
        {
            title: "消息名称",
            dataIndex: "name",
            align: 'center',
            key: "name",
            width: (screenWidth > 1920) ? 60 : 60,
        } , 
        {
            title: "消息内容",
            dataIndex: "content",
            align: 'center',
            key: "content",
            width: (screenWidth > 1920) ? 160 : 160,
        }];

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    });
    //获取消息历史数据请求
    const requestDatas = () => {
        if( !isValidVariable(user.id) ){
            return;
        }
        setLoading(true);
        let url = "";
        let params = {};

        url = "http://192.168.194.21:28680/cdm-nw-event-center-server/event/info/history";
        params = {
        }
        const opt = {
            url,
            method: 'GET',
            params,
            resFunc: (data)=> {
                //更新工作流数据
                handleTasksData(data);
                setLoading(false);
                setRefreshBtnLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '消息历史数据获取失败' );
                setLoading(false);
                setRefreshBtnLoading(false);

            },
        };
        requestGet(opt);
    };

    //处理消息历史数据
    const handleTasksData = (data) => {
        const { result =[], generateTime } = data;
        infoHistoryData.updateTasks( result, generateTime );
    };

    useEffect(function () {
        //获取 消息历史数据
        requestDatas();
    },[ props.systemPage.user ]);


    //根据输入框输入值，检索显示航班
    const filterInput = useCallback((data) => {
        if( searchVal === "" ){
            return data;
        }
        let newArr = data.filter( flight => {
            for(let key in flight){
                let val = flight[key] || ""
                val = val + ""
                val = val.toLowerCase();
                const sVal = searchVal.toLowerCase();
                if( val.indexOf( sVal ) !== -1 ){
                    return true
                }
            }
            return false
        } );
        return newArr;
    });
    //根据输入框输入值，检索显示航班
    const converToData = useCallback((data) => {
        let newArr = []; 
        data.map( item => {
            let obj = {};
            
            
        } );
        return newArr;
    });

    infoData = converToData(infoData);
    let data = filterInput(infoData);
    //按流水号排序
    // data = data.sort( (a,b) => {
    //     return ( a.sid*1 - b.sid*1 ) *(-1);
    // } );
    return (
        <div className="info-history-content">
            <header className="header">
                <div className="destriction">
                    所有消息记录(共条) 第1页
                </div>
                <div className="search">
                    <Input allowClear placeholder="请输入要查询的关键字" onChange={onChange} style={{ width: 300 }} />
                </div>
            </header>
            <div className="table-container">
                <div className="table-canvas">
                    <Table
                        columns={ columns }
                        dataSource={ data }
                        size="small"
                        bordered
                        // rowSelection={true}
                        // expandable={expandable}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `共 ${total} 条`,
                            // defaultPageSize: 20
                        }}
                        scroll={{
                            y: 412,
                        }}
                        loading={ loading }
                        // onChange={onChange}
                        // rowclassName={(record, index)=>setRowclassName(record, index)}
                    />
                </div>
            </div>
            <div className="date_time">数据时间：{ formatTimeString(infoHistoryData.generateTime) }</div>
        </div>
    )
}

// export default InfoHistoryList;
export default withRouter( inject("infoHistoryData", "systemPage")(observer( InfoHistoryList) ));



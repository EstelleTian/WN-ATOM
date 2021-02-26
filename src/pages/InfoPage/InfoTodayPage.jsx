/*
 * @Author: your name
 * @Date: 2021-01-22 16:09:16
 * @LastEditTime: 2021-02-24 15:54:01
 * @LastEditors: Please set LastEditors
 * @Description: 消息当日全部数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoListPage.jsx
 */
import React, {useEffect, useState, useCallback, useMemo } from 'react'
import { Layout, Tooltip, Spin, Input, Button } from 'antd'
import { CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { requestGet } from 'utils/request'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'
import { closeMessageDlg } from 'utils/client'
import InfoList from 'components/Info/InfoList'
import './InfoPage.scss'

//消息模块
function InfoTodayPage(props){
    const [ login, setLogin ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ refreshBtnLoading, setRefreshBtnLoading ] = useState(false);
    let [searchVal, setSearchVal] = useState(""); //输入框过滤 输入内容
    let { newsList, systemPage } = props;
    const { user } = systemPage;
    const { generateTime } = newsList;
    //获取 最近两小时的消息历史记录
    const requestDatas = useCallback(() => {
        if( !isValidVariable(user.id) ){
            return;
        }
        setLoading(true);
        let url = "http://192.168.194.21:28680/cdm-nw-event-center-server/event/info/lately";
        let params = {};
        const opt = {
            url,
            method: 'GET',
            params,
            resFunc: (data)=> {
                //更新消息数据
                const generateTime = data.generateTime || "";
                const result = data.result || [];
                if( result.length > 0 ){
                    let newMsg = result.filter( msg => ( "WFPI" !== msg.dataType ) )
                    props.newsList.addAllNews(newMsg, generateTime);
                }
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
    },[ user.id ]);

    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
            setLogin(true);
        }
    }, []);

    useEffect(function(){
        if( isValidVariable(user.id) ){
            //获取接口
            requestDatas();
        }
    }, [user.id]);

    //根据输入框输入值，检索显示
    const resList = useMemo(() => {
        if( searchVal === "" ){
            return newsList;
        }
        const nList = newsList.list.filter( item => {
            for(let key in item){
                let val = item[key] || ""
                val = val + ""
                val = val.toLowerCase();
                const sVal = searchVal.toLowerCase();
                return val.indexOf( sVal ) !== -1 
            }
        } );
        return {
            ...newsList,
            list: nList
        };
    },[ props.newsList.list.length, searchVal ]);


    return (
        <Layout className="layout">
            {
                login ? <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">
                        {`消息记录(共 ${ resList.list.length || 0 }条) `}
                        &nbsp; &nbsp; 
                        {` 数据时间:${ formatTimeString(generateTime) }  `}
                        </div>
                        <Input
                            allowClear
                            style={{ width: '200px', marginRight: '15px' }}
                            defaultValue={searchVal}
                            placeholder="请输入要查询的关键字"
                            onChange={(e)=>{
                                console.log(e.target.value);
                                setSearchVal( e.target.value )
                            }}
                        />
                        <Button type="primary" loading = { refreshBtnLoading } style={{ margin: "0 0.25rem" }}
                            onClick = { e => {
                                setRefreshBtnLoading(true);
                                //刷新列表
                                requestDatas();
                            }}
                        >
                            刷新
                        </Button>
                        
                        
                        <Tooltip title="关闭">
                            <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                        </Tooltip>

                    </div>
                    <Spin spinning={loading} >
                    { resList.list.length > 0 && <InfoList newsList={resList}/> }
                        
                    </Spin>
                    
                </div> : ""
            }

        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoTodayPage));


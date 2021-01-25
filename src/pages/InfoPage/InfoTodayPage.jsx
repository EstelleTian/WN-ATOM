/*
 * @Author: your name
 * @Date: 2021-01-22 16:09:16
 * @LastEditTime: 2021-01-25 14:02:30
 * @LastEditors: Please set LastEditors
 * @Description: 消息当日全部数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoListPage.jsx
 */
import React, {useEffect, useState, useCallback } from 'react'
import { Layout, Tooltip, Spin } from 'antd'
import { DeleteOutlined, CloseOutlined} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { requestGet } from 'utils/request'
import { isValidVariable } from 'utils/basic-verify'
import { closeMessageDlg } from 'utils/client'
import InfoList from 'components/Info/InfoList'
import './InfoPage.scss'

//消息模块
function InfoTodayPage(props){
    const [ login, setLogin ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const { newsList, systemPage } = props;
    const { user } = systemPage;
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
                const result = data.result || [];
                if( result.length > 0 ){
                    props.newsList.addNews(result);
                }
                setLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '消息历史数据获取失败' );
                setLoading(false);

            },
        };
        requestGet(opt);
    },[ user.id ]);

    useEffect(function(){
        const user = localStorage.getItem("user");
        if( isValidVariable(user) ){
            props.systemPage.setUserData( JSON.parse(user) );
        }
    }, []);

    useEffect(function(){
        if( isValidVariable(user.id) ){
            //获取接口
            requestDatas();
        }
    }, [user.id]);

    const len = newsList.list.length;

    return (
        <Layout className="layout">
            {
                login ? <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">消息记录</div>
                        <Tooltip title="清除">
                            <div className="radish">
                                <DeleteOutlined onClick={ emptyNews } />
                            </div>
                        </Tooltip>
                        
                        
                        <Tooltip title="关闭">
                            <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                        </Tooltip>

                    </div>
                    <Spin spinning={loading} >
                        <InfoList newsList={newsList}/>
                    </Spin>
                    
                </div> : ""
            }

        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoTodayPage));


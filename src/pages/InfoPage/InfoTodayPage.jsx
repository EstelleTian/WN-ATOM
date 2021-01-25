/*
 * @Author: your name
 * @Date: 2021-01-22 16:09:16
 * @LastEditTime: 2021-01-25 17:50:45
 * @LastEditors: Please set LastEditors
 * @Description: 消息当日全部数据
 * @FilePath: \WN-ATOM\src\pages\InfoPage\InfoListPage.jsx
 */
import React, {useEffect, useState, useCallback } from 'react'
import { Layout, Tooltip, Spin, Input } from 'antd'
import { DeleteOutlined, CloseOutlined} from '@ant-design/icons'
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
                    props.newsList.addAllNews(result, generateTime);
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
            setLogin(true);
        }
    }, []);

    useEffect(function(){
        if( isValidVariable(user.id) ){
            //获取接口
            requestDatas();
        }
    }, [user.id]);
    useEffect(function(){
        console.log("newsList.list.length",newsList.list.length);
        
    },[ newsList.list.length ]);

    //根据输入框输入值，检索显示
    const filterInput = useCallback((data,searchVal) => {
        console.log("filterInput",searchVal)
        if( searchVal === "" ){
            return data;
        }
        let newArr = data.filter( item => {
            for(let key in item){
                let val = item[key] || ""
                val = val + ""
                val = val.toLowerCase();
                const sVal = searchVal.toLowerCase();
                if( val.indexOf( sVal ) !== -1 ){
                    return true
                }
            }
            return false
        } )
        return newArr
    },[]);

    let data = filterInput(newsList.list, searchVal);
    let obj = {
        list: data
    }
    const len = obj.list.length || 0;

    return (
        <Layout className="layout">
            {
                login ? <div className="info_canvas">
                    <div className="info_header">
                        <div className="title">
                        {`消息记录(共 ${ len }条) `}
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
                        
                        
                        <Tooltip title="关闭">
                            <div className="close" onClick={()=>{ closeMessageDlg("")}}><CloseOutlined /> </div>
                        </Tooltip>

                    </div>
                    <Spin spinning={loading} >
                        <InfoList newsList={obj}/>
                    </Spin>
                    
                </div> : ""
            }

        </Layout>
    )
}


// export default withRouter( InfoPage );
export default inject("newsList", "systemPage")(observer(InfoTodayPage));


/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2021-04-01 17:42:11
 * @LastEditors: Please set LastEditors
 * @Description: ATOM流控详情
 */
import React, {useEffect, useState, useCallback} from 'react'
import {Tag, Descriptions, Checkbox, Space, Card, Row, Col, Divider, Tooltip, Form,  message, Spin} from 'antd'
import {getFullTime, formatTimeString, isValidconstiable, isValidObject} from '../../utils/basic-verify'
import { ReqUrls } from '../../utils/request-urls'
import { requestGet } from '../../utils/request'
import FlowcontrolDetailCard  from 'components/SchemeList/FlowcontrolDetailCard'

// import './RunwayDetail.scss'

//方案详情模块
function RunwayDetail(props) {
    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState({});
    const { airportName = "" } = props;

    //更新方案列表数据
    const updateDetailData = useCallback( data => {
        //TODO 更新表单数据
        console.log(data)
        setData(data);
    })
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    })
    //根据modalId获取方案详情
    const requestData = useCallback(( userId ) => {
        setLoading(true);
        const opt = {
            url: ReqUrls.runwayDefaultDetailUrl + userId,
            method: 'GET',
            params:{
                airportStr: airportName
            },
            resFunc: (data)=> {
                updateDetailData(data)
                setLoading(false);
            },
            errFunc: (err)=> {
                requestErr(err, '默认跑道详情数据获取失败' );
                setLoading(false);
            }
        };
        requestGet(opt);

    });

    //用户信息获取
    useEffect(function(){
        const userInfo = localStorage.getItem("user");
        if( isValidconstiable(userInfo) ){
            const user = JSON.parse(userInfo) ;
            if( isValidconstiable(user.id) ){
                //获取数据
                requestData(user.id);
            }
        }else{
            alert("请先登录");
        }
        
    }, []);

    const {} = useMemo(function(){
        const runwayConEditBeanMap = data.runwayConEditBeanMap || {};
        const airportMap = runwayConEditBeanMap[airportName] || {};
        const listRWGapInfoDefault = airportMap.listRWGapInfoDefault || [];
        let startTime = "";
        let endTime = "";
        let generateTime = "";
        let updateTime = "";
        listRWGapInfoDefault.map( item => {
            const startTimeStr = item.startTime || "";
            const endTimeStr = item.endTime || "";
            const generateTimeStr = item.generateTime || "";
            const updateTimeStr = item.updateTime || "";
            if( startTimeStr.length >= 12 ){
                startTime = startTimeStr.substring(0,8) + ' ' + startTimeStr.substring(8);
            }
            if( endTimeStr.length >= 12 ){
                endTime = endTimeStr.substring(0,8) + ' ' + endTimeStr.substring(8);
            }
            if( generateTimeStr.length >= 12 ){
                generateTime = generateTimeStr.substring(0,8) + ' ' + generateTimeStr.substring(8);
            }
            if( updateTimeStr.length >= 12 ){
                updateTime = updateTimeStr.substring(0,8) + ' ' + updateTimeStr.substring(8);
            }
            const operationMode = item.operationmode;
            let operationModeStr = "";
            if( operationMode != "" ){
                if( operationMode*1 == 100){
                    operationModeStr = "就近模式";
                }else if( operationMode*1 == 200){
                    operationModeStr = "走廊口模式";
                }
            }
        })
        
        
    }, [data])
    

    return (
        <Spin spinning={loading} >
            <Row className="scheme-detail">
                1111
            </Row>
        </Spin>
    )
}


export default RunwayDetail;




/*
 * @Author: your name
 * @Date: 2020-12-09 21:19:04
 * @LastEditTime: 2020-12-22 18:35:41
 * @LastEditors: Please set LastEditors
 * @Description: ATOM终止
 */
import React, {useEffect, useState} from 'react'
import { Row, Col, message as antdMessage, Button  } from 'antd'
import ATOMDetail  from 'components/RestrictionDetail/ATOM/ATOMDetail'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { sendMsgToClient } from 'utils/client'
// ATOM终止
function ATOMTermination(props){
    const { title } = props;
    let [flowData, setFlowData] = useState({});
    let [ message, setMessage ] = useState({});

    //更新方案列表数据
    const updateData = data => {
        let {  status } = data;
        if( status === 500 ){
            antdMessage.error('获取的流控数据为空');
        }else{
            setFlowData(data);
        }
    };
    // 请求ATOM数据失败
    const requestErr = (err, content) => {
        antdMessage.error({
            content,
            duration: 4,
        });
    };
    // 请求ATOM数据
    const requestATOMData = (id) => {
        // 获取当前用户
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        // 请求参数
        const opt = {
            url: ReqUrls.ATOMDataUrl + id,
            method:'GET',
            params:{
                userId: user.id
            },
            resFunc: (data)=> updateData(data),
            errFunc: (err)=> requestErr(err, '流控数据获取失败' ),
        };
        // 发送请求
        request(opt);
    };

    useEffect(() => {
        let msgStr = localStorage.getItem("message");
        let json = JSON.parse(msgStr);
        setMessage(json);
        let { data = {} } = json;
        data = JSON.parse(data);
        const id = data.id;
        console.log("id:", id);
        requestATOMData(id);
    }, []);

    return (
        <Row gutter={12} className="res_canvas">
            <Col span={12} className="res_left">
                <Row className="title">
                    <span>{ title }</span>
                    <Button type="primary" className="info_btn btn_blue"
                            style={
                                { marginLeft: '1rem'}
                            }
                            onClick={ function(e){
                                sendMsgToClient(message)
                                window.close();
                                e.stopPropagation()
                            } } >查看容流监控</Button>
                </Row>
                <ATOMDetail
                    flowData={ flowData }
                    title="流控信息"
                />
            </Col>
        </Row>
    )
}


export default ATOMTermination;



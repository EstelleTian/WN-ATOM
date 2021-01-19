import React, { useState, useEffect, useCallback } from 'react'
import { Modal, message, Button } from "antd";
import { requestGet } from 'utils/request'
import { isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import SchemeDetail  from 'components/SchemeList/SchemeDetail'

const SchemeModal = (props) => {
    let [ flowData, setFlowData ] = useState({})
    const { visible, modalId, setVisible } = props;

    //更新方案列表数据
    const updateDetailData = useCallback( data => {
        //TODO 更新表单数据
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
            url: ReqUrls.schemeDetailByIdUrl + modalId,
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
        if( visible ){
            //根据modalId获取方案详情
            requestSchemeDetail( modalId );
        }
        // console.log("useEffect", modalId);
    },[ visible, modalId ])

    const closeModal = useCallback(()=>{
        setVisible(false)
    });

    // 方案数据对象
    // 方案数据对象
    let tacticProcessInfo = isValidObject(flowData.tacticProcessInfo) ? flowData.tacticProcessInfo : {};
    // 方案基本信息数据对象
    let basicTacticInfo = isValidObject(tacticProcessInfo.basicTacticInfo) ? tacticProcessInfo.basicTacticInfo : {};

    const {tacticName="", } = basicTacticInfo;

    return (
        <Modal
            title={`方案详情 - ${tacticName} `}
            centered
            visible={ visible }
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            width={1000}
            maskClosable={false}
            destroyOnClose = { true }
            footer = {
                <div>
                    <Button type="primary" onClick={ closeModal }>确认</Button>
                    <Button onClick={ ()=>{ alert("建设中,敬请期待!")} } style={{ float: 'left'}}>窗口模式</Button>
                </div>
            }
        >
            <SchemeDetail flowData={ flowData }  />
        </Modal>
    )
}

export default SchemeModal
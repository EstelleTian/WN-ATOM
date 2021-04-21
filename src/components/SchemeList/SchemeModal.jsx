import React, { useState, useEffect, useCallback } from 'react'
import { Modal, message, Button } from "antd";
import { requestGet } from 'utils/request'
import { isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import SchemeDetail  from 'components/SchemeList/SchemeDetail'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'


const SchemeModal = (props) => {
    let [ flowData, setFlowData ] = useState({})
    const { visible, modalId, modalType, setVisible } = props;

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

    const setModalContent = useCallback(()=>{

        if(modalType === "DETAIL"){
            return(
                <Modal
                    title={`方案详情 - ${tacticName} (${id}) `}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1000}
                    // maskClosable={false}
                    destroyOnClose = { true }
                    footer = {
                        <div>
                            <Button type="primary" onClick={ closeModal }>确认</Button>
                            {/*<Button onClick={ ()=>{ alert("建设中,敬请期待!")} } style={{ float: 'left'}}>窗口模式</Button>*/}
                        </div>
                    }
                >
                    <SchemeDetail flowData={ flowData }  />
                </Modal>
            )
        }else if(modalType === "MODIFY") {
            return(
                <Modal
                    title={`模拟方案调整 - ${tacticName} `}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1200}
                    // maskClosable={false}
                    destroyOnClose = { true }
                    footer={null}
                >
                    <RestrictionForm
                        operationType="MODIFY"
                        operationDescription="提交模拟方案调整"
                        primaryButtonName="提交修改"
                        setModalVisible={ setVisible }
                        flowData={ flowData }
                        bordered = {false}
                    />
                </Modal>
            )
        }else if(modalType === "RECREATE") {
            return(
                <Modal
                    title={`方案发布`}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1200}
                    // maskClosable={false}
                    destroyOnClose = { true }
                    footer={null}
                >
                    <RestrictionForm
                        operationType="RECREATE"
                        operationDescription="创建方案"
                        primaryButtonName="创建方案"
                        setModalVisible={ setVisible }
                        flowData={ flowData }
                        bordered = {false}
                    />
                </Modal>
            )
        }

    });



    // 方案数据对象
    // 方案数据对象
    let tacticProcessInfo = isValidObject(flowData.tacticProcessInfo) ? flowData.tacticProcessInfo : {};
    // 方案基本信息数据对象
    let basicTacticInfo = isValidObject(tacticProcessInfo.basicTacticInfo) ? tacticProcessInfo.basicTacticInfo : {};

    const {tacticName="", id="" } = basicTacticInfo;

    return (
        setModalContent()
    )
}

export default SchemeModal
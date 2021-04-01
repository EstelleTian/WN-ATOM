import React, { useState, useEffect, useCallback } from 'react'
import { Modal, message, Button } from "antd";
import { requestGet } from 'utils/request'
import { isValidObject } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import RunwayDetail  from './RunwayDetail'
import RestrictionForm from 'components/RestrictionForm/RestrictionForm'


const RunwayModal = (props) => {
    let [ flowData, setFlowData ] = useState({})
    const { visible, modalObj, modalType, setVisible } = props;

    


    const closeModal = useCallback(()=>{
        setVisible(false)
    });

    const setModalContent = useCallback(()=>{
        if(modalType === "DETAIL"){
            return(
                <Modal
                    title={`(${modalObj.airportName})默认跑道详情`}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={650}
                    height={650}
                    // maskClosable={false}
                    destroyOnClose = { true }
                    footer = {
                        <div>
                            <Button type="primary" onClick={ closeModal }>确认</Button>
                            {/*<Button onClick={ ()=>{ alert("建设中,敬请期待!")} } style={{ float: 'left'}}>窗口模式</Button>*/}
                        </div>
                    }
                >
                    <RunwayDetail airportName={ modalObj.airportName }  />
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
                        bordered = {true}
                    />
                </Modal>
            )
        }

    });

    return (
        setModalContent()
    )
}

export default RunwayModal
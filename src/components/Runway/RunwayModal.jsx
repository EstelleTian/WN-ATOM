import React, { useState, useEffect, useCallback } from 'react'
import { Modal, message, Button, Spin } from "antd";
import { requestGet } from 'utils/request'
import { isValidObject, isValidVariable } from 'utils/basic-verify'
import { ReqUrls } from 'utils/request-urls'
import RunwayDetail  from './RunwayDetail'
import RunwayDefaultEdit from 'components/Runway/RunwayDefaultEdit'


const RunwayModal = (props) => {
    const [ loading, setLoading ] = useState(false);
    const [ data, setData ] = useState({});
    const { visible, modalObj, modalType, setVisible } = props;

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
        let params = modalObj;
        
        const opt = {
            url: ReqUrls.runwayDefaultDetailUrl + userId,
            method: 'GET',
            params,
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
        if( isValidVariable(userInfo) ){
            const user = JSON.parse(userInfo) ;
            if( isValidVariable(user.id) ){
                //获取数据
                requestData(user.id);
            }
        }else{
            alert("请先登录");
        }
        
    }, []);


    const closeModal = useCallback(()=>{
        setVisible(false)
    });

    const setModalContent = useCallback(()=>{
        if(modalType === "DETAIL"){
            return(
                <Modal
                    title={`(${modalObj.airportStr})${modalObj.typeZH}跑道详情`}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1000}
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
                    <Spin spinning={loading} >
                        <RunwayDetail data={ data } airportName= {modalObj.airportStr}  />
                    </Spin>
                </Modal>
            )
        }else if(modalType === "MODIFY") {
            return(
                <Modal
                    title={`默认跑道调整`}
                    centered
                    visible={ visible }
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1200}
                    // maskClosable={false}
                    destroyOnClose = { true }
                    footer={null}
                >
                    <Spin spinning={loading} >
                        <RunwayDefaultEdit 
                        data={ data } 
                        airportName= {modalObj.airportStr}
                        setModalVisible={ setVisible }
                         />
                    </Spin>
                </Modal>
            )
        }

    });

    return (
        setModalContent()
    )
}

export default RunwayModal
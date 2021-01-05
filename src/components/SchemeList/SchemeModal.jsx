import React, { useState, useEffect, useCallback } from 'react'
import {Modal, message, Button} from "antd";
import { requestGet,  } from 'utils/request'

const SchemeModal = (props) => {
    const [ loading, setLoading ] = useState(false);
    const [ formData, setFormData ] = useState();
    const { visible, modalId, setVisible } = props;
    console.log(11111, visible, modalId );

    //更新方案列表数据
    const updateDetailData = useCallback(data => {
        //TODO 更新表单数据
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
        // const opt = {
        //     url:'http://192.168.194.21:58189/implementTactics',
        //     method: 'GET',
        //     params:{
        //
        //     },
        //     resFunc: (data)=> {
        //         updateDetailData(data)
        //         // setManualRefresh(false);
        //     },
        //     errFunc: (err)=> {
        //         requestErr(err, '方案详情数据获取失败' );
        //         // setManualRefresh(false);
        //     },
        // };
        // requestGet(opt);
    });
    useEffect(function(){
        if( visible ){
            //根据modalId获取方案详情
            requestSchemeDetail();
        }
        console.log("useEffect", modalId);
    },[ visible, modalId ])

    const closeModal = useCallback(()=>{
        setVisible(false)
    });
    return (
        <Modal
            title="方案详情"
            centered
            visible={ visible }
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            width={1000}
            maskClosable={false}
            footer = {
                <div>
                    <Button type="primary" onClick={ closeModal }>确认</Button>
                </div>
            }
        >
            <p>方案详情</p>
        </Modal>
    )
}

export default SchemeModal
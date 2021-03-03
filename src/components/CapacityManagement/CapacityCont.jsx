/*
 * @Author: your name
 * @Date: 2021-01-26 16:36:46
 * @LastEditTime: 2021-03-03 19:32:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityCont.jsx
 */
import React, { useEffect, useCallback} from 'react'
import {inject, observer} from 'mobx-react'
import { requestGet } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import ModalBox from 'components/ModalBox/ModalBox'
import { isValidVariable, getFullTime } from 'utils/basic-verify'
import CapacityTable from './CapacityTable';
import { customNotice } from 'utils/common-funcs'
import "./CapacityCont.scss"
//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;
//容量管理内容页
function CapacityCont (props){
    const { capacity, pane } = props;
    
    const requestStaticData = useCallback(() => {
        const type = pane.type.toUpperCase(); //类型
        const airportName = pane.key;//机场名称
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "static/"+ airportName + "/" + type ,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                console.log(data);
                const { resultMap } = data;
                props.capacity.setStaticData( resultMap[airportName] );
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '静态容量数据获取失败'
                })
            } ,
        };

        requestGet(opt);

    },[]);

    const requestDynamicData = useCallback(() => {
        const type = pane.type.toUpperCase();
        const airportName = pane.key;
        const opt = {
            url: ReqUrls.capacityBaseUrl+ "dynamic/"+ airportName + "/" + type + '/' + getFullTime( new Date(), 4) ,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                console.log(data);
                const { resultMap } = data;
                props.capacity.setDynamicData( resultMap[airportName] );
            },
            errFunc: (err)=> {
                customNotice({
                    type: 'error',
                    message: '动态容量数据获取失败'
                })
            } ,
        };

        requestGet(opt);

    },[])

    useEffect( function(){
        const { pane } = props;
        //获取数据
        requestStaticData();
        requestDynamicData();
    }, []);

   
    return (
        
            <div style={{ overflowX: 'auto'}}>
                <div className="cap_set_canvas">
                    <div className="set_top">
                        <div className="left_wrapper">
                            <ModalBox
                                title="静态容量——默认配置"
                                style={{
                                    height: 140
                                }}
                                showDecorator = {true}
                                className="static_cap_modal"
                            >
                                <CapacityTable type="line1" kind="default"/>
                            </ModalBox>
                           {/* */}<ModalBox
                                title="静态容量——时段配置"
                                showDecorator = {true}
                                className="static_cap_modal static_cap_modal_24 modal_static"
                            >
                                <CapacityTable  type="line24" kind="static"/>
                            </ModalBox>
                        </div>
                        {/**/}   <div className="right_wrapper">
                            <ModalBox
                                title="动态容量——时段配置"
                                showDecorator = {true}
                                className="static_cap_modal static_cap_modal_24 modal_dynamic"
                            >
                                <CapacityTable  type="line24" kind="dynamic"/>
                            </ModalBox>
                        </div>                 
                    </div>
                </div>
            </div>
        
    )
}

export default inject( "capacity" )(observer(CapacityCont));
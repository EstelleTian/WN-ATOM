/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-13 10:00:18
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import { message as antdMessage, message, Popover, Button} from "antd";
import React,{ useCallback, useState } from "react";
import {  isValidVariable } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { request, requestGet } from 'utils/request'

import {observer, inject} from "mobx-react";
import FmeToday from "../../utils/fmetoday";

//航班号右键协调框
let FLIGHTIDPopover = (props) => {
    const [ exemptLoad, setExemptLoad ] = useState(false);
    //数据提交失败回调
    const requestErr =useCallback( (err, content) => {
        antdMessage.error({
            content,
            duration: 4,
        });
        setExemptLoad(false);
    })
    //数据提交成功回调
    const requestSuccess = useCallback( ( data, title ) => {
        console.log(title + '成功:',data);
        console.log( props.flightTableData.updateSingleFlight );
        const { flightCoordination } = data;
        props.flightTableData.updateSingleFlight( flightCoordination );
        message.success(title + '成功');
        setExemptLoad(false);
        // 创建事件
        const evt = document.createEvent("MouseEvents");
        // 初始化 事件名称必须是mousedown
        evt.initEvent("mousedown", true, true);
        // 触发, 即弹出文字
        document.dispatchEvent(evt);
    });

    //标记豁免 取消标记豁免
    const handleExempty = useCallback(( type, record, title )  =>{
        console.log( props );
        setExemptLoad(true);
        const orgdata = record.orgdata || {};
        let orgFlight = JSON.parse(orgdata) || {};
        let urlKey = "";
        if( type === "exempt"){
            urlKey = "flightExempt";
            orgFlight.priority =FlightCoordination.PRIORITY_EXEMPT; //48
        }else if( type === "unexempt"){
            urlKey = "flightExemptCancel";
            orgFlight.priority =FlightCoordination.PRIORITY_NORMAL; //0
        }

        //TODO测试
        // props.flightTableData.updateSingleFlight( orgFlight );

        if( isValidVariable(urlKey) ){
            // console.log(JSON.stringify(orgFlight));
            const userId = props.systemPage.user.id || '14';

            const opt = {
                // url:'http://192.168.243.162:29891/'+urlKey,
                url:'http://192.168.243.162:28089/'+urlKey,
                method: 'POST',
                params: {
                    userId: userId,
                    flightCoordination: orgFlight,
                    comment: "",
                },
                resFunc: (data)=> requestSuccess(data, title),
                errFunc: (err)=> requestErr(err, title+'失败' ),
            };
            request(opt);
        }

    })
    const {text, record, index, col} = props.opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let { priority } = orgdata;
    const fmeToday = orgdata.fmeToday;
    let hasAuth = false;
    //航班未起飞 且 在本区域内--
    if ( !FmeToday.hadDEP(fmeToday) && FmeToday.isInAreaFlight(orgdata) ) {
        hasAuth = true;
    }
    const getContent = useCallback((opt)  =>{
        return (
            <div className="clr_flightid">
                <button className="c-btn c-btn-blue">查看航班详情</button>
                {
                    ( priority === FlightCoordination.PRIORITY_NORMAL && hasAuth )
                        ? <Button loading={exemptLoad} className="c-btn c-btn-green" onClick={ () => { handleExempty( "exempt", record, "标记豁免") } }>标记豁免</Button>
                        : ""
                }
                {
                    ( priority === FlightCoordination.PRIORITY_EXEMPT && hasAuth )
                        ? <Button loading={exemptLoad} className="c-btn c-btn-red" onClick={ () => { handleExempty("unexempt", record, "取消豁免") } }>取消豁免</Button>
                        : ""
                }
            </div>
        )
    });

    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={ text }
            content={getContent(props.opt)}
            trigger={[`contextMenu`]}

        >
            <div className={`full-cell ${ isValidVariable(priority) > 0 ? "priority_"+priority : "" }`}>
                <div className={`${ isValidVariable(text) ? "" : "empty_cell" }`} title={`${text}-${ PriorityList[priority] }`}>
                    <span className="">{ text }</span>
                </div>
            </div>
        </Popover >
    )
}
export default inject("flightTableData", "systemPage")(observer(FLIGHTIDPopover))


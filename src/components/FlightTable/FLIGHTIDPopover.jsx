/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-02-22 15:34:37
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import { message as antdMessage, message, Popover, Button, Tooltip} from "antd";
import React,{ useCallback, useState, useEffect, useMemo } from "react";
import {  isValidVariable } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { request } from 'utils/request'
import { CollaborateUrl, CollaborateIP } from 'utils/request-urls'
import { closePopover, cgreen, cred  } from 'utils/collaborateUtils.js'
import {observer, inject} from "mobx-react";
import FmeToday from "utils/fmetoday";
import { useTip } from './CustomUses'
//航班号右键协调框
let FLIGHTIDPopover = (props) => {
    const [ exemptLoad, setExemptLoad ] = useState(false);
    const [ poolLoad, setPoolLoad ] = useState(false);
    const [ tipObj, setTipObj] = useTip(2500);
    //数据提交失败回调
    const requestErr =useCallback( (err, content) => {
        setTipObj({
            visible: true,
            title: content,
            color: "rgba(151,59,52,0.9)"
        });
        setExemptLoad(false);
        setPoolLoad(false);

    });
    //数据提交成功回调
    const requestSuccess = useCallback( ( data, title ) => {
        console.log(title + '成功:',data);
        console.log( props.flightTableData.updateSingleFlight );
        setExemptLoad(false);
        setPoolLoad(false);

        const { flightCoordination } = data;
        //更新单条航班数据
        props.flightTableData.updateSingleFlight( flightCoordination );
        // message.success(title + '成功');
        //关闭协调窗口popover
        closePopover();

        setTipObj({
            visible: true,
            title: title + '成功',
            color: cgreen
        });

    });

    //标记豁免 取消标记豁免
    const handleExempty = useCallback(( type, record, title )  =>{
        console.log( props );
        setExemptLoad(true);
        const orgdata = record.orgdata || {};
        let orgFlight = JSON.parse(orgdata) || {};
        let urlKey = "";
        let taskId = "";
        if( type === "exempt"){ //申请豁免
            urlKey = "/flightPriorityApply";
        }else if( type === "unexempt"){ //申请取消豁免
            urlKey = "/flightCancelApplication";
        }

        if( isValidVariable(urlKey) ){
            const userId = props.systemPage.user.id || '14';
            const fid = orgFlight.flightid;
            const schemeId = props.schemeListData.activeScheme.id || ""; //方案id
            const opt = {
                url: CollaborateIP + urlKey,
                method: 'POST',
                params: {
                    userId,
                    flightCoordination: orgFlight,
                    comment: "",
                    taskId: "",
                    tacticId: schemeId,
                },
                resFunc: (data)=> requestSuccess(data, fid+title),
                errFunc: (err, msg)=> {
                    if( isValidVariable(err) ){
                      requestErr(err, err )
                    }else{
                      requestErr(err, fid+title+'失败' )
                    }
                },
            };
            request(opt);
        }

    });

    //等待池
    const handlePool = useCallback(( type, record, title )  =>{
        console.log( props );
        setPoolLoad(true);
        const orgdata = record.orgdata || {};
        let orgFlight = JSON.parse(orgdata) || {};
        let urlKey = "";
        if( type === "direct-in-pool"){ //申请入池
            urlKey = "/flightPutPoolApply";
            // orgFlight.poolStatus = FlightCoordination.IN_POOL_M; //2
        }else if( type === "direct-out-pool"){ //申请出池
            urlKey = "/flightOutPoolApply";
            // orgFlight.poolStatus = FlightCoordination.OUT_POOL; //0
        }
        
        if( isValidVariable(urlKey) ){
            // console.log(JSON.stringify(orgFlight));
            const userId = props.systemPage.user.id || '14';
            const fid = orgFlight.flightid;
            const schemeId = props.schemeListData.activeScheme.id || ""; //方案id
            const opt = {
                url: CollaborateIP + urlKey,
                method: 'POST',
                params: {
                    userId,
                    flightCoordination: orgFlight,
                    comment: "",
                    taskId: "",
                    tacticId: schemeId,
                },
                resFunc: (data)=> requestSuccess(data, fid+title),
                errFunc: (err, msg)=> {
                    if( isValidVariable(err) ){
                      requestErr(err, err )
                    }else{
                      requestErr(err, fid+title+'失败' )
                    }
                },
            };
            request(opt);
        }

    },[props.systemPage.user, props.schemeListData.activeScheme.id]);

    const { text, priority, isInPoolFlight, hasAuth, colorClass } = useMemo( ()=>{
        const {text, record } = props.opt;
        let { orgdata } = record;
        if( isValidVariable(orgdata) ){
            orgdata = JSON.parse(orgdata);
        }
        let { priority } = orgdata;
        const fmeToday = orgdata.fmeToday;
        let hasAuth = false;
        //航班状态验证
        let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
        let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
        let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
        let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内
        let isInPoolFlight = FlightCoordination.isInPoolFlight(orgdata); //航班是否在等待池中

        //航班未起飞 且 在本区域内--
        if ( !hadDEP && isInAreaFlight && hadFPL ) {
            hasAuth = true;
        }

        let colorClass = "";
        if( isValidVariable(priority) && priority*1 > 0 ){
            colorClass = "priority_"+ priority;
        }
        if(isInPoolFlight){
            const { record } = props.opt;
            let { orgdata } = record;
            colorClass += " in_pool " + orgdata.poolStatus;
        }
        
        return { text, priority, isInPoolFlight, hasAuth, colorClass };
    }, [props.opt])

    
    const content = useMemo(()  =>{
        return (
            <div className="clr_flightid">
                <button className="c-btn c-btn-blue">查看航班详情</button>
                {
                    ( priority === FlightCoordination.PRIORITY_NORMAL && hasAuth )
                        ? <Button loading={exemptLoad} className="c-btn c-btn-green" onClick={ () => { handleExempty( "exempt", record, "申请豁免") } }>申请豁免</Button>
                        : ""
                }
                {
                    ( priority === FlightCoordination.PRIORITY_EXEMPT && hasAuth )
                        ? <Button loading={exemptLoad} className="c-btn c-btn-red" onClick={ () => { handleExempty("unexempt", record, "申请取消豁免") } }>申请取消豁免</Button>
                        : ""
                }
                {
                    ( !isInPoolFlight && hasAuth )
                        ? <Button loading={poolLoad} className="c-btn c-btn-green" onClick={ () => { handlePool("direct-in-pool", record, "申请入池") } }>申请入池</Button>
                        : ""
                }
                {
                    ( isInPoolFlight && hasAuth )
                        ? <Button loading={poolLoad} className="c-btn c-btn-red" onClick={ () => { handlePool("direct-out-pool", record, "申请出池") } }>申请出池</Button>
                        : ""
                }


            </div>
        )
    },[priority, isInPoolFlight, hasAuth]);

    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={ text }
            content={ content }
            trigger={[`contextMenu`]}
        >
            <Tooltip title={ tipObj.title } visible={ tipObj.visible } color={ tipObj.color }>
                <div className={colorClass}  >
                    <div className={`${ isValidVariable(text) ? "" : "empty_cell" }`} title={`${text}-${ PriorityList[priority] }`}>
                        <span className="">{ text }</span>
                    </div>
                </div>
            </Tooltip>

        </Popover >
    )
}
export default inject("flightTableData", "systemPage", "schemeListData")(observer(FLIGHTIDPopover))


/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-02-01 16:16:40
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import { message as antdMessage, message, Popover, Button, Tooltip} from "antd";
import React,{ useCallback, useState, useEffect } from "react";
import {  isValidVariable } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { request } from 'utils/request'
import { CollaborateUrl } from 'utils/request-urls'
import { closePopover, cgreen, cred  } from 'utils/collaborateUtils.js'
import {observer, inject} from "mobx-react";
import FmeToday from "utils/fmetoday";

//航班号右键协调框
let FLIGHTIDPopover = (props) => {
    const [ exemptLoad, setExemptLoad ] = useState(false);
    const [ poolLoad, setPoolLoad ] = useState(false);
    const [ tipObj, setTipObj] = useState({
        visible: false,
        title: "",
        color: ""
    });
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
        if( type === "exempt"){
            urlKey = "/flightExempt";
            orgFlight.priority =FlightCoordination.PRIORITY_EXEMPT; //48
        }else if( type === "unexempt"){
            urlKey = "/flightExemptCancel";
            orgFlight.priority =FlightCoordination.PRIORITY_NORMAL; //0
        }

        //TODO测试
        // props.flightTableData.updateSingleFlight( orgFlight );

        if( isValidVariable(urlKey) ){
            // console.log(JSON.stringify(orgFlight));
            const userId = props.systemPage.user.id || '14';
            const fid = orgFlight.flightid;

            const opt = {
                url: CollaborateUrl.exemptyUrl + urlKey,
                method: 'POST',
                params: {
                    userId: userId,
                    flightCoordination: orgFlight,
                    comment: "",
                },
                resFunc: (data)=> requestSuccess(data, fid+title),
                errFunc: (err)=> requestErr(err, fid+title+'失败' ),
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
        if( type === "direct-in-pool"){ //入池
            urlKey = "/flightInPoolRest";
            orgFlight.poolStatus = FlightCoordination.IN_POOL_M; //2
        }else if( type === "direct-out-pool"){ //出池
            urlKey = "/flightOutPoolRes";
            orgFlight.poolStatus = FlightCoordination.OUT_POOL; //0
        }
        // else if( type === "unexempt"){
        //     urlKey = "flightExemptCancel";
        //     orgFlight.priority =FlightCoordination.PRIORITY_NORMAL; //0
        // }

        //TODO测试
        // props.flightTableData.updateSingleFlight( orgFlight );

        if( isValidVariable(urlKey) ){
            // console.log(JSON.stringify(orgFlight));
            const userId = props.systemPage.user.id || '14';
            const fid = orgFlight.flightid;

            const opt = {
                url: CollaborateUrl.poolUrl + urlKey,
                method: 'POST',
                params: {
                    userId: userId,
                    flightCoordination: orgFlight,
                    comment: "",
                },
                resFunc: (data)=> requestSuccess(data, fid+title),
                errFunc: (err)=> requestErr(err, fid+title+'失败' ),
            };
            request(opt);
        }

    });

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
                {
                    ( !isInPoolFlight && hasAuth )
                        ? <Button loading={poolLoad} className="c-btn c-btn-green" onClick={ () => { handlePool("direct-in-pool", record, "移入等待池") } }>移入等待池</Button>
                        : ""
                }
                {
                    ( isInPoolFlight && hasAuth )
                        ? <Button loading={poolLoad} className="c-btn c-btn-red" onClick={ () => { handlePool("direct-out-pool", record, "移出等待池") } }>移出等待池</Button>
                        : ""
                }
                <Button loading={poolLoad} className="c-btn c-btn-green" 
                    onClick={ () => {
                        handlePool("direct-out-pool", record, "申请移出等待池") 
                    } }
                >申请移出等待池</Button>
                <Button loading={poolLoad} className="c-btn c-btn-blue" 
                    onClick={ () => {
                        handlePool("direct-out-pool", record, "批复移出等待池") 
                    } }
                >批复移出等待池</Button>
                <Button loading={poolLoad} className="c-btn c-btn-red" 
                    onClick={ () => {
                        handlePool("direct-out-pool", record, "拒绝移出等待池") 
                    } }
                >拒绝移出等待池</Button>

            </div>
        )
    });

    useEffect(function(){
        if( tipObj.visible ){
            setTimeout(function(){
                setTipObj({
                    ...tipObj,
                    visible: false
                });
            }, 2500)
        }

    }, [tipObj.visible] )

    let colorClass = "";
    if( isValidVariable(priority) && priority*1 > 0 ){
        colorClass = "priority_"+ priority;
    }
    if(isInPoolFlight){
        colorClass += " in_pool " + orgdata.poolStatus;
    }
    return(
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={ text }
            content={ getContent(props.opt) }
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
export default inject("flightTableData", "systemPage")(observer(FLIGHTIDPopover))


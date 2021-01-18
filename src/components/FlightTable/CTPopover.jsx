/*
 * @Author: liutianjiao
 * @Date:
 * @LastEditTime: 2021-01-13 10:00:18
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: CollaboratePopover.jsx
 */
import {
    message as antdMessage,
    message,
    Popover,
    Button,
    Form,
    Descriptions,
    Input,
    DatePicker,
    Checkbox,
    Tooltip
} from "antd";
import React,{ useCallback, useState, useEffect } from "react";
import {  isValidVariable, getDayTimeFromString, getTimeAndStatus } from 'utils/basic-verify'
import { FlightCoordination, PriorityList } from 'utils/flightcoordination.js'
import { closePopover, cgreen, cred  } from 'utils/collaborateUtils.js'
import { request, requestGet } from 'utils/request'
import moment from "moment";
import {observer, inject} from "mobx-react";
import CellTip from "./CellTip";
import FmeToday from "utils/fmetoday";
//popover和tip组合协调窗口
const PopoverTip = ( props ) => {
    const [autoChecked, setAutoChecked] = useState(true);
    const [ tipObj, setTipObj] = useState({
        visible: false,
        title: "",
        color: ""
    });
    useEffect(function(){
        if( tipObj.visible ){
            setTimeout(function(){
                setTipObj({
                    ...tipObj,
                    visible: false
                });
            }, 1000)
        }

    }, [tipObj.visible, props.visible] );
    // 内容渲染
    const getContent = useCallback((opt)  =>{
        // const [form] = Form.useForm();
        let { text, record, col, title } = opt;
        let { FLIGHTID, DEPAP, ARRAP } = record;
        let time = "";
        let date = "";
        if( isValidVariable(text) && text.length >= 12 ){
            time = text.substring(8,12);
            date = moment( text.substring(0,8), "YYYY-MM-DD");
        }
        let initialValues = {
            flightid: FLIGHTID || '',
            airport: DEPAP + "-" + ARRAP,
            unit: "",
            locked: "",
            time,
            date,
            comment: ""
        };

        //数据提交失败回调
        const requestErr =useCallback( (err, content) => {
            setTipObj({
                visible: true,
                title: content,
                color: cred
            });
        })
        //数据提交成功回调
        const requestSuccess = useCallback( ( data, title ) => {
            console.log(title + '成功:',data);
            console.log( props.flightTableData.updateSingleFlight );
            const { flightCoordination } = data;
            props.flightTableData.updateSingleFlight( flightCoordination );
            message.success(title + '成功');
            //关闭协调窗口popover
            closePopover();
        });
        //表单提交
        const formSubmit = ( values ) =>{
            setTipObj({
                visible: true,
                title: props.title+"成功",
                color: cgreen
            });
            // const newStartTime =  moment(values.startTime).format('YYYYMMDD'); //日期转化
            // const { record } = props.opt;
            // const orgdata = record.orgdata || {};
            // let orgFlight = JSON.parse(orgdata) || {}; //航班fc
            // const userId = props.systemPage.user.id || '14';
            // const timestr = newStartTime + "" + values.time;
            //
            //
            // orgFlight.locked = autoChecked ? 1 : "";
            //
            // let urlKey = "";
            // if( col === "COBT"){
            //     orgFlight.cobtField.value = timestr;
            //     urlKey = "updateCobt";
            // }else if( col === "CTOT"){
            //     orgFlight.ctotField.value = timestr;
            //     urlKey = "updateCtot";
            // }
            // //传参
            // const params = {
            //     userId: userId,
            //     flightCoordination: orgFlight, //航班原fc
            //     comment: values.comment,  //备注
            // }
            // console.log(params);
            // const opt = {
            //     url:'http://192.168.243.162:28089/flight/'+urlKey,
            //     method: 'POST',
            //     params: params,
            //     resFunc: (data)=> requestSuccess(data, title),
            //     errFunc: (err)=> requestErr(err, title+'失败' ),
            // };
            // request(opt);
        }

        return (
            <Form
                // form={form}
                size="small"
                onFinish={ formSubmit }
                initialValues={initialValues}
                className="ffixt_form"
            >
                <Descriptions size="small" bordered column={1}>
                    <Descriptions.Item label="航班">
                        <Form.Item
                            name="flightid"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="机场">
                        <Form.Item
                            name="airport"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="日期" >
                        <Form.Item
                            name="date"
                        >
                            <DatePicker className="clr_date"  format="YYYY-MM-DD"/>
                        </Form.Item>

                    </Descriptions.Item>
                    <Descriptions.Item label="时间">
                        <Form.Item
                            name="time"
                        >
                            <Input/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="">
                        <Form.Item
                            name="locked"
                        >
                            <Checkbox
                                checked={ autoChecked }
                                onChange={e => {
                                    setAutoChecked(e.target.checked)
                                }}
                            >
                                禁止系统自动调整
                            </Checkbox>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        <Form.Item
                            name="comment"
                        >
                            <Input.TextArea maxLength={100} />
                        </Form.Item>
                    </Descriptions.Item>
                    <div>
                        <Button size="small"  type="primary" htmlType="submit">修改</Button>
                        <Button style={{marginLeft: '8px'}}  size="small">重置</Button>
                    </div>
                </Descriptions>

            </Form>
        )
    });
    const content = getContent(props.opt);
    return (
        <Popover
            destroyTooltipOnHide ={ { keepParent: false  } }
            placement="rightTop"
            title={ props.title }
            content={  content  }
            trigger={[`contextMenu`]}
            getContainer={false}
        >
            <Tooltip  title={ tipObj.title } visible={ tipObj.visible } color={ tipObj.color } >
                { props.textDom }
            </Tooltip>
        </Popover >
    )


}

//CTOT COBT 右键协调框 通过 opt.col 列名 区分
const CTPopover = (props) => {
    const { opt } = props;
    const {text, record, col} = opt;
    let { orgdata } = record;
    if( isValidVariable(orgdata) ){
        orgdata = JSON.parse(orgdata);
    }
    let field = {};
    let title = "";
    if( col === "COBT"){
        field = orgdata.cobtField || {};
        title = "预撤时间修改";
    }else if( col === "CTOT"){
        field = orgdata.ctotField || {};
        title = "预起时间修改";
    }else if( col === "FFIXT"){
        field = orgdata.ffixField || {};
        title = "过点时间修改";
    }
    let source = field.source || "";
    let sourceCN = FlightCoordination.getSourceZh( source );

    const fmeToday = orgdata.fmeToday;
    let bgStatus = "";
    let subTitle = "";
    //航班状态验证
    let hadDEP = FmeToday.hadDEP(fmeToday); //航班已起飞
    let hadARR = FmeToday.hadARR(fmeToday); //航班已落地
    let hadFPL = FmeToday.hadFPL(fmeToday); //航班已发FPL报
    let isInAreaFlight = FmeToday.isInAreaFlight(orgdata); //航班在本区域内

    //航班已起飞或者不在本区域内--不显示
    if ( hadDEP ) {
        if (  isValidVariable(text) ) {
            bgStatus = "DEP";
        }
        title = "航班已起飞";
        subTitle = "已起飞";
    }else if ( hadARR ) {
        if (  isValidVariable(text) ) {
            bgStatus = "ARR";
        }
        title = "航班已落地";
        subTitle = "已落地";
    }else if ( !hadFPL ) {
        if (  isValidVariable(text) ) {
            bgStatus = "FPL";
        }
        title = "航班尚未拍发FPL报";
        subTitle = "未拍发FPL报";
    }else if ( !isInAreaFlight ) {
        if (  isValidVariable(text) ) {
            bgStatus = "notArea";
        }
        title = "非本区域航班";
        subTitle = "非本区域";
    }
    let textDom = '';
    if( col === "FFIXT"){
        let meetIntervalValue = field.meetIntervalValue || "";
        let ftime = "";
        if( isValidVariable(text) && text.length > 12 ){
            ftime = getTimeAndStatus(text)
        }
        if( ftime.indexOf("A") > -1 ){
            source = "DEP";
        }
        textDom =  <div className={`full-cell time_${ftime} ${ (ftime !== "") ? source : "" }`}>
            <div className="interval" title={`${text}-${sourceCN}-${ subTitle }`}>
                <span  className={ `${(meetIntervalValue === "200" && ftime !== "") ? "interval_red" : "" }`}>{ftime}</span>
            </div>
        </div>
    }
    else{
        textDom = <div className={`full-cell ${ isValidVariable(text) ? source : "" } ${col}_${bgStatus}`} >
            <div className={`${ isValidVariable(text) ? "" : "empty_cell" }`}
                 title={`${isValidVariable(text) ? text : ""}-${sourceCN}-${ subTitle }`}
            >
                <span className="">{getTimeAndStatus(text)}</span>
            </div>
        </div>;
    }
    //航班已起飞或者不在本区域内--不显示
    if ( hadDEP || hadARR || !hadFPL || !isInAreaFlight ) {
        return (
            <CellTip title={title}>
                {textDom}
            </CellTip>
        )
    }else{
        return(
            <PopoverTip title={ title } textDom={textDom} opt={opt}/>
        )
    }

}


export default inject( "systemPage")(observer(CTPopover))


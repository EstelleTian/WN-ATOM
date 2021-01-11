/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2020-12-24 19:19:24
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect, useCallback,useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, message, Checkbox , Empty} from 'antd'
import { SyncOutlined } from '@ant-design/icons';
import { requestGet, request } from 'utils/request'
import { getTimeFromString, getDayTimeFromString, isValidVariable, isValidObject } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import  SchemeModal  from "./SchemeModal";
import  SchemeItem  from "./SchemeItem";
import './SchemeList.scss'

//方案多选按钮组
const plainOptions = [
    { label: '正在执行', value: 'RUNNING' },
    { label: '将要执行', value: 'FUTURE' },
    { label: '正常结束', value: 'FINISHED' },
    { label: '人工终止', value: 'TERMINATED_MANUAL' },
    { label: '自动终止', value: 'TERMINATED_AUTO' },
];

//方案列表
function SchemeList (props){
    const [visible, setVisible] = useState(false);
    const [modalId, setModalId] = useState("");
    const [ manualRefresh, setManualRefresh ] = useState( false );
    const [ statusValues, setStatusValues ] = useState( ['FUTURE','RUNNING'] ); //方案列表 多选-状态-按钮组
    const [ schemeListRefresh, setSchemeListRefresh ] = useState( false );
    NWGlobal.setSchemeId = id  => {
        // alert("收到id:"+id);
        handleActive( id )
    }
    //更新方案列表数据
    const updateSchemeListData = useCallback(data => {
        let { tacticProcessInfos, status } = data;
        if( status === 500 ){
            message.error('获取的方案列表数据为空');
        }else{
            const { schemeListData } = props;
            if( tacticProcessInfos === null ){
                tacticProcessInfos = [];
            }
            const list = tacticProcessInfos.map((item) => {
                const { basicTacticInfo } = item;
                return basicTacticInfo;
            })
            //更新 方案 store
            schemeListData.updateList(list)
            if( (schemeListData.activeScheme.id === "" || schemeListData.activeScheme.id === undefined)  && list.length > 0 ){

                let id = list[0].id + "";
                console.log("未获取到id，选定第一个:",id)

                handleActive(id);
            }
        }


    })
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    })
    //获取方案列表
    const getSchemeList = useCallback(() => {
        const opt = {
            url:'http://192.168.194.21:58189/implementTactics',
            method: 'GET',
            params:{
                // status: "RUNNING,FUTURE",
                status: statusValues.join(','),
                startTime: "",
                endTIme: "",
                userId: "443"
            },
            resFunc: (data)=> {
                updateSchemeListData(data)
                setManualRefresh(false);
                if( schemeListRefresh === false ){
                    // console.log("定时开始")
                    setSchemeListRefresh(true)
                    setTimeout(function(){
                        // console.log("定时开始执行")
                        setSchemeListRefresh(false)
                        getSchemeList()
                    },30 * 1000)
                }
            },
            errFunc: (err)=> {
                requestErr(err, '方案列表数据获取失败' );
                setManualRefresh(false);},
        };
        requestGet(opt);
    });
    // DidMount 获取一次方案列表
    useEffect(function(){
        if( props.schemeListData.activeScheme.id !== modalId ){
            getSchemeList();
        }
    }, [ statusValues ] );

    // DidMount 获取一次方案列表
    // useEffect(function(){
    //     if( isValidVariable( props.flightTableData.timeoutId ) ){
    //         console.log("清空定时器");
    //         clearTimeout(props.flightTableData.timeoutId)
    //         props.flightTableData.timeoutId = ""
    //     }
    // }, [ props.schemeListData.activeScheme ] );

    //更新航班store数据
    const updateFlightTableData = useCallback(flightData => {
        let  { flights, generateTime } = flightData;
        if( flights !== null ){
            props.flightTableData.updateList(flights, generateTime)
        }else{
            props.flightTableData.updateList([], generateTime)
        }
    });
    //更新执行KPIstore数据
    const updateExecuteKPIData = useCallback(executeKPIData => {
        if( isValidObject(executeKPIData) ){
            props.executeKPIData.updateExecuteKPIData(executeKPIData)
        }else{
            props.executeKPIData.updateExecuteKPIData({});
            message.error({
                content:"获取的KPI数据为空",
                duration: 4,
            });

        }
    });
    //航班列表数据获取
    const requestFlightTableData = useCallback(id => {
        // if( isValidVariable(id) ){
            const opt = {
                url:'http://192.168.194.21:29890/tactic/' + id,
                method:'GET',
                params:{},
                resFunc: (data)=> {
                    updateFlightTableData(data);
                    if( props.flightTableData.loading !== false){
                        props.flightTableData.toggleLoad(false);
                    }
                    // const timeoutid = setTimeout(function(){
                    //     console.log("航班定时开始执行")
                    //     // setSchemeListRefresh(false);
                    //     requestFlightTableData(id)
                    // },5 * 1000);
                    // if( !isValidVariable( props.flightTableData.timeoutId ) ){
                    //     console.log("配置定时器");
                    //     props.flightTableData.timeoutId = timeoutid
                    // }

                },
                errFunc: (err)=> {
                    requestErr(err, '航班列表数据获取失败')
                    props.flightTableData.toggleLoad(false)
                } ,
            };
            request(opt);
        // }

    })
    //方案执行KPI数据获取
    const requestExecuteKPIData = useCallback(id => {
        const opt = {
            url:'http://192.168.194.21:29890/performkpi/' + id,
            // url:'http://192.168.243.8:29890/performkpi/' + id,
            method:'GET',
            params:{},
            resFunc: (data)=> {
                updateExecuteKPIData(data)
                props.executeKPIData.toggleLoad(false)
            },
            errFunc: (err)=> {
                requestErr(err, 'KPI数据获取失败')
                props.executeKPIData.toggleLoad(false)
            } ,
        };
        request(opt);
    })
    //高亮方案并获取航班数据和KPI数据
    const handleActive = useCallback(( id ) => {
        // if( props.schemeListData.schemeId != id ){
            props.schemeListData.setActiveSchemeId(id);
            props.schemeListData.toggleSchemeActive( id+"" );
            props.flightTableData.toggleLoad(true);
            props.executeKPIData.toggleLoad(true);
            requestFlightTableData(id+"");
            requestExecuteKPIData(id+"");
        // }

    })



    //状态-多选按钮组-切换事件
    const onChange = useCallback((checkedValues)=>{
        console.log('checked = ', checkedValues);
        setStatusValues( checkedValues );
    })

    //方案详情显隐
    const toggleModalVisible = useCallback(( flag, id )=>{
        setVisible(flag);
        setModalId(id);
    })

    const schemeListData = props.schemeListData;
    const { sortedList } = schemeListData; //获取排序后的方案列表
    const  length = sortedList.length;
    return (
        <div className="list_container">
            <div className="manual_refresh">
                <SyncOutlined spin={manualRefresh}  onClick={()=>{
                    setManualRefresh(true);
                    getSchemeList();
                }}/>
            </div>
            <div  className="scheme-filter-items">
                <Checkbox.Group options={plainOptions} defaultValue={statusValues} onChange={onChange} />
            </div>

            {
                (length > 0) ?
                    sortedList.map( (item, index) => (
                    <SchemeItem
                        item={item}
                        handleActive={handleActive}
                        key={index}
                        toggleModalVisible={toggleModalVisible}
                    >
                    </SchemeItem>
                    )
                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ color:"#fff"}} />

            }
            <SchemeModal visible={visible} setVisible={setVisible} modalId={modalId} />
        </div>
    )
 }


export default inject("schemeListData","executeKPIData","flightTableData")(observer(SchemeList))
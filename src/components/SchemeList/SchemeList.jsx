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
    const [ visible, setVisible ] = useState(false); //详情模态框显隐
    const [ modalId, setModalId ] = useState(""); //当前选中方案详情的id，不一定和激活方案id一样
    const [ manualRefresh, setManualRefresh ] = useState( false ); //方案手动更新按钮loading状态
    const [ statusValues, setStatusValues ] = useState( ['FUTURE','RUNNING'] ); //方案列表 多选-状态-按钮组
    const [ schemeListRefresh, setSchemeListRefresh ] = useState( false ); //方案列表 是否是更新中 状态 true为更新中 false为更新完毕
    const [ flightsRefresh, setFlightsRefresh ] = useState( false ); //航班列表是否是更新中 状态 true为更新中 false为更新完毕
    //接收客户端传来方案id，用以自动切换到选中方案
    NWGlobal.setSchemeId = id  => {
        // alert("收到id:"+id);
        handleActive( id )
    };
    //状态-多选按钮组-切换事件
    const onChange = useCallback((checkedValues)=>{
        // console.log('checked = ', checkedValues);
        setStatusValues( checkedValues );
        getSchemeList();// 状态按钮切换后，主动获取方案列表
    });
    // DidMount 第一次获取方案列表
    useEffect(function(){
        getSchemeList(true);
    }, [] );
    //方案详情显隐
    const toggleModalVisible = useCallback(( flag, id )=>{
        setVisible(flag);
        //选中方案id
        setModalId(id);
    });
    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    });

    //更新--方案列表 store数据
    const updateSchemeListData = useCallback(data => {
        setSchemeListRefresh(false);
        let { tacticProcessInfos, status, generateTime } = data;
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
            });
            //更新 方案列表 store
            schemeListData.updateList(list, generateTime);
            //获取 激活方案 对象
            const activeScheme = schemeListData.activeScheme || {};
            const id = activeScheme.id || "";
            //检测 没有选中方案 则默认选中第一个方案
            if( !isValidVariable(id)  && list.length > 0 ){
                let id = list[0].id + "";
                console.log("未获取到id，选定第一个:",id);
                handleActive(id);
            }
        }


    });
    //更新--航班列表 store数据
    const updateFlightTableData = useCallback(flightData => {
        let  { flights, generateTime } = flightData;
        if( flights !== null ){
            props.flightTableData.updateList(flights, generateTime)
        }else{
            props.flightTableData.updateList([], generateTime)
        }
    });
    //更新--执行KPI store数据
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

    //获取--方案列表
    const getSchemeList = useCallback(( startNextRefresh = false ) => {
        const opt = {
            url:'http://192.168.194.21:58189/implementTactics',
            method: 'GET',
            params:{
                status: statusValues.join(','),
                startTime: "",
                endTIme: "",
                userId: "443"
            },
            resFunc: (data)=> {
                //更新方案数据
                updateSchemeListData(data);
                //手动更新方案按钮loading状态，如果是true，置为false，标志完成数据获取
                if( manualRefresh ){
                    setManualRefresh(false);
                }

                //用以阻止正在更新方案列表时候又发起更新请求
                if( startNextRefresh ){
                    // console.log(" 方案列表定 定时开始")
                    //获取--方案列表定时器---30s
                    const schemeTimer = setTimeout(function(){
                        // console.log("定时开始执行")
                        if( schemeListRefresh === false ){
                            setSchemeListRefresh(true);
                            // console.log(" 方案列表 定时开始 获取--方案列表")
                            getSchemeList(true);//获取--方案列表
                        }
                    },30 * 1000)
                }
            },
            errFunc: (err)=> {
                requestErr(err, '方案列表数据获取失败' );
                setManualRefresh(false);},
        };
        requestGet(opt);
    });
    //获取--航班列表数据
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
                },
                errFunc: (err)=> {
                    requestErr(err, '航班列表数据获取失败')
                    props.flightTableData.toggleLoad(false)
                } ,
            };
            request(opt);
        // }

    });
    //获取--执行KPI数据
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
    });

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

    });

    // DidMount 激活方案列表id变化后，重新处理航班定时器
    useEffect(function(){
        const id = props.schemeListData.activeScheme.id || "";
        // console.log("航班列表 useEffect id变了:"+id);
        if( isValidVariable( props.schemeListData.activeScheme.id ) ){
            // console.log("航班列表 清空定时器:"+props.flightTableData.timeoutId);
            clearInterval(props.flightTableData.timeoutId);
            props.flightTableData.timeoutId = "";
            //生成新定时器--轮询
            const timeoutid = setInterval(function(){
                // console.log("航班列表 定时开始执行， 获取数据，id是："+ id);
                // setSchemeListRefresh(false);
                requestFlightTableData(id)
            },60 * 1000);
            // console.log("航班列表 配置定时器:"+timeoutid);
            props.flightTableData.timeoutId = timeoutid;
        }
    }, [ props.schemeListData.activeScheme.id ] );

    // DidMount 激活方案列表id变化后，重新处理航班定时器
    useEffect(function(){
        const id = props.schemeListData.activeScheme.id || "";
        // console.log("航班列表 useEffect id变了:"+id);
        if( isValidVariable( props.schemeListData.activeScheme.id ) ){
            // console.log("航班列表 清空定时器:"+props.flightTableData.timeoutId);
            clearInterval(props.executeKPIData.timeoutId);
            props.executeKPIData.timeoutId = "";
            //生成新定时器--轮询
            const timeoutid = setInterval(function(){
                // console.log("航班列表 定时开始执行， 获取数据，id是："+ id);
                // setSchemeListRefresh(false);
                if( props.systemPage.leftActiveName === "kpi"){
                    requestExecuteKPIData(id)
                }
            },60 * 1000);
            // console.log("航班列表 配置定时器:"+timeoutid);
            props.executeKPIData.timeoutId = timeoutid;
        }
    }, [ props.schemeListData.activeScheme.id ] );

    useEffect(function(){
        return function(){
            console.log("方案列表卸载");
            props.flightTableData.timeoutId = "";
            props.executeKPIData.timeoutId = "";
        }
    },[])

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

export default inject("schemeListData","executeKPIData","flightTableData","systemPage")(observer(SchemeList))
/*
 * @Author: your name
 * @Date: 2020-12-10 11:08:04
 * @LastEditTime: 2021-02-18 16:17:32
 * @LastEditors: Please set LastEditors
 * @Description: 方案列表
 * @FilePath: \WN-CDM\src\components\SchemeList\SchemeList.jsx
 */
import React, { useEffect, useCallback,useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import {message, Checkbox, Empty, Spin} from 'antd'
import { requestGet } from 'utils/request'
import { isValidVariable } from 'utils/basic-verify'
import { NWGlobal } from  'utils/global'
import  SchemeModal  from "./SchemeModal";
import { ReqUrls } from 'utils/request-urls'
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
    const [ firstLoadScheme, setFirstLoadScheme ] = useState( true ); //方案列表是否是第一次更新
    //状态-多选按钮组-切换事件
    const onChange = useCallback((checkedValues)=>{
        // console.log('checked = ', checkedValues);
        props.schemeListData.setStatusValues( checkedValues );
    },[]);

    //方案详情显隐
    const toggleModalVisible = useCallback(( flag, id )=>{
        setVisible(flag);
        //选中方案id
        setModalId(id);
    },[]);

    //请求错误处理
    const requestErr = useCallback((err, content) => {
        message.error({
            content,
            duration: 4,
        });
    },[]);

    //更新--方案列表 store数据
    const updateSchemeListData = useCallback(data => {
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
        }
    }, [props.schemeListData]);

    //获取--方案列表
    const getSchemeList = useCallback(( startNextRefresh = false  ) => {
        // console.log("获取--方案列表，statusValues是:"+statusValues);
        let p = new Promise( (resolve, reject) => {
            const opt = {
                url: ReqUrls.schemeListUrl,
                method: 'GET',
                params:{
                    status: props.schemeListData.statusValues.join(','),
                    startTime: "",
                    endTime: "",
                    userId: props.systemPage.user.id
                },
                resFunc: (data)=> {
                    //更新方案数据
                    updateSchemeListData(data);
                    if( props.schemeListData.loading !== false){
                        props.schemeListData.toggleLoad(false);
                    }
                    resolve("成功");
                },
                errFunc: (err)=> {
                    requestErr(err, '方案列表数据获取失败' );
                    setManualRefresh(false);
                    reject("失败");
                },
            };
            requestGet(opt);
        });
        return p;
        
    }, [props.schemeListData, props.systemPage.user.id]);


    //高亮方案并获取航班数据和KPI数据
    const handleActive = useCallback(( id, title, from ) => {
        const res = props.schemeListData.toggleSchemeActive( id+"" );
        if( res ){
            //来自客户端定位，滚动到对应位置
            if( from === "client" ){
                // 滚动条滚动到顶部
                const canvas = document.getElementsByClassName("scheme_list_canvas")[0];
                const boxContent = canvas.getElementsByClassName("list_container")[0];
                boxContent.scrollTop = 0;
            }
        }else{
            if( isValidVariable(title) ){
                message.warning({
                    content: "暂未获取到方案，方案名称是：" + title ,
                    duration: 15,
                });
            }
        }
    },[props.schemeListData]);


    // DidMount 重新处理方案列表定时器
    useEffect(function(){
        if( !firstLoadScheme ){
            // console.log("方案列表 定时器激活了:"+statusValues);
            // console.log("方案列表 清空定时器:"+props.schemeListData.timeoutId);
            clearInterval(props.schemeListData.timeoutId);
            props.schemeListData.timeoutId = "";
            //生成新定时器--轮询
            const timeoutid = setInterval(function(){
                // console.log("方案列表开始请求:"+statusValues);
                getSchemeList();
            },30*1000);

            props.schemeListData.timeoutId = timeoutid;
        }
    }, [firstLoadScheme] );
    // DidMount 第一次获取方案列表
    useEffect(function(){
        return function(){
            // console.log("方案列表卸载");
            clearInterval(props.schemeListData.timeoutId);
            props.schemeListData.timeoutId = "";
        }
    },[]);

    useEffect(function(){
        // console.log("statusValues变了 getSchemeList：", statusValues, firstLoadScheme);
        if( !firstLoadScheme ){
            props.schemeListData.toggleLoad(true);
            getSchemeList();
        }
    },[ props.schemeListData.statusValues ]);
    useEffect(function(){
        // console.log("user.id变了 getSchemeList(true)：", statusValues, firstLoadScheme);
        const id = props.systemPage.user.id;
        if( firstLoadScheme && isValidVariable(id) ){
            // alert( "user.id变为:"+ id );
            props.schemeListData.toggleLoad(true);
            getSchemeList(true);
            setFirstLoadScheme(false);
        }
    },[props.systemPage.user.id]);

    //监听全局刷新
    useEffect(function(){
        const id = props.systemPage.user.id;
        if( props.systemPage.pageRefresh && isValidVariable(id) ){
            console.time("全局");
            let p1 = new Promise(function(resolve, reject) {
                // 异步处理
                // 处理结束后、调用resolve 或 reject
                props.schemeListData.toggleLoad(true);
                getSchemeList();
                resolve("方案列表")
            } );
        }
    },[ props.systemPage.pageRefresh ]);

    useEffect(function(){
        // console.log("statusValues",statusValues);
        const schemeListData = props.schemeListData;
        const { sortedList } = schemeListData; //获取排序后的方案列表
        if( sortedList.length > 0 ){
            //获取 激活方案 对象
            const activeScheme = schemeListData.activeScheme || {};
            const id = activeScheme.id || "";
            //检测 没有选中方案 则默认选中第一个方案
            if( !isValidVariable(id)  && sortedList.length > 0 ){
                let id = sortedList[0].id + "";
                // console.log("未获取到id，选定第一个:",id);
                handleActive(id);
            }
        }
        //手动更新方案按钮loading状态，如果是true，置为false，标志完成数据获取
        if( manualRefresh ){
            setManualRefresh(false);
        }
    })

    //接收客户端传来方案id，用以自动切换到选中方案
    NWGlobal.setSchemeId = ( schemeId, title )  => {
        // alert("收到id:"+schemeId+"  title:"+title);
         //主动获取一次
        getSchemeList().then( function(data) {
            handleActive( schemeId, title, 'client' );
        });
        
    };

    const schemeListData = props.schemeListData;
    const { sortedList, statusValues } = schemeListData; //获取排序后的方案列表
    const  length = sortedList.length;

    return (
        <div className="scheme_list_canvas">
            <div className="scheme-filter-items">
                <Checkbox.Group options={plainOptions} defaultValue={statusValues} onChange={onChange} />
            </div>
            <Spin spinning={ props.schemeListData.loading } >
                <div className="list_container">
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
                    {
                        visible ? <SchemeModal visible={visible} setVisible={setVisible} modalId={modalId} /> : ""
                    }

                </div>
            </Spin>
        </div>

    )
}

SchemeList.propTypes = {
    schemeListData: PropTypes.shape({
        loading: PropTypes.bool,
        pageRefresh: PropTypes.bool,
        sortedList: PropTypes.array.isRequired,
        statusValues: PropTypes.array.isRequired,
      }),
    systemPage:  PropTypes.shape({
        user: PropTypes.object.isRequired,
      })

}

export default inject("schemeListData", "systemPage")(observer(SchemeList))

import React, { useState, useEffect, useCallback, memo } from 'react'
import {  observer } from 'mobx-react'
import ReactDom from "react-dom";
import { getTimeFromString, getDayTimeFromString, isValidVariable } from 'utils/basic-verify'
import { Tag, Menu, Dropdown  } from 'antd'
import { DownOutlined } from '@ant-design/icons';

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//方案状态转化
const convertSatus = (status) => {
    let newStatus = status;
    switch(status){
        case "FUTURE": newStatus = "将要执行";break;
        case "RUNNING": newStatus = "正在执行";break;
        case "PRE_PUBLISH": newStatus = "将要发布";break;
        case "PRE_TERMINATED":
        case "PRE_UPDATE":
            newStatus = "将要终止";break;
        case "TERMINATED":
        case "TERMINATED_MANUAL":
            newStatus = "人工终止";break;
        case "STOP": newStatus = "系统终止";break;
        case "FINISHED": newStatus = "正常结束";break;
        case "DISCARD": newStatus = "已废弃";break;
    }
    return newStatus;
}

const SummaryCell = memo(( {
    publishTime,
    createTime,
    basicTacticInfoReasonZh,
    basicTacticInfoRemark
} ) => {
    const [ visible, setVisible ] = useState( false );

    const handleVisibleChange = flag => {
        setVisible(flag);
    };
    
    const menu = (
        <Menu>
          <Menu.Item key="2">创建时间: {getTimeFromString(createTime)}</Menu.Item>
        </Menu>
      );
      return (
        <Dropdown
            overlay={menu}
            onVisibleChange={handleVisibleChange}
            visible={visible}
        >
            <span className="ant-dropdown-link">
                <span style={{
                    padding: '0 10px',
                    fontSize: '0.8rem',
                }}>有效时间:</span>{getTimeFromString(publishTime)} <DownOutlined />
            </span>
        </Dropdown>
      )

})

//单条方案
function RunwayItem(props){
    const [window, setWindow] = useState("");
    const [windowClass, setWindowClass] = useState("");
   
    let { item } = props;
    let id = item.id;
    
    const showDetail = useCallback((e)=>{
        props.toggleModalVisible(true, id);
        props.toggleModalType('DETAIL');
        e.preventDefault();
        e.stopPropagation();
    },[id]);

    const showModify = useCallback((e) => {
        props.toggleModalVisible(true, id);
        props.toggleModalType('MODIFY');
        e.preventDefault();
        e.stopPropagation();
    },[id]);



    return (
        <div className={`item_container layout-column`}>
            <div className="layout-row">
                <div className="left-column border-bottom layout-column justify-content-center">
                    <div className="name">
                        <div className="cell">
                            <span className="runway-name" >名称</span>
                        </div>
                    </div>
                    <div className="state">
                        <div className="cell">
                            <span className={`status`}>{ `状态` }</span>
                        </div>
                    </div>
                </div>
                <div className="right-column border-bottom layout-row">
                    <div className="layout-column">
                        <div className="column-box  border-bottom">
                            <div className="cell" >{`方向`}</div>
                        </div>

                        <div className="column-box">
                            <div className="cell" >{`方向`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box  border-bottom">
                            <div className="cell" >{`用途`}</div>
                        </div>
                        <div className="column-box">
                            <div className="cell" >{`用途`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box  border-bottom">
                            <div className="cell" >{`间隔`}</div>
                        </div>
                        <div className="column-box">
                            <div className="cell" >{`间隔`}</div>
                        </div>
                    </div>
                    <div className="layout-column">
                        <div className="column-box border-bottom">
                            <div className="cell" >{`滑行`}</div>
                        </div>
                        <div className="column-box">
                            <div className="cell" >{`滑行`}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="layout-row">
                <div className="summary">
                    <SummaryCell 
                        publishTime= {`111`}
                        createTime= {`111`}
                        basicTacticInfoReasonZh= {`111`}
                        basicTacticInfoRemark= {`111`}
                    />
                </div>
                <div className="right-column2">
                    <div className="options-box layout-row">
                        <div className="opt" onClick={ e =>{
                            showDetail(e)
                            e.stopPropagation();
                        } }>详情</div>
                        <div className="opt" onClick={ showModify}>修改</div>
                        <div className="opt" onClick={ e=>{
                            stopControl(id);
                            e.stopPropagation();
                        }
                        }>终止</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default (observer(RunwayItem))
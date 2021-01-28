/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-01-28 17:13:51
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import {inject, observer} from 'mobx-react'
import { AlertOutlined  } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form } from "antd";
import { getFullTime, isValidVariable, formatTimeString, millisecondToDate } from 'utils/basic-verify'
import { REGEXP } from 'utils/regExpUtil'
import { data1, data24 } from '../../mockdata/static'

const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;


//动态容量配置
const CapacityTable = (props) => {
    const [ loading, setLoading ] = useState(false); 
    const [ tableData, setTableData ] = useState(false); 
    
    let [tableHeight, setTableHeight] = useState(0);


    const { capacity } = props;

    const renderEditCell = (text, record, index) => {
        return <span>{text}</span>
    }

     //处理列配置
    const getColumns = () => {
        let cColumns = [
            {
                title: "时间",
                dataIndex: "time",
                align: 'center',
                key: "time",
                fixed: 'left',
                width: (screenWidth > 1920) ? 100 : 100,
                render: (text, record, index) => {
                    return <span>{text}点</span>
                }
            },
            {
                title: "小时最大起降架次",
                dataIndex: "hourMaxDEPARR",
                align: 'center',
                key: "hourMaxDEPARR",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
            {
                title: "小时最大起飞架次",
                dataIndex: "hourMaxDEP",
                align: 'center',
                key: "hourMaxDEP",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
            {
                title: "小时最大降落架次",
                dataIndex: "hourMaxARR",
                align: 'center',
                key: "hourMaxARR",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
            {
                title: "15分钟最大起降架次",
                dataIndex: "quarterMaxDEPARR",
                align: 'center',
                key: "quarterMaxDEPARR",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
            {
                title: "15分钟最大起飞架次",
                dataIndex: "quarterMaxDEP",
                align: 'center',
                key: "quarterMaxDEP",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
            {
                title: "15分钟最大降落架次",
                dataIndex: "quarterMaxARR",
                align: 'center',
                key: "quarterMaxARR",
                width: (screenWidth > 1920) ? 100 : 100,
                render: renderEditCell
                
            },
        ];
        
        return cColumns
    }

    //获取数据
    useEffect(() => {
         if( props.type === "line1" ){
            setTableData( data1.list || []);
         }else if( props.type === "line24" ){
            setTableData( data24.list || []);
        }
        
        
        
    }, [])
    useEffect(() => {
        console.log(111);
        if( props.type === "line1" ){
            setTableHeight(100)
         }else if( props.type === "line24" ){
            
            const dom = document.getElementsByClassName("static_cap_modal_24")
            const boxContent = dom[0].getElementsByClassName("box_content")
            let height = boxContent[0].offsetHeight - 33;
            console.log("height",height)
            setTableHeight( height );
        }

    }, [tableHeight]);

    return (
        <div>
          <Table
              loading={loading}
              columns={ getColumns() }
              dataSource={ tableData }
              size="small"
              bordered
              pagination={false}
              scroll={{
                y: tableHeight
            }}
          /> 
        </div>
      );

}


export default inject( "capacity" )(observer(CapacityTable))


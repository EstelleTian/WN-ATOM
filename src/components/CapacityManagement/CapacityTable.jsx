/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-03-08 10:51:48
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import {inject, observer} from 'mobx-react'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { message, Table, Input, Button, Popconfirm, Tooltip, Form, Spin  } from "antd";
import { isValidVariable, isValidObject, getFullTime } from 'utils/basic-verify'
import { REGEXP } from 'utils/regExpUtil'
import { customNotice } from 'utils/common-funcs'
// import { data1, data24 } from '../../mockdata/static'
import './CapacityTable.scss'
const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;



const EditableRow = (props) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
      title,
      editing,
      children,
      dataIndex,
      record = {},
      handleSave,
      ...restProps
  }) => {
    const orgData = useRef();
    const form = useContext(EditableContext);

    useEffect(()=>{
        const obj = record[dataIndex] || {};
        orgData.current = obj.value*1 || "";
        if(editing){
            const obj = record[dataIndex] || {};
            const val = obj.value*1 || "";
            
            form.setFieldsValue({
                [dataIndex]: val,
            });
        }
    },[ editing ])

    
    const save = async () => {
        let subvalues = await form.validateFields();
            for(let key in subvalues){
                let resObj = record[key];
                resObj["value"] = subvalues[key]*1;
            }
            handleSave(record);
    };
    
    let curVal = "";
    if( isValidObject(record) &&  record[dataIndex].value ){
        curVal = record[dataIndex].value*1;
    }
    let flag = ( orgData.current > 0 ) && ( curVal > 0 ) && ( orgData.current !== curVal )

    const inputNode = <Input onBlur={ save }/>;
    return (
        <td {...restProps}>
            {
            editing 
                ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        className={` ${ flag ? "yellow" : ""}`}
                        rules={[
                            {
                                pattern: REGEXP.NUMBER3,
                                message: "请输入0~999的整数"
                            },
                          ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) 
                : (
                    children
                )
            }
        </td>
    );
};


 //处理列配置
 const getColumns = () => {
    const valRender = (text, record, index) => {
        let bgClass = "";
        let title = "";
        let showVal = text.value || "";
        if( text.hasOwnProperty("source") ){
            const source = text.source || "";
            
            switch( source ){
                case "1" : {
                    bgClass = "alarm alarm_green";
                    title = "大于同比静态容量值";
                    break;
                }
                case "2" : {
                    bgClass = "alarm alarm_orange";
                    title = "小于同比静态容量值 10%";
                    break;
                }
                case "3" : {
                    bgClass = "alarm alarm_red";
                    title = "小于同比静态容量值 20%";
                    break;
                }
                case "wait" : {
                    bgClass = "alarm alarm_yellow";
                    showVal = text.originalValue || "";
                    title = (
                        <span>
                            <div>容量待审核</div>
                            <div>原值:{text.value}</div>
                            <div>待审核值:{text.originalValue}</div>
                        </span>
                    );
                    break;
                }
                default: break;
            }
        }
        return <span className={bgClass} >
                <Tooltip title={title} color="">
                    <span>{ showVal || ""}</span>
                   { bgClass !== "" && <QuestionCircleOutlined className="cap_icon" style={{ fontSize: '0.9rem'}}/>} 
                </Tooltip>
            </span>
    }
    let cColumns = [
        {
            title: "时间",
            dataIndex: "capacityTime",
            align: 'center',
            key: "capacityTime",
            fixed: 'left',
            width: (screenWidth > 1920) ? 30 : 30,
            render: (text, record, index) => {
                if( text === "BASE" ){
                    return <span>全天</span>;
                }
                if( text*1 < 10){
                    text = '0'+text;
                }
                return <span>{text}时</span>
            }
        },
        {
            title: "小时最大起降架次",
            dataIndex: "capacityDetailsDepArr60",
            align: 'center',
            key: "capacityDetailsDepArr60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
            
        },
        {
            title: "小时最大起飞架次",
            dataIndex: "capacityDetailsDep60",
            align: 'center',
            key: "capacityDetailsDep60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
        },
        {
            title: "小时最大降落架次",
            dataIndex: "capacityDetailsArr60",
            align: 'center',
            key: "capacityDetailsArr60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
        },
        {
            title: "15分钟最大起降架次",
            dataIndex: "capacityDetailsDepArr15",
            align: 'center',
            key: "capacityDetailsDepArr15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
        },
        {
            title: "15分钟最大起飞架次",
            dataIndex: "capacityDetailsDep15",
            align: 'center',
            key: "capacityDetailsDep15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
        },
        {
            title: "15分钟最大降落架次",
            dataIndex: "capacityDetailsArr15",
            align: 'center',
            key: "capacityDetailsArr15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            render: valRender
            
        },
    ];
    return cColumns
}
//请求错误--处理
const requestErr = (err, content) => {
    message.error({
        content,
        duration: 10,
    });
}

const SaveBtn = function(props){
    const { save } = props;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    const showPopconfirm = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
      setConfirmLoading(true);
      save().then( res => {
           console.log("保存响应:",res);
           setConfirmLoading(false);
           setVisible(false);
           props.setEditable(false);
      }).catch( err => {
            setConfirmLoading(false);
            setVisible(false);
            // props.setEditable(false);
      })
    };
  
    const handleCancel = () => {
      setVisible(false);
    };
    return (
        <Popconfirm
            title="是否保存以下修改值"
            visible={visible}
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            <Button className="" type="primary" onClick={showPopconfirm}>保存 </Button>
        </Popconfirm>
    )
}

//设置表格行的 class
const setRowClassName = (record, index) => {
    let classStr = "";
    if( index % 2 === 0 ){
        classStr += " even";
    }else{
        classStr += " odd";
    }
    return classStr;
};

//动态容量配置
const CapacityTable = (props) => {
    const [ loading, setLoading ] = useState(false); 
    const [ tableData, setTableData ] = useState([]); 
    let [ tableHeight, setTableHeight ] = useState(0);
    let [ editable, setEditable] = useState(false);

    const { kind, capacity } = props;

    const handleSave = (row) => {
        const newData = [...tableData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
    };

    const updateOrgTableDatas = (kind, resolve, reject) => {
        
            // props.capacity.updateDatas( kind, tableData );
            let tableDataObj = {};
            tableData.map( item => {
                const key = item.capacityTime || "";
                if( key !== ""){
                    tableDataObj[key] = item;
                }
            })
            //发送保存请求
            let url = ReqUrls.capacityBaseUrl;
            let title = "";
            //传参
            let capacityData = {};
            if( kind === "default" || kind === "static"){
                url += "static/updateCapacityStatic"
                capacityData = props.capacity.staticData;
                title = "静态容量"
            }else if( kind === "dynamic"){
                if( !isValidObject(props.systemPage.user) || !props.systemPage.user.username){
                    return;
                }
                url += "simulationTactics/"+ props.systemPage.user.username
                capacityData = props.capacity.dynamicData;
                title = "动态容量"
            }
                
            const opt = {
                url,
                method: 'POST',
                params: {
                    elementName: "ZLXY",
                    capacityMap: tableDataObj
                },
                resFunc: (data)=> {
                    console.log(data);
                    const { capacityMap } = data;
                    for(let name in capacityMap){
                        const res = capacityMap[name] || {};
                        props.capacity.updateDatas( kind, res );
                    }
                    customNotice({
                        type: 'success',
                        message: title+'保存成功',
                        duration: 10,
                    });
                    resolve("success")
                },
                errFunc: (err, msg)=> {
                    customNotice({
                        type: 'error',
                        message: title+'保存失败'
                    });
                    resetOrgTableDatas();
                    reject("error")
                },
            };
            request(opt);
        
    }

    const resetOrgTableDatas = () => {
        const { capacity } = props;
        let obj = {};
        if( kind === "default" ){
            obj = {
                "data": capacity.defaultStaticData
            }
        }else if(kind === "static"){
            obj = {
                "data": capacity.customStaticData
            }
        }else if(kind === "dynamic"){
            obj = {
                "data": capacity.customDynamicData
            }
        }
        const dataArr = JSON.parse( JSON.stringify(obj)).data || [];
        setTableData( dataArr );
        
        // console.log("222", newData, props.capacity.defaultStaticData)
    }

    const mergedColumns = getColumns().map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: editable,
                handleSave
            }),
        };
    });



    const save = useCallback((e)=>{
        return new Promise((resolve, reject) =>{
             //更新初始化数据
             updateOrgTableDatas(kind, resolve, reject);
       })
    },
    [tableData]);

    
    useEffect(() => {
        resetOrgTableDatas();
        
    }, [kind, props.capacity.staticData, props.capacity.dynamicData ]);

    useEffect(() => {
        if( props.type === "line1" ){
            setTableHeight(80)
         }else if( props.type === "line24" ){
            const dom = document.getElementsByClassName("modal_"+kind)
            const boxContent = dom[0].getElementsByClassName("box_content")
            let height = boxContent[0].offsetHeight - 65;
            setTableHeight( height );
        }
    }, [tableHeight]);

    
    
    return (
        <Suspense fallback={<div className="load_spin"><Spin tip="加载中..."/></div>}>
            <div className="table_cont">
                <div className="opt_btns">
                    {
                        !editable
                            ? <Button className="" type="primary" onClick={e =>{
                                setEditable(true);
                            }}>修改 </Button>
                            : <span>
                                <SaveBtn save={save} setEditable={setEditable}/>
                                <Button className="reset" onClick={ e =>{
                                    resetOrgTableDatas();
                                    setEditable(false);
                                } }> 取消 </Button>
                            </span>
                    }

                </div>
                {
                    tableData.length > 0 
                    && <Table
                            components={{
                                body: {
                                    row: EditableRow,
                                    cell: EditableCell,
                                },
                            }}
                            loading={ loading }
                            columns={ mergedColumns }
                            dataSource={ tableData }
                            size="small"
                            bordered
                            pagination={false}
                            scroll={{
                                x: 350,
                                y: tableHeight
                            }}
                            rowClassName={ setRowClassName }
                            className="capacity_number_table"
                        />
                }
                   
            </div>
        </Suspense>
      );

}


export default inject( "capacity", "systemPage" )(observer(CapacityTable))


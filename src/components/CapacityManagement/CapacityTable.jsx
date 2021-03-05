/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-03-05 13:28:33
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import {inject, observer} from 'mobx-react'
import { request } from 'utils/request'
import { ReqUrls } from 'utils/request-urls'
import { message, Table, Input, Button, Popconfirm, Form, Spin  } from "antd";
import { isValidVariable, getFullTime } from 'utils/basic-verify'
import { REGEXP } from 'utils/regExpUtil'
import { customNotice } from 'utils/common-funcs'
// import { data1, data24 } from '../../mockdata/static'
import './CapacityTable.scss'
const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const rules  = [
    {
        pattern: REGEXP.NUMBER3,
        message: "请输入0~999的整数"
    },
    {
        validator: (rule, value) => {
            if(value.trim() !== ""){
                return Promise.resolve();
            }
            return Promise.reject();
        },
        message: `必填项`,
    }
];

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
      record,
      handleSave,
      ...restProps
  }) => {
    const orgData = useRef();
    const form = useContext(EditableContext);

    useEffect(()=>{
        orgData.current = record || {};
    },[ editing ])

    if(editing){
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    }
    const save = async () => {
        try {
            let subvalues = await form.validateFields();
            let values = { ...record, ...subvalues };
            handleSave(values);
        } catch (errInfo) {
            
        }
    };
    
    let orgVal = "";
    if( isValidVariable(orgData.current) && orgData.current.hasOwnProperty(dataIndex) ){
        orgVal = orgData.current[dataIndex]*1;
    }
    let curVal = "";
    if( isValidVariable(record) &&  record[dataIndex] ){
        curVal = record[dataIndex]*1;
    }
    let flag = ( orgVal > 0 ) && ( curVal > 0 ) && ( orgVal != curVal )

    const inputNode = <Input onBlur={ save }/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    className={` ${ flag ? "yellow" : ""}`}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


 //处理列配置
 const getColumns = () => {
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
            dataIndex: "capacityDepArr60",
            align: 'center',
            key: "capacityDepArr60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            
            
        },
        {
            title: "小时最大起飞架次",
            dataIndex: "capacityDep60",
            align: 'center',
            key: "capacityDep60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,
            
            
        },
        {
            title: "小时最大降落架次",
            dataIndex: "capacityArr60",
            align: 'center',
            key: "capacityArr60",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,

            
        },
        {
            title: "15分钟最大起降架次",
            dataIndex: "capacityDepArr15",
            align: 'center',
            key: "capacityDepArr15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,

            
        },
        {
            title: "15分钟最大起飞架次",
            dataIndex: "capacityDep15",
            align: 'center',
            key: "capacityDep15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,

            
        },
        {
            title: "15分钟最大降落架次",
            dataIndex: "capacityArr15",
            align: 'center',
            key: "capacityArr15",
            editable: true,
            width: (screenWidth > 1920) ? 50 : 50,

            
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
      setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 2000);
    };
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
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
            <Button className="" size="small" type="primary" onClick={showPopconfirm}>保存 </Button>
        </Popconfirm>
    )
}
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
        setTableData(newData)

    };

    const updateOrgTableDatas = (kind) => {
        props.capacity.updateDatas( kind, tableData );
        //发送保存请求
        let url = ReqUrls.capacityBaseUrl;
        let title = "";
        //传参
        let params = [];
        if( kind === "default" || kind === "static"){
            url += "static/updateCapacityStatic"
            params = Object.values(props.capacity.staticData);
            title = "静态容量"
        }else if( kind === "dynamic"){
            url += "dynamic/updateCapacity"
            params = Object.values(props.capacity.dynamicData);
            title = "动态容量"
        }
            
        const opt = {
            url,
            method: 'POST',
            params: params,
            resFunc: (data)=> {
                console.log(data);
                const { resultMap } = data;
                for(let name in resultMap){
                    const dataArr = resultMap[name];
                    if( dataArr.length > 0 ){
                      props.capacity.updateDatas( kind, dataArr );
                    }
                }
                customNotice({
                    type: 'success',
                    message: title+'保存成功',
                    duration: 10,
                })
            },
            errFunc: (err, msg)=> {
                customNotice({
                    type: 'error',
                    message: title+'保存失败'
                })
            },
        };
        request(opt);

        
       
    }

    const resetOrgTableDatas = (kind) => {
        if( kind === "default" ){
            setTableData( props.capacity.defaultStaticData );
        }else if(kind === "static"){
            setTableData( props.capacity.customStaticData );
        }else if(kind === "dynamic"){
            setTableData( props.capacity.customDynamicData );
        }
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

    //设置表格行的 class
    const setRowClassName = useCallback((record, index) => {
        let classStr = "";
        if( index % 2 === 0 ){
            classStr += " even";
        }else{
            classStr += " odd";
        }
        return classStr;
    },[]);

    const save = useCallback(
        (e) =>{
            setEditable(false);
            //更新初始化数据
            updateOrgTableDatas(kind)
        },
        [],
    )
    
    useEffect(() => {
        if( kind === "default" ){
            setTableData( props.capacity.defaultStaticData );
        }else if(kind === "static"){
            setTableData( props.capacity.customStaticData );
        }else if(kind === "dynamic"){
            setTableData( props.capacity.customDynamicData );
        }
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
                            ? <Button className="" size="small" type="primary" onClick={e =>{
                                setEditable(true);
                            }}>修改 </Button>
                            : <span>
                                <SaveBtn save={save}/>
                                <Button className="reset" size="small" onClick={ e =>{
                                    setEditable(false);
                                    resetOrgTableDatas(kind);
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
                            loading={loading}
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


export default inject( "capacity" )(observer(CapacityTable))


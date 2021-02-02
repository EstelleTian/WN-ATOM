/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-02-02 14:32:05
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from "react";
import {inject, observer} from 'mobx-react'
import { AlertOutlined  } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form } from "antd";
import { getFullTime, isValidVariable, formatTimeString, millisecondToDate } from 'utils/basic-verify'
import { REGEXP } from 'utils/regExpUtil'
import { data1, data24 } from '../../mockdata/static'
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

const EditableRow = ({ index, ...props }) => {
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
    const form = useContext(EditableContext);

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

    let flag = false;
    if( isValidVariable(record) ){
        const recordObj = JSON.parse( record.time ) || {};
        const orgVal = recordObj[dataIndex]*1;
        const curVal = record[dataIndex]*1;
        flag = ( orgVal > 0 ) && ( curVal > 0 ) && ( orgVal != curVal )
    }

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
//动态容量配置
class CapacityTable extends React.Component{
    constructor(props){
        super(props);
        this.mergedColumns = [];
        this.state = {
            loading: false,
            tableData: [],
            tableHeight: 0,
            editable: false
        };
    }
    //处理列配置
    getColumns=()=>{
        let cColumns = [
            {
                title: "时间",
                dataIndex: "time",
                align: 'center',
                key: "time",
                fixed: 'left',
                width: (screenWidth > 1920) ? 30 : 30,
                render: (text, record, index) => {
                    const time = JSON.parse( record.time );
                    const val = time.time || "全天";
                    if( val === "全天" ){
                        return <span>{val}</span>;
                    }
                    return <span>{val}点</span>
                }
            },
            {
                title: "小时最大起降架次",
                dataIndex: "hourMaxDEPARR",
                align: 'center',
                key: "hourMaxDEPARR",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                
                
            },
            {
                title: "小时最大起飞架次",
                dataIndex: "hourMaxDEP",
                align: 'center',
                key: "hourMaxDEP",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,
                
                
            },
            {
                title: "小时最大降落架次",
                dataIndex: "hourMaxARR",
                align: 'center',
                key: "hourMaxARR",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,

                
            },
            {
                title: "15分钟最大起降架次",
                dataIndex: "quarterMaxDEPARR",
                align: 'center',
                key: "quarterMaxDEPARR",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,

                
            },
            {
                title: "15分钟最大起飞架次",
                dataIndex: "quarterMaxDEP",
                align: 'center',
                key: "quarterMaxDEP",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,

                
            },
            {
                title: "15分钟最大降落架次",
                dataIndex: "quarterMaxARR",
                align: 'center',
                key: "quarterMaxARR",
                editable: true,
                width: (screenWidth > 1920) ? 50 : 50,

                
            },
        ];
        return cColumns
    }

    handleTableHeight=()=>{
        if( this.props.type === "line1" ){
            this.setState({
                tableHeight: 100
            })
         }else if( this.props.type === "line24" ){
            const dom = document.getElementsByClassName("static_cap_modal_24")
            const boxContent = dom[0].getElementsByClassName("box_content")
            let height = boxContent[0].offsetHeight - 80;
            this.setState({
                tableHeight: height
            })
        }
    }

    handleSave=(row)=>{
        console.log("保存row", row);
        const newData = [...this.state.tableData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            tableData: newData
        })

    };
    
    updateOrgTableDatas=()=>{
        let newTableData = [];
        this.state.tableData.map( item => {
            let values = item;
            let timeObj = JSON.parse(values.time);
            values.time = timeObj.time;
            const newStr = JSON.stringify(values);
            values.time = newStr;
            newTableData.push(values);
        })
        this.setState({
            tableData: newTableData
        })
    }

    resetOrgTableDatas=()=>()=>{
        let newTableData = [];
        this.state.tableData.map( item => {
            let obj = {};
            let timeStr = item.time;
            let timeObj = JSON.parse(timeStr);
            obj = {...item, ...timeObj};
            obj.time = timeStr;
            newTableData.push(obj);
        })
        // this.setState({
        //     tableData: newTableData
        // })
    }

    componentDidMount(){
        if( this.props.type === "line1" ){
            this.setState({
                tableData:data1.list || []
            })
         }else if( this.props.type === "line24" ){
            this.setState({
                tableData:data24.list || []
            })
        }
        this.handleTableHeight();
        this.mergedColumns = this.getColumns().map((col) => {
            if (!col.editable) {
                return col;
            }
    
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.state.editable,
                    handleSave: this.handleSave,
                }),
            };
        });
    }
    componentDidUpdate(){

    }
    render(){
        console.log("render~~");
        
        return (
            <div className="table_cont">
                <div className="opt_btns">
                    {
                        !this.state.editable
                            ? <Button className="" size="small" type="primary" onClick={e =>{
                                this.setState({
                                    editable: true
                                })
                            }}>修改 </Button>
                            : <span>
                                <Button className="" size="small" type="primary"  onClick={e =>{
                                    this.setState({
                                        editable: false
                                    })
                                    //更新初始化数据
                                    // this.updateOrgTableDatas()
                                }}>保存 </Button>
                                <Button className="reset" size="small" onClick={ this.resetOrgTableDatas() }>重置 </Button>
                            </span>
                    }
    
                </div>
                    <Table
                        components={{
                            body: {
                                row: EditableRow,
                                cell: EditableCell,
                            },
                        }}
                        loading={this.state.loading}
                        columns={ this.mergedColumns }
                        dataSource={ this.state.tableData }
                        size="small"
                        bordered
                        pagination={false}
                        scroll={{
                            x: 350,
                            y: this.state.tableHeight
                        }}
                    />
    
            </div>
          );
    
    }

}


export default inject( "capacity" )(observer(CapacityTable))


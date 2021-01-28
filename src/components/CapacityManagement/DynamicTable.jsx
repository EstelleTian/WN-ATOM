import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import {inject, observer} from 'mobx-react'
import { AlertOutlined  } from '@ant-design/icons';
import { Table, Input, Button, Popconfirm, Form } from "antd";
import { getFullTime, isValidVariable, formatTimeString, millisecondToDate } from 'utils/basic-verify'
import { REGEXP } from 'utils/regExpUtil'

const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

//生成24*4时间刻度
let tArr = [];
for( let i = 0; i<24; i++){
    let hour = ( i< 10) ? "0"+i : i;
    hour = hour + "";
    for( let j = 0; j < 4; j++){
        let min = "00";
        switch(j){
            case 0: min = "00";break;
            case 1: min = "15";break;
            case 2: min = "30";break;
            case 3: min = "45";break;
        }
        
        tArr.push(hour+min);
    }
}

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
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    hasChanged,
    ...restProps
    }) => {
        
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
    useEffect(function(){
        if(isValidVariable(dataIndex)){
            form.setFieldsValue({
                [dataIndex]: record[dataIndex]
            });
        }
        
    },[dataIndex])

  

  const save = async () => {
    try {
      let values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    const newVal = record[dataIndex]*1;
    const orgVal = JSON.parse( record.time )[dataIndex]*1;
    const flag = newVal !== orgVal;
    childNode = <Form.Item
        style={{
            margin: 0
        }}
        name={dataIndex}
        rules={[
            {
                pattern: REGEXP.NUMBER3,
                message: "请输入0~999范围内的整数"
            },
            {
                required: true,
                message: `${title}不可为空`,
            }
        ]}
        >
        <Input className={` ${flag ? "yellow" : ""} `} ref={inputRef} onPressEnter={save} onBlur={save} />
    </Form.Item>
    
  }

  return <td {...restProps}>{childNode}</td>;
};


 //处理列配置
 const getColumns = () => {
    let cColumns = [
        {
            title: "",
            dataIndex: "time",
            align: 'center',
            key: "time",
            fixed: 'left',
            width: (screenWidth > 1920) ? 100 : 100,
            render: (text, record, index) => {
                const key = record.key || "";
                const time = JSON.parse( record.time ) || {};

                const showText = time.time || "";
                return (
                    <div className="">1111</div>
                )
            }
        },
    ];
    tArr.map( key => {
        cColumns.push({
            title: key,
            dataIndex: key,
            align: 'center',
            key: key,
            width: 60,
            editable: true
        });
        
    });
    return cColumns
}

//处理为表格格式数据
const convertToTableData = () => {
    let dataArr = [];

    let obj = {
        key: "capacityVal",
        time: "容量值",
    }
    tArr.map( key => {
        obj[key] = 30;
    });
    dataArr.push(obj);
    obj.time = JSON.stringify(obj);

    let obj2 = {
        key: "capacityL1",
        time: "超容告警",
    }
    tArr.map( key => {
        obj2[key] = 2;
    });
    dataArr.push(obj2);
    obj2.time = JSON.stringify(obj2);

    let obj3 = {
        key: "capacityL2",
        time: "超容告警",
    }
    tArr.map( key => {
        obj3[key] = 8;
    });
    dataArr.push(obj3);
    obj3.time = JSON.stringify(obj3);

    let obj4 = {
        key: "capacityL3",
        time: "超容告警",
    }
    tArr.map( key => {
        obj4[key] = 12;
    });
    dataArr.push(obj4);
    obj4.time = JSON.stringify(obj4);

    return dataArr;
    
}

//动态容量配置
const DynamicTable = (props) => {
    const [ loading, setLoading ] = useState(false); 

    const { capacity } = props;
    //数据保存
    const handleSave = (row) => {
        // console.log(tableData);
        let newData = [...tableData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row }); //行数据替换
        setTableData(newData);
    }
    

    useEffect(() => {
        capacity.setDynamicTableColumns( getColumns() );
        
        capacity.setDynamicTableDatas( convertToTableData() );
    }, []);

    const getNewColumns = function(){
        console.log("aaaaaa",capacity.getDynamicTableColumns);
        let newColumns = [];
        capacity.getDynamicTableColumns.map((col) => {

            if( col.dataIndex === "time" ){
                newColumns.push( {
                    ...col,
                    render: (text, record, index) => {
                        const key = record.key || "";
                        const time = JSON.parse( record.time ) || {};
        
                        const showText = time.time || "";
                        return (
                            <div className="">
                                {showText}
                                { key === "capacityL1" ? <AlertOutlined className="alarm alarm_yellow"/> : "" }
                                { key === "capacityL2" ? <AlertOutlined className="alarm alarm_orange"/> : "" }
                                { key === "capacityL3" ? <AlertOutlined className="alarm alarm_red"/> : "" }
                            </div>
                        )
                    }
                })
            }else{
                newColumns.push( {
                    ...col,
                    render: (text, record, index) => {
                        return (
                            <div className="num_cell">
                                {text}
                            </div>
                        )
                    } });
                // if (!col.editable) {
                //     newColumns.push( col );
                // }
                // newColumns.push( {
                //     ...col,
                //     onCell: (record) => ({
                //         record,
                //         editable: col.editable,
                //         dataIndex: col.dataIndex,
                //         title: col.title,
                //         handleSave: handleSave,
                //         hasChanged: true
                //     })
                // })
            }
    
         
        });
        return newColumns;
    }

    return (
        <div>
          <Table
            //   components={{
            //     body: {
            //       row: EditableRow,
            //       cell: EditableCell
            //     }
            //   }}
              loading={loading}
              rowClassName={() => "editable-row"}
              columns={ getNewColumns() }
              dataSource={ capacity.dynamicTableDatas }
              size="small"
              bordered
              pagination={false}
                scroll = {{
                    x: 1000
                }}
          /> 
        </div>
      );

}


export default inject( "capacity" )(observer(DynamicTable))

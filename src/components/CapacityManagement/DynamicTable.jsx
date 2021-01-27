import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
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
console.log(tArr);

let tableData = [];
let cColumns = [
    {
        title: "",
        dataIndex: "time",
        align: 'center',
        key: "time",
        fixed: 'left',
        width: (screenWidth > 1920) ? 100 : 100,
        render: (text, record, index) => {
            return (
                <div className="">{text}</div>
            )
        }
    },
];
let obj = {
    key: "capacityVal",
    time: "容量值",
}
tArr.map( key => {
    obj[key] = 30;
    cColumns.push({
        title: key,
        dataIndex: key,
        align: 'center',
        key: key,
        width: 60,
        editable: true
    });
})

tableData.push(obj);


console.log(cColumns);
console.log(tableData);




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
    let orgVal = record.time[dataIndex]*1;
    let hasChanged = (orgVal !== record[dataIndex]*1);
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
        <Input className={` ${hasChanged ? "yellow" : ""} `} ref={inputRef} onPressEnter={save} onBlur={save} />
    </Form.Item>
    
  }

  return <td {...restProps}>{childNode}</td>;
};




//动态容量配置
const DynamicTable = (props) => {
    const [ columns, setColumns ] = useState([]); //表格列配置
    const [ tableData, setTableData ] = useState([]); //表格数据

    //数据保存
    const handleSave = useCallback(
        (row) => {
            const newData = [...dataSource];
            const index = newData.findIndex((item) => row.key === item.key);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row }); //行数据替换
            setDataSource(newData);
        },
        [dataSource]
    );
    
    columns = cColumns.map((col) => {
    if (!col.editable) {
        return col;
    }
    return {
        ...col,
        onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        hasChanged: true
        })
    };
    });

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
                    return (
                        <div className="">{text}</div>
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
        setColumns(cColumns);
    }

    useEffect(() => {
        getColumns();
    }, [])
    
    return (
        <div>
          <Table
              components={{
                body: {
                  row: EditableRow,
                  cell: EditableCell
                }
              }}
              rowClassName={() => "editable-row"}
              columns={ columns }
              dataSource={ tableData }
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


export default DynamicTable

//流控关联模块
import React, {useState} from 'react'
import {Button, Modal, Table } from "antd";

const columns = [
    {
        title: '流控id',
        dataIndex: 'id',
    },{
        title: '流控名称',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
    },{
        title: '创建时间',
        dataIndex: 'generateTime',
    },
    {
        title: '限制间隔',
        dataIndex: 'resValue',
    },

];
const data = [
    {
        key: '1001',
        id: '1001',
        name: '过IGADA进郑州区域20分钟一架',
        generateTime: '2020-12-30 15:00',
        resValue: '20',
    },
    {
        key: '1002',
        id: '1002',
        name: '过P40往成都方向15分钟一架 ',
        generateTime: '2020-12-30 15:01',
        resValue: '15',
    },
    {
        key: '1003',
        id: '1003',
        name: '过P40往武汉方向15分钟一架',
        generateTime: '2020-12-30 15:02',
        resValue: '15',
    },
    {
        key: '1004',
        id: '1004',
        name: '过IGADA进郑州区域20分钟一架',
        generateTime: '2020-12-30 15:03',
        resValue: '20',
    },
];




function FlowRelation(  ){
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState("");
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        Modal.success({
            content: selectedKeys+"流控关联成功",
            onOk: function(close){
                console.log(close)
                close();
                setIsModalVisible(false);
            }
        });

        // setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedKeys(selectedRowKeys)
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    return(
        <span>
            <Button onClick={ showModal } >关联前后序</Button>
             <Modal
                 className="nw_modal"
                 width={700}
                 title="关联流控前后序"
                 maskClosable={false}
                 visible={isModalVisible}
                 onCancel={handleCancel}
                footer = {
                    <div>
                        <Button type="primary" onClick={handleOk}>确认</Button>
                        <Button  onClick={handleCancel}>取消</Button>
                    </div>
                }
              >
                <Table
                    rowSelection={{
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
              </Modal>
        </span>
    )
}

export default FlowRelation
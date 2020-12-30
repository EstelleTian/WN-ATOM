//流控关联模块
import React, {useState} from 'react'
import {Button, Col, Modal, Row, Table} from "antd";
import { formatTimeString } from 'utils/basic-verify'
const columns = [
    {
        title: '方案名称',
        dataIndex: 'name',

    },{
        title: '原始方案',
        dataIndex: 'orgname',
    },

];
const data = [
    {
        key: '1001',
        name: '06/1835-华中-郑州-军事活动',
        orgname: '06/1800-华中-郑州-军事活动',
    },
    {
        key: '1002',
        name: '06/1835-西南-成都-军事活动',
        orgname: '06/1555-西南-成都-军事活动',
    },
    {
        key: '1003',
        name: '06/1835-西南-成都-军事活动',
        orgname: '06/1555-西南-成都-军事活动',
    },
    {
        key: '1004',
        name: '06/1835-西南-成都-军事活动',
        orgname: '06/1555-西南-成都-军事活动',
    },
];




function FlowRelation( props ){
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

    const { message } = props;
    let {sendTime, content, name, source } = message;
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
                 <div className="card_detail">
                     <div>消息内容</div>
                    <Row>
                        <Col span={2} className="name">时间：</Col>
                        <Col span={8} className="text send_time">{ formatTimeString( sendTime ) }</Col>
                    </Row>
                    <Row>
                        <Col span={2} className="name">名称：</Col>
                        <Col span={22} className="text send_time">{ name }</Col>
                    </Row>
                    <Row>
                        <Col span={2} className="name">来源：</Col>
                        <Col span={22} className="text send_time">{ source }</Col>
                    </Row>
                    <Row>
                        <Col span={2} className="name">内容：</Col>
                        <Col span={22} className="text send_time">{  content  }</Col>
                    </Row>
                </div>

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

/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useEffect, useCallback, useRef, useState } from "react";
import { Table, Select, Tag, Menu } from "antd";
import { observer, inject } from "mobx-react";
import { isValidVariable } from 'utils/basic-verify';
import { requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
// import './TodoNav.scss'
const { Option } = Select;



function FlightTableFontSizeConfigTable(props) {
  const { systemPage = {}, flightTableFontSizeData = {} } = props;
  const user = systemPage.user || {};
  const columnFontSizeData = flightTableFontSizeData.columnFontSizeData || {}
  const activeParameterConfigModal = systemPage.activeParameterConfigModal || "";
  // 字号选择器选项值
  const options = [
    {
      value: "16px",
      text: "16px",
    },
    {
      value: "18px",
      text: "18px",
    },
    {
      value: "20px",
      text: "20px",
    },
    {
      value: "22px",
      text: "22px",
    },
    {
      value: "24px",
      text: "24px",
    },
    {
      value: "26px",
      text: "26px",
    },
    {
      value: "28px",
      text: "28px",
    },
    {
      value: "30px",
      text: "30px",
    },
    {
      value: "32px",
      text: "32px",
    },
  ]
  // 字号选择器选项
  const selectOptions = options.map((item) => <Option key={item.value}>{item.text}</Option>)
  // 列
  const columns = [
    {
      title: '列名称',
      dataIndex: 'columnName',
      key: 'columnName',
      align: "center",
      width: 300,
      render: (text, record, index) => (
        <div className="cell_left col-name-cell">{text}</div>
      ),
      sorter: (a, b) => a.columnName.localeCompare(b.columnName),
    },
    {
      title: '显示示例',
      dataIndex: 'example',
      key: 'example',
      align: "center",
      render: (text, record, index) => (
        <div className="cell_center" style={{ fontSize: record.fontSize }}>{text}</div>
      ),
    },
    {
      title: '字号',
      dataIndex: 'fontSize',
      key: 'fontSize',
      align: "center",
      render: (text, record, index) => (
        <div className="cell_center">
          <Select style={{ width: 120 }} defaultValue={text} onChange={(value) => { handleFontSizeChange(value, record) }}>
            {selectOptions}
          </Select>
        </div>
      ),
      width: 300,
    },
  ];



  let data1 = [
    {
      key: '1',
      columnName: 'aaa',
      example: "example",
      fontSize: columnFontSizeData['aaa'] || '16px',
    },
  ];
  // for (let i = 0; i < 20; i++) {
  //   let d = {
  //     key: '1' + i,
  //     columnName: 'aaa' + i,
  //     example: 'example' + i,
  //     fontSize: columnFontSizeData['aaa' + i] || '16px',
  //   };
  //   data1.push(d);
  // }
  // 字号变更
  const handleFontSizeChange = (value, record) => {
    const columnName = record.columnName;
    console.log(columnName)
    flightTableFontSizeData.updateColumnFontSizeData(columnName, value);
  }

  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={data1}
        size="small"
        bordered
        pagination={false}
        className="font-size-table"
        scroll={{
          y: "70vh",
        }}
      // onChange={onChange}
      // rowClassName={setRowClassName}
      />
    </Fragment>

  )
}

export default inject("systemPage", "flightTableFontSizeData")(observer(FlightTableFontSizeConfigTable))
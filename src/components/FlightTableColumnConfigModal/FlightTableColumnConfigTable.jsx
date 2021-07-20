
/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-04-09 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, { Fragment, useState, useCallback, useRef, useEffect } from 'react';
import { Table, Checkbox, Button } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { observer, inject } from "mobx-react";
import { request } from "utils/request";
import { isValidObject, isValidVariable } from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";

const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};



function FlightTableColumnConfigTable(props) {

  const { systemPage = {}, } = props;
  const user = systemPage.user || {};
  const userId = user.id || "";
  const activeSystem = systemPage.activeSystem || {};
  const systemType = activeSystem.systemType || ""

  function onChange(e, text, record, index) {
    let checked = e.target.checked;
    let display = checked ? 1 : 0;
    let newValue = { ...record, display };
    console.log(newValue);
  }

  const columns = [
    {
      title: '列名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '列显示',
      dataIndex: 'display',
      key: 'display',
      align: "center",
      render: (text, record, index) => (
        <div className="cell_center" ><Checkbox onChange={(e) => { onChange(e, text, record, index) }} checked={text === 1 ? true : false}></Checkbox></div>
      ),
    },
  ];
  const [data, setData] = useState([
    {
      key: '0',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '1',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '2',
      name: 'Joe Black',
      display: 3,
    },
    {
      key: '4',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '5',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '6',
      name: 'Joe Black',
      display: 3,
    },
    {
      key: '3',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '7',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '8',
      name: 'Joe Black',
      display: 3,
    },
    {
      key: '9',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '10',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '11',
      name: 'Joe Black',
      display: 3,
    },
    {
      key: '12',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '13',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '14',
      name: 'Joe Black',
      display: 3,
    },
    {
      key: '15',
      name: 'John Brown',
      display: 1,
    },
    {
      key: '16',
      name: 'Jim Green',
      display: 2,
    },
    {
      key: '17',
      name: 'Joe Black',
      display: 3,
    },
  ]);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

   //获取配置数据
   const fetchConfigData = () => {
    const opt = {
        url: ReqUrls.flightTableColumnConfigUrl + "?userId="+ userId+"&keys="+systemType,
        method: "GET",
        resFunc: (data) => fetchSuccess(data),
        errFunc: (err) => fetchErr(err),
    };
    request(opt);
};

//获取配置数据成功
const fetchSuccess = (data) => {
    console.log(data);
    const { userPropertys =[]} = data;
    let propertys = userPropertys[0] || {};
    let value = propertys.value || "{}";
    let configData = JSON.parse(value);
    console.log(configData)
    
    // ATOMConfigFormData.updateConfigData(obj);
};

//数据获取失败回调
const fetchErr = (err) => {
    // ATOMConfigFormData.updateConfigData({});
    let errMsg = "";
    if (isValidObject(err) && isValidVariable(err.message)) {
        errMsg = err.message;
    } else if (isValidVariable(err)) {
        errMsg = err;
    }
    Modal.error({
        title: "获取失败",
        content: (
            <span>
                <span>获取表格列配置数据失败</span>
                <br />
                <span>{errMsg}</span>
            </span>
        ),
        centered: true,
        okText: "确定",
    });
};

  // 初始化获取配置数据
  useEffect(function () {
    if(isValidVariable(userId) && isValidVariable(systemType)){
      //获取配置数据
      fetchConfigData();
    }
}, [userId, systemType]);
  return (
    < Fragment>
      <DndProvider backend={HTML5Backend}>
        <Table
          className="col-config-table"
          columns={columns}
          dataSource={data}
          components={components}
          pagination={false}
          scroll={{
            y: "65vh",
          }}
          onRow={(record, index) => ({
            index,
            moveRow,
          })}
        />
      </DndProvider>
      <div>
        <Button>sss</Button>
        <Button>dddd</Button>
      </div>
    </Fragment>
  )

}

export default inject("systemPage")(observer(FlightTableColumnConfigTable))
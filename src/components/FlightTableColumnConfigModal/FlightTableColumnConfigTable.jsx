/*
 * @Author: your name
 * @Date: 2021-03-04 16:39:47
 * @LastEditTime: 2021-07-20 20:01:36
 * @LastEditors: Please set LastEditors
 * @Description: 航班协调-按钮+模态框
 * @FilePath: \WN-ATOM\src\components\NavBar\TodoNav.jsx
 */
import React, {
  Fragment,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Table, Checkbox, Button } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { observer, inject } from "mobx-react";
import { request } from "utils/request";
import { isValidObject, isValidVariable } from "utils/basic-verify";
import { ReqUrls } from "utils/request-urls";

const type = "DragableBodyRow";

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  record = {},
  ...restProps
}) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
      record={record}
    />
  );
};

const CheckCell = ({ record = {}, children, ...restProps }) => {
  console.log("props", record);
  const dataIndex = restProps.dataIndex || "";
  const onChange = restProps.onChange || "";
  if (dataIndex === "display") {
    return (
      <td>
        <div className="cell_center">
          <Checkbox
            onChange={(e) => {
              if (typeof onChange === "function") {
                onChange(e, record);
              }
            }}
            checked={record.display * 1 === 1 ? true : false}
          ></Checkbox>
        </div>
      </td>
    );
  } else {
    return <td>{children}</td>;
  }
};

const FlightTableColumnConfigTable = ({ systemPage, columnConfig }) => {
  //数据
  // const [data, setData] = useState([
  //   {
  //     key: "0",
  //     name: "John Brown",
  //     display: 1,
  //   },
  //   {
  //     key: "1",
  //     name: "Jim Green",
  //     display: 0,
  //   },
  //   {
  //     key: "2",
  //     name: "Joe Black",
  //     display: 1,
  //   },
  //   {
  //     key: "4",
  //     name: "John Brown",
  //     display: 0,
  //   },
  // ]);

  // function onChange(e, record) {
  //   let checked = e.target.checked;
  //   let display = checked ? 1 : 0;
  //   let copyData = columnConfig.columnData;
  //   const key = record.key * 1;
  //   copyData[key].display = display;
  //   console.log(record);
  //   columnConfig.setColumnData(copyData);
  // }

  function onChange(e, text, record, index) {
    let checked = e.target.checked;
    let display = checked ? 1 : 0;
    // let copyData = columnConfig.columnData;
    // copyData[index].display = display;
    console.log(record);
    let obj = { ...record, display };
    let en = obj.en || "";
    columnConfig.updateColumnData({ [en]: obj });
  }

  const columns = [
    {
      title: "列名称",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <div className="">{`${record.en}—${record.cn}`}</div>
      ),
      // onCell: (record) => ({
      //   dataIndex: "name",
      //   record,
      //   onChange,
      // }),
    },
    {
      title: "列显示",
      dataIndex: "display",
      key: "display",
      align: "center",
      // onCell: (record) => ({
      //   dataIndex: "display",
      //   record,
      //   onChange,
      // }),
      render: (text, record, index) => {
        // console.log(record);
        return (
          <div className="cell_center">
            <Checkbox
              onChange={(e) => {
                onChange(e, text, record, index);
              }}
              checked={record.display * 1 === 1 ? true : false}
            ></Checkbox>
          </div>
        );
      },
    },
  ];

  const components = {
    body: {
      row: DragableBodyRow,
      // cell: CheckCell,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dataArr = Object.values(columnConfig.columnData) || [];
      const dragRow = dataArr[dragIndex];
      const newData = update(dataArr, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      // console.log(newData);
      const newObj = {};
      for (let i in newData) {
        const item = newData[i] || {};
        const en = item.en || "";
        newObj[en] = item;
      }
      columnConfig.setColumnData(newObj);
    },
    [columnConfig.columnData]
  );

  // const dataSource = useMemo(() => {
  //   console.log("触发更新");
  //   // let data = columnConfig.columnData || [];
  //   // data.map((item) => {
  //   //   item.display = (
  //   //     <div className="cell_center">
  //   //       <Checkbox
  //   //         onChange={(e) => {
  //   //           onChange(e, text, record, index);
  //   //         }}
  //   //         checked={item.display * 1 === 1 ? true : false}
  //   //       ></Checkbox>
  //   //     </div>
  //   //   );
  //   // });
  //   return columnConfig.columnData;
  // }, [columnConfig.columnData]);
  // console.log("表格列配置数据：", { ...columnConfig.columnData });
  return (
    <Fragment>
      <DndProvider backend={HTML5Backend}>
        <Table
          className="col-config-table"
          columns={columns}
          dataSource={Object.values(columnConfig.columnData)}
          components={{
            body: {
              row: DragableBodyRow,
              // cell: CheckCell,
            },
          }}
          pagination={false}
          scroll={{
            y: "65vh",
          }}
          onRow={(record, index) => ({
            index,
            record,
            moveRow,
          })}
        />
      </DndProvider>
    </Fragment>
  );
};

export default inject(
  "systemPage",
  "columnConfig"
)(observer(FlightTableColumnConfigTable));

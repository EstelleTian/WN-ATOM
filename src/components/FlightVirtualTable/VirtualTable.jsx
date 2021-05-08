import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { inject, observer } from "mobx-react";
import classNames from "classnames";
import { isValidVariable, formatTimeString } from "utils/basic-verify";
import { getColumns, formatSingleFlight } from "./TableColumns";

import "./VirtualTable.scss";

import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import "rsuite-table/lib/less/index.less"; // or 'rsuite-table/dist/css/rsuite-table.css'

function useAutoSize() {
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
    console.log("tableWidth, tableHeight: ", tableWidth, tableHeight);
    const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
    const boxContent = flightCanvas.getElementsByClassName("box_content")[0];

    let width = boxContent.offsetWidth;
    let height = boxContent.offsetHeight;
    // height -= 40; //表头高度
    if (Math.abs(tableHeight - height) > 5) {
      setHeight(height);
    }
    setWidth(width);

    flightCanvas.oncontextmenu = function () {
      return false;
    };
  }, [tableWidth, tableHeight]);

  return { tableWidth, tableHeight, setHeight };
}

const CustomCell = ({ rowData, dataKey, columnName, ...props }) => {
  // console.log(rowData, dataKey, ...props);
  // const { columnName } = props;
  return <Cell {...props}>{rowData[columnName]}</Cell>;
};

const columns = getColumns();

const VTable = (props) => {
  const { tableWidth, tableHeight, setHeight } = useAutoSize();
  const { showList } = props.flightTableData.getShowFlights;
  console.log(columns, showList);
  return (
    <Table
      // bordered
      virtualized
      data={showList}
      style={{ fontSize: "16px" }}
      height={tableHeight}
      width={tableWidth}
    >
      {columns.map((column) => {
        if (column.fixed !== "") {
          return (
            <Column
              width={column.width}
              key={column.key}
              sortable
              fixed={column.fixed}
              resizable
            >
              <HeaderCell title={column.title}>{column.dataIndex}</HeaderCell>
              <CustomCell columnName={column.dataIndex} />
            </Column>
          );
        } else {
          return (
            <Column
              width={column.width}
              key={column.key}
              sortable
              // fixed={column.fixed || ""}
              resizable
            >
              <HeaderCell title={column.title}>{column.dataIndex}</HeaderCell>
              <Cell dataKey={column.dataIndex} />
            </Column>
          );
        }
      })}
    </Table>
  );
};
export default inject("flightTableData", "schemeListData")(observer(VTable));

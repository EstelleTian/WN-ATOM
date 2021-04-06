import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { inject, observer } from 'mobx-react'
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import { getColumns, formatSingleFlight, scrollTopById, highlightRowByDom} from 'components/FlightTable/TableColumns'
import { isValidVariable, formatTimeString } from 'utils/basic-verify'
import { Table } from 'antd';
import './VirtualTable.scss';

function VirtualTable(props) {
  const { columns, scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);
  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column;
    }

    return { ...column, width: Math.floor(tableWidth / widthColumnCount) };
  });
  const gridRef = useRef();
  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;
    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
            })}
            style={style}
          >
            {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          </div>
        )}
      </Grid>
    );
  };

  const handleRow = useCallback((event, record) => {// 点击行
      const dom = event.currentTarget;
      // const refVal = dom.getAttribute("data-row-key");
      // flightTableData.toggleSelectFlight(refVal);
      // console.log("toggleSelectFlight", refVal)
      highlightRowByDom(dom)
  },[])
   //设置表格行的 class
   const setRowClassName = useCallback((record, index) => {
      let FFIXT = record.FFIXT || "";
      let id = record.id || "";
      if( sortKey === "FFIXT" ) {
          if( isValidVariable(FFIXT) && FFIXT.length >= 12 ){
              FFIXT = FFIXT.substring(0, 12);
          }
          let sTime = "";
          if( isValidVariable(schemeStartTime) && schemeStartTime.length >= 12 ){
              sTime = schemeStartTime.substring(0, 12);
          }
          // console.log("FFIXT",FFIXT,"startTime",startTime,"schemeEndTime",schemeEndTime);
          if (sTime * 1 <= FFIXT * 1) {
              let eTime = "";
              if (isValidVariable(schemeEndTime)) {
                  eTime = schemeEndTime.substring(0, 12);
                  if ( FFIXT * 1 <= eTime * 1 ) {
                      id += " in_range"
                  }
              } else {
                  id += " in_range";
              }
          }
      }
      // if( id.indexOf("in_range") === -1){
          if( index % 2 === 0 ){
              id += " even";
          }else{
              id += " odd";
          }
      // }
      return id;
  },[schemeStartTime, schemeEndTime]);

  const onChange = useCallback((pagination, filters, sorter, extra) => {
      // console.log('params', pagination, filters, sorter, extra);
      setSortOrder( sorter.order );
      setSortKey( sorter.columnKey )
  },[]);

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        size="small"
        bordered
        components={{
          body: renderVirtualList,
        }}
        onChange={onChange}
        rowClassName={ setRowClassName }
        onRow={record => {
            return {
                onClick: (event) => {// 点击行
                    handleRow(event, record);
                }, 
                onContextMenu: (event) => {// 点击行
                    handleRow(event, record);
                },
            };
        }}
      />
    </ResizeObserver>
  );
} // Usage

let columns = getColumns();
// const data = Array.from(
//   {
//     length: 100000,
//   },
//   (_, key) => ({
//     key,
//   }),
// );

function useAutoSize(){
  let [tableWidth, setWidth] = useState(0);
  let [tableHeight, setHeight] = useState(0);
  useEffect(() => {
      // console.log("tableWidth, tableHeight: ",tableWidth, tableHeight)
      const flightCanvas = document.getElementsByClassName("flight_canvas")[0];
      const boxContent = flightCanvas.getElementsByClassName("box_content")[0];
      const tableHeader = flightCanvas.getElementsByClassName("ant-table-header")[0];
      let width = boxContent.offsetWidth;
      let height = boxContent.offsetHeight;
      // height -= 40;//标题高度“航班列表”
      // height -= 45;//表头高度
      height -= tableHeader.offsetHeight;//表头高度
      setWidth( width );
      setHeight( height );
      flightCanvas.oncontextmenu = function(){
          return false;
      };

  }, [tableWidth, tableHeight]);
  
  return { tableWidth, tableHeight }
}
const VTable = function(props){
  const { tableWidth, tableHeight } = useAutoSize();

  const { flightTableData = {}, schemeListData } = props;
  const { autoScroll } = flightTableData;
  const { showList, targetFlight }= props.flightTableData;

  return <VirtualTable
    columns={columns}
    dataSource={showList}
    scroll={{
        x: tableWidth,
        y: tableHeight
    }}
  />
}
export default inject("flightTableData", "schemeListData")(observer(VTable));


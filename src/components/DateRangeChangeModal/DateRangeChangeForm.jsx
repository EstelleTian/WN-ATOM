import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Spin,
  Modal,
  Slider,
} from "antd";
import { inject, observer } from "mobx-react";
import debounce from "lodash/debounce";
import { requestGet2, request } from "utils/request";
import { ReqUrls, CollaborateUrl } from "utils/request-urls";
import FmeToday from "utils/fmetoday";
import {
  parseFullTime,
  getFullTime,
  isValidObject,
  isValidVariable,
  addStringTime,
} from "utils/basic-verify";

const { Option } = Select;
//标记的文字样式
const yesterdayStyle = { color: "#d8961f" };
const todayStyle = { color: "#0d990d" };
const tomorrowStyle = { color: "#337ab7" };

//计划标记集合
const getMarks = () => {
  let max = 24 * 3;
  let marks = {};
  for (let i = 0; i < max; i++) {
    let style = todayStyle;
    if (i < 24) {
      style = yesterdayStyle;
    } else if (i >= 48) {
      style = tomorrowStyle;
    }
    let labelNum = "";
    if (i % 3 === 0) {
      labelNum = i % 24;
      if (labelNum < 10) {
        labelNum = "0" + (i % 24);
      }
    }
    if (labelNum !== "") {
      marks[i] = {
        style,
        label: <strong>{labelNum}</strong>,
      };
    }
  }
  return marks;
};

const calcShowTimeStr = (num, range) => {
  const dateTick = (num / 24) | 0;
  let timeTick = num % 24;
  if (timeTick * 1 < 10) {
    timeTick = "0" + timeTick;
  }
  let nameCn = "";
  if (dateTick === 0) {
    nameCn = "昨日";
  } else if (dateTick === 1) {
    nameCn = "今日";
  } else if (dateTick === 2) {
    nameCn = "明日";
  }
  let timeCn = "";
  if (range === "start") {
    timeCn = timeTick + ":00";
  } else if (range === "end") {
    timeCn = timeTick + ":59";
  }
  return nameCn + " " + timeCn;
};
//指定前序航班表单
function DateRangeChangeForm(props) {
  const { systemPage, schemeListData, flightTableData, myApplicationList } =
    props;
  const [range, setRange] = useState(systemPage.dateBarRangeData);
  const [startStr, setStartStr] = useState(
    calcShowTimeStr(systemPage.dateBarRangeData[0], "start")
  );
  const [endStr, setEndStr] = useState(
    calcShowTimeStr(systemPage.dateBarRangeData[1], "end")
  );
  const marks = useMemo(() => {
    return getMarks();
  }, []);
  //拖拽后的范围
  const onAfterChange = (value) => {
    //[24, 57]
    setRange([...value]);
    // console.log("onAfterChange", value);
  };
  //拖拽实时的范围
  const onChange = (value) => {
    //[24, 57]
    const newStartStr = calcShowTimeStr(value[0], "start");
    const newEndStr = calcShowTimeStr(value[1], "end");
    if (startStr !== newStartStr) {
      setStartStr(newStartStr);
    }
    if (endStr !== newEndStr) {
      setEndStr(newEndStr);
    }
    setRange([...value]);
    // console.log("onChange", value);
  };
  //点击【确定】
  const onConfirm = (e) => {
    const baseDate = systemPage.baseDate;
    let startTime = startStr.split(" ")[1].replace(":", "");
    let endTime = endStr.split(" ")[1].replace(":", "");
    let startDate = baseDate + startTime;
    let endDate = baseDate + endTime;
    const startDateTick = (range[0] / 24) | 0;
    const start = addStringTime(
      startDate,
      24 * 60 * 60 * 1000 * (startDateTick - 1)
    );
    const endDateTick = (range[1] / 24) | 0;
    const end = addStringTime(endDate, 24 * 60 * 60 * 1000 * (endDateTick - 1));
    systemPage.setDateRangeData([start, end]);
    systemPage.dateBarRangeData = [...range];
    // console.log(start, end);
    schemeListData.setForceUpdate(true);
    flightTableData.setForceUpdate(true);
    myApplicationList.setForceUpdate(true); //办结

    systemPage.setDateRangeVisible(false);
  };

  return (
    <Fragment>
      <div className="range_title">
        时间范围： {startStr} - {endStr}
      </div>
      <div className="range_bar">
        <Slider
          max={72}
          min={0}
          range
          marks={marks}
          value={range}
          tooltipVisible={false}
          onAfterChange={onAfterChange}
          onChange={onChange}
        />
      </div>
      <div className="range_btns">
        <Button
          className="todo_opt_btn c-btn-green"
          onClick={(e) => {
            onChange([0, 23]);
          }}
        >
          昨日
        </Button>
        <Button
          style={{ marginLeft: "8px" }}
          className="todo_opt_btn c-btn-green"
          onClick={(e) => {
            onChange([24, 47]);
          }}
        >
          今日
        </Button>
        <Button
          style={{ marginLeft: "8px" }}
          className="todo_opt_btn c-btn-green"
          onClick={(e) => {
            onChange([48, 71]);
          }}
        >
          明日
        </Button>
        {/* <Button
          style={{ marginLeft: "8px" }}
          className="todo_opt_btn"
          onClick={(e) => {
            // resetForm();
          }}
        >
          重置
        </Button> */}
        <Button
          style={{ marginLeft: "8px", float: "right" }}
          className="todo_opt_btn"
          onClick={(e) => {
            systemPage.setDateRangeVisible(false);
          }}
        >
          关闭
        </Button>
        <Button
          style={{ marginLeft: "8px", float: "right" }}
          className="todo_opt_btn c-btn-blue"
          onClick={onConfirm}
        >
          确定
        </Button>
      </div>
    </Fragment>
  );
}

export default inject(
  "systemPage",
  "schemeListData",
  "flightTableData",
  "myApplicationList"
)(observer(DateRangeChangeForm));

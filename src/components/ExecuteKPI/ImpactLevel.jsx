import React from "react";
import {
  Col,
  Empty,
  Row,
  Spin,
  Tooltip,
  Descriptions,
  Popover,
  Button,
} from "antd";
import {
  AlertOutlined,
  WarningOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ReactEcharts from "echarts-for-react";
import { inject, observer } from "mobx-react";
import { isValidVariable } from "../../utils/basic-verify";

//影响程度
function ImpactLevel(props) {
  const levelData = {
    H: {
      label: "高",
      levelClassName: "level-high",
      icon: <AlertOutlined />,
    },
    M: {
      label: "中",
      levelClassName: "level-middle",
      icon: <WarningOutlined />,
    },
    L: {
      label: "低",
      levelClassName: "level-Low",
      icon: <BulbOutlined />,
    },
  };
  const {
    loading,
    impactDegree,
    tacticDCB,
    inDCB,
    outDCB,
    degree = {},
  } = props.executeKPIData;
  // 全区DCB
  let regionDCB = tacticDCB || {};
  // 区内DCB
  let insideDCB = inDCB || {};
  // 区外DCB
  let outsideDCB = outDCB || {};
  const DCBData = {
    regionDCB,
    insideDCB,
    outsideDCB,
  };

  let level = levelData[impactDegree] || {};
  // 影响等级
  const label = level.label || "";
  const levelClassName = level.levelClassName || "";

  // 流量
  const flightSize = degree.flightSize || "";
  // 容量
  const capacitySize = degree.capacitySize || "";
  // 比率值
  const degreeCount = degree.degreeCount || "";
  const drawLevelDescription = () => {
    if (isValidVariable(label)) {
      return (
        <div className="level-description">
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="流量">{flightSize}</Descriptions.Item>
            <Descriptions.Item label="容量">{capacitySize}</Descriptions.Item>
            <Descriptions.Item label="比率">{degreeCount}</Descriptions.Item>
            <Descriptions.Item label="高" span={3}>
              比率大于2
            </Descriptions.Item>
            <Descriptions.Item label="中" span={3}>
              比率大于1
            </Descriptions.Item>
            <Descriptions.Item label="低" span={3}>
              比率小于等于1
            </Descriptions.Item>
          </Descriptions>
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <Spin spinning={loading}>
      <Row className="row_model">
        <Col span={8} className="block">
          <div className="block-title">影响程度</div>
          <div
            className={`${levelClassName} impact-level flex justify-content-center layout-column`}
          >
            <div className={`text-center`}>
              <AlertOutlined className={`level_icon`} />
              <span className={`text-degree-count`}>{degreeCount}</span>
            </div>
            <div className={`text-center`}>
              <span className={`text-label`}>{label}</span>
              {label !== "" && (
                <Tooltip
                  title={drawLevelDescription()}
                  arrowPointAtCenter
                  placement="bottom"
                >
                  <QuestionCircleOutlined className={`text-label-icon`} />
                </Tooltip>
              )}
            </div>
          </div>
        </Col>
        <Col span={16} className="block">
          <div className="block-title">DCB</div>
          <div className=" DCB-flex-box flex justify-content-center layout-column">
            <DCBLineChart dcb={DCBData} />
          </div>
        </Col>
      </Row>
    </Spin>
  );
}

//DCB
function DCBLineChart(props) {
  // DCB数据集合
  let { dcb } = props;

  if (!isValidVariable(dcb)) {
    dcb = {};
  }
  // 取出全区DCB 区内DCB 区外DCB 集合
  const { regionDCB, insideDCB, outsideDCB } = dcb;
  // X轴数据
  let dcbkeys = [];
  dcbkeys = Object.keys(regionDCB).sort();

  const getOption = function () {
    let dcbKeyArr = [];
    // 全区DCB Y轴数据
    let regionDCBValArr = [];
    // 区内DCB Y轴数据
    let insideDCBValArr = [];
    // 区外DCB Y轴数据
    let outsideDCBValArr = [];

    for (let i = 0; i < dcbkeys.length; i++) {
      const key = dcbkeys[i] || "";
      const regionDCBVal = regionDCB[key] || null;
      const insideDCBVal = insideDCB[key] || null;
      const outsideDCBVal = outsideDCB[key] || null;
      let xKey = key;
      if (key.length >= 12) {
        xKey = key.substring(0, 12);
        xKey = xKey.substring(8, 12);
      }
      dcbKeyArr.push(xKey);
      regionDCBValArr.push(regionDCBVal);
      insideDCBValArr.push(insideDCBVal);
      outsideDCBValArr.push(outsideDCBVal);
    }
    const option = {
      backgroundColor: "#00000000",
      color: ["#8867d2", "#39a30e", "#ff8a0c", "#8867d2"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, //解决被遮挡问题
        backgroundColor: "rgba(50,50,50,0.9)",
        extraCssText:
          "box-shadow: 0 3px 6px -4px rgb(0 0 0 / 48%), 0 6px 16px 0 rgb(0 0 0 / 32%), 0 9px 28px 8px rgb(0 0 0 / 20%);",
      },
      legend: {
        data: ["全区DCB", "区内DCB", "区外DCB"],
        icon: "circle",
        textStyle: {
          color: "#fff",
        },
      },
      grid: {
        top: "30px",
        left: "1%",
        right: "2%",
        bottom: "1%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: dcbKeyArr,
          axisLine: {
            lineStyle: {
              color: "#8F959E",
            },
          },
          axisTick: {
            // show: false
          },
          axisLabel: {
            // show: false
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#8F959E",
            },
          },
          axisTick: {
            // show: false
          },
          splitLine: {
            // show: false
          },
        },
      ],
      series: [
        {
          name: "全区DCB",
          type: "line",
          showSymbol: false,
          data: regionDCBValArr,
        },
        {
          name: "区内DCB",
          type: "line",
          showSymbol: false,
          data: insideDCBValArr,
        },
        {
          name: "区外DCB",
          type: "line",
          showSymbol: false,
          data: outsideDCBValArr,
        },
      ],
    };

    return option;
  };

  return (
    <div style={{ height: "170px" }}>
      {Object.keys(dcb).length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ color: "#fff" }}
        />
      ) : (
        <ReactEcharts option={getOption()} className="react_for_echarts" />
      )}
    </div>
  );
}

export default inject("executeKPIData")(observer(ImpactLevel));

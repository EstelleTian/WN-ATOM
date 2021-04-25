/*
 * @Author: your name
 * @Date: 2020-12-18 18:39:39
 * @LastEditTime: 2021-04-25 19:15:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-CDM\src\pages\InfoPage\InfoPage.jsx
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Button, Collapse, Row, Col, Tooltip, Checkbox } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { formatTimeString } from "utils/basic-verify";
import {
  sendMsgToClient,
  openTclientFrameForMessage,
  openCapacityFlowMonitorUnitTclientFrame,
  openDetails,
  openLocation,
} from "utils/client";

const { Panel } = Collapse;

function getLevel(level) {
  let res = "message";
  switch (level) {
    case "MESSAGE":
      res = "message";
      break;
    case "NOTICE":
      res = "notice";
      break;
    case "WARNING":
      res = "warn";
      break;
  }
  return res;
}
const convertStatus = (sourceStatus) => {
  let cn = "";
  switch (sourceStatus) {
    case "ADD":
      cn = "新增";
      break;
    case "UPDATE":
      cn = "更新";
      break;
    case "DELETE":
      cn = "终止";
      break;
  }
  return cn;
};

//单个消息-消息头
function InfoCardItem(props) {
  let [inProp, setInProp] = useState(true);
  let [active, setActive] = useState(true);

  const removeCard = (massage) => {
    // closeMessageDlg(massage)
    setInProp(false);
  };
  useEffect(function () {
    setTimeout(function () {
      setActive(false);
    }, 3000);
  }, []);
  let { message, index } = props;
  let {
    level,
    sendTime,
    content,
    dataType,
    dataCode,
    id,
    name,
    data = "",
    publishUser,
  } = message;
  data = JSON.parse(data);
  let { sourceStatus, startTime, endTime, publishUnit } = data;
  let dataContent = data.content || "";
  // console.log( message. data);
  level = getLevel(level);
  return (
    <CSSTransition
      in={inProp}
      timeout={0}
      classNames="item"
      key={id}
      unmountOnExit={true}
      onExited={(node) => {
        //动画出场之后的回调
        // 移除该项
        props.newsList.delNew(props.message);
      }}
    >
      <div className={`info_card  ${active ? "active" : ""} ${dataType}`}>
        <div className={`level_icon ${level}`}>
          <div className={`message-icon ${dataType} ${level}`} />
        </div>
        <div className="card_cont">
          {/*{ id+"-"+index }*/}
          <div className="title">
            <div className={`level_text ${level}`}>{level}</div>
            <div className="date">{formatTimeString(sendTime)}</div>
            <div className="options">
              {/*{*/}
              {/*    dataType === "FCDM" ? <Button className="info_btn btn_blue" size="small" onClick={ function(e){ openTimeSlotFrame(message) } }>查看放行监控</Button> : ""*/}
              {/*}*/}
              {dataType === "DCVM" ? (
                <Button
                  className="info_btn btn_blue"
                  size="small"
                  onClick={function (e) {
                    console.log(message);
                    let { data } = message;
                    data = JSON.parse(data);
                    let elementName = data.elementName || "";
                    const instance = data.instance || {};
                    const processVariables = instance.processVariables || {};
                    const elementType = processVariables.elementType || "";
                    if (elementType === "ROUTE") {
                      const routeName = processVariables.routeName || "";
                      elementName = routeName;
                    }
                    console.log(elementName);
                    openTclientFrameForMessage(elementName);
                    e.stopPropagation();
                  }}
                >
                  查看容量管理
                </Button>
              ) : (
                ""
              )}
              {
                // 暂时屏蔽方案终止消息的【查看容流监控】按钮
                (dataType === "OPEI" ||
                  (dataType === "PROI" && dataCode !== "PTER")) &&
                  props.systemPage.userHasAuth(11504) && (
                    <Button
                      className="info_btn btn_blue"
                      size="small"
                      onClick={function (e) {
                        sendMsgToClient(message);
                        e.stopPropagation();
                      }}
                    >
                      查看容流监控
                    </Button>
                  )
              }
              {
                // 航班异常告警信息
                dataType === "FLAI" && (
                  <span>
                    {dataCode !== "NAAA" && (
                      <Button
                        className="info_btn btn_blue"
                        size="small"
                        onClick={function (e) {
                          openDetails(message);
                          e.stopPropagation();
                        }}
                      >
                        航班详情
                      </Button>
                    )}

                    <Button
                      className="info_btn btn_blue"
                      size="small"
                      onClick={function (e) {
                        openLocation(message, dataCode);
                        e.stopPropagation();
                      }}
                    >
                      航班定位
                    </Button>
                  </span>
                )
              }
              {
                // 大规模延误告警信息
                dataType === "MDRS" && (
                  <span>
                    <Button
                      className="info_btn btn_blue"
                      size="small"
                      onClick={function (e) {
                        // alert("查看MDRS详情,开发中..");
                        console.log(message);
                        const dataStr = message.data || "{}";
                        const data = JSON.parse(dataStr) || {};
                        const { region = "" } = data;
                        openCapacityFlowMonitorUnitTclientFrame(region);
                        e.stopPropagation();
                      }}
                    >
                      查看MDRS详情
                    </Button>
                  </span>
                )
              }
              {dataType === "FTMI" && props.systemPage.userHasAuth(11503) ? (
                <span>
                  {dataCode === "TFAO" ? (
                    <Button
                      className="info_btn btn_blue"
                      size="small"
                      onClick={function (e) {
                        sendMsgToClient(message);
                        e.stopPropagation();
                      }}
                    >
                      查看容流监控
                    </Button>
                  ) : (
                    <Link to="/restriction" target="_blank">
                      <Button
                        className="info_btn btn_blue"
                        size="small"
                        onClick={(e) => {
                          //将data转换为对象再生成字符串对象传递，否则接收后转换不成正确的json
                          let { data } = message;
                          data = JSON.parse(data);
                          data = Object.assign({}, data);
                          let newMsg = Object.assign({}, message);
                          newMsg.data = data;

                          // console.log( str )
                          localStorage.setItem(
                            "message",
                            JSON.stringify(message)
                          );
                          // openControlDetail( newMsg )
                          e.stopPropagation();
                        }}
                      >
                        查看流控详情
                      </Button>
                    </Link>
                  )}
                </span>
              ) : (
                ""
              )}
            </div>
            <Tooltip title="关闭">
              <div
                className="close"
                onClick={(e) => {
                  removeCard(message);
                  e.stopPropagation();
                }}
              >
                <CloseOutlined />{" "}
              </div>
            </Tooltip>
          </div>
          {dataType === "FCDM" && (
            <div>
              <div className="text">
                <span className="info_name">{name}</span>
                <span className="publishUnit">发布用户：{publishUser}</span>
              </div>
              <div className="text">{content}</div>
            </div>
          )}
          {dataType === "DCVM" && (
            <div>
              <div className="text">
                <span className="info_name">{name}</span>
                <span className="publishUnit">发布用户：{publishUser}</span>
              </div>
              <div className="text">{content}</div>
            </div>
          )}
          {dataType === "FTMI" && (
            <div>
              <div className="text">
                <span className="info_name">
                  <span className={`${sourceStatus} sourceStatus`}>
                    {convertStatus(sourceStatus)}
                  </span>
                  -{name}{" "}
                </span>

                <span className="publishUnit">发布单位：{publishUnit}</span>
              </div>
              <div className="text">
                {dataContent}
                &nbsp;&nbsp;&nbsp;&nbsp;
                {formatTimeString(startTime)}- {formatTimeString(endTime)}
              </div>
            </div>
          )}
          {dataType !== "FCDM" && dataType !== "DCVM" && dataType !== "FTMI" && (
            <div>
              <div className="text">{name}</div>
              <div className="text">{content}</div>
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
}

const InfoCard = inject("systemPage", "newsList")(observer(InfoCardItem));

//单个消息模块下详情
function InfoCardDetail(props) {
  let { message } = props;
  let { sendTime, content, name, source, dataType } = message;
  let comment = "";
  if (dataType === "DCVM") {
    let dataStr = message.data;
    let data = JSON.parse(dataStr);
    comment = data.comment || "";
  }
  return (
    <div className="card_detail">
      <Row>
        <Col span={2} className="name">
          时间：
        </Col>
        <Col span={8} className="text send_time">
          {formatTimeString(sendTime)}
        </Col>
        <Col span={14} className="text send_time"></Col>
      </Row>
      <Row>
        <Col span={2} className="name">
          名称：
        </Col>
        <Col span={22} className="text send_time">
          {name}
        </Col>
      </Row>
      <Row>
        <Col span={2} className="name">
          来源：
        </Col>
        <Col span={22} className="text send_time">
          {source}
        </Col>
      </Row>
      <Row>
        <Col span={2} className="name">
          内容：
        </Col>
        <Col span={22} className="text send_time">
          {content}
        </Col>
      </Row>
      {dataType === "DCVM" && (
        <Row>
          <Col span={2} className="name">
            原因：
          </Col>
          <Col span={22} className="text send_time">
            {comment}
          </Col>
        </Row>
      )}
    </div>
  );
}

//单个消息-panel模块
function InfoList(props) {
  return (
    <TransitionGroup className="todo-list">
      <Collapse accordion className="info_content">
        {props.newsList.list.map((newItem, index) => (
          <Panel
            showArrow={false}
            header={
              <InfoCard
                message={newItem}
                // newsList={props.newsList}
                index={index}
              />
            }
            key={newItem.id}
          >
            <InfoCardDetail message={newItem} />
          </Panel>
        ))}
      </Collapse>
    </TransitionGroup>
  );
}

export default InfoList;

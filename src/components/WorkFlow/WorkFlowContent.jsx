import React, { useState, useEffect, useCallback } from "react";
import { message, Button, Table, Spin, Popover } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import {
  openConfirmFrame,
  openTimeSlotFrameWithFlightId,
  openTclientFrameForMessage,
  openTclientFrameForMDRS,
} from "utils/client";
import { requestGet } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import {
  getFullTime,
  isValidVariable,
  formatTimeString,
  millisecondToDate,
} from "utils/basic-verify";
import CapacityMiniTable from "components/CapacityManagement/CapacityMiniTable";
import "./WorkFlowContent.scss";

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const columns = [
  {
    title: "",
    dataIndex: "rowNum",
    align: "center",
    key: "rowNum",
    width: screenWidth > 1920 ? 25 : 25,
    fixed: "left",
    render: (text, record, index) => `第${index + 1}步`,
  },
  {
    title: "工作环节",
    dataIndex: "handleStep",
    align: "center",
    key: "handleStep",
    width: screenWidth > 1920 ? 70 : 70,
  },
  {
    title: "办理人",
    dataIndex: "handler",
    align: "center",
    key: "handler",
    width: 100,
    render: (text, record, index) => {
      let orgdata = JSON.parse(record.orgdata);
      const startTime = orgdata.startTime || 0;
      const endTime = orgdata.endTime || "";
      const durationInMillis = orgdata.durationInMillis || 0;

      return (
        <div className="handler">
          <div className="handler_1">
            <span style={{ color: "#d89614" }}>{text} </span>
            {isValidVariable(endTime) ? (
              <span className="" style={{ color: "#3a9c3a" }}>
                [用时：{millisecondToDate(durationInMillis)} ]
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="handler_2">
            开始于：{getFullTime(new Date(startTime), 1)}
          </div>
          <div className="handler_3">
            结束于：
            {isValidVariable(endTime) ? getFullTime(new Date(endTime), 1) : ""}
          </div>
        </div>
      );
    },
  },
  {
    title: "办理状态",
    dataIndex: "handleStatus",
    align: "center",
    key: "handleStatus",
    width: screenWidth > 1920 ? 40 : 40,
  },
  {
    title: "意见",
    dataIndex: "handleRes",
    align: "center",
    key: "handleRes",
    width: screenWidth > 1920 ? 60 : 60,
    render: (text, record, index) => {
      let odata = JSON.parse(record.orgdata);
      const taskLocalVariables = odata.taskLocalVariables || {};
      const agree = taskLocalVariables.agree;
      let agreeCN = "";
      let agreeColor = "";
      if (agree === "false" || agree === false) {
        agreeCN = "拒绝";
        agreeColor = "#ec4747";
      } else if (agree === "true" || agree === true) {
        agreeCN = "同意";
        agreeColor = "green";
      }
      let comment = taskLocalVariables.comments || "";

      if (isValidVariable(agreeCN) && isValidVariable(comment)) {
        comment = "(" + comment + ")";
      }

      return (
        <span style={{ color: agreeColor }}>
          {agreeCN} {comment}
        </span>
      );
    },
  },
  {
    title: "IP",
    dataIndex: "ipAddress",
    align: "center",
    key: "ipAddress",
    width: screenWidth > 1920 ? 45 : 45,
  },
  {
    title: "",
    dataIndex: "orgdata",
    align: "center",
    key: "orgdata",
    width: 1,
    render: (text, record, index) => {
      return "";
    },
  },
];

const WorkFlowContent = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [instance, setInstance] = useState({});
  const [generateTime, setGenerateTime] = useState("");
  const { modalId, from, source } = props;
  const processVariables = instance.processVariables || {};
  const processDefinitionKey = instance.processDefinitionKey || "";
  const endTime = instance.endTime || "";
  const businessName = processVariables.businessName || "";

  const getName = () => {
    if (processDefinitionKey === "VolumeApprovalProcess") {
      if (businessName.indexOf("#") > -1) {
        let textArr = businessName.split("#");
        let dom = (
          <div>
            <span>{textArr[0]}</span>
            <span className="capacity_detail_icon">
              <Popover
                placement="right"
                title={
                  <div className="capacity_detail_popover_title">
                    {textArr[0]}
                  </div>
                }
                content={
                  <div className="capacity_detail_popover">
                    {textArr.map((item, index) => {
                      if (item !== "" && index > 0) {
                        return <div key={index}>{item}</div>;
                      }
                    })}
                  </div>
                }
                trigger="hover"
              >
                <ProfileOutlined />
              </Popover>
            </span>

            {/* {
                            textArr.map( (item,index) => {
                                if(item !== ""){
                                    return <div key={index}>{item}</div>
                                }
                                
                            })
                        } */}
          </div>
        );
        return dom;
        // let dom = (
        //     <div>
        //         {
        //             textArr.map( (item,index) => {
        //                 if(item !== ""){
        //                     return <div key={index}>{item}</div>
        //                 }

        //             })
        //         }
        //     </div>
        // )
        // return dom;
      }
    }
    return businessName;
  };

  let elementType = processVariables.elementType || "";
  let updateDataStr = processVariables.updateData || "{}";
  const updateData = JSON.parse(updateDataStr) || {};
  //更新工作流列表数据
  const updateDetailData = useCallback((data) => {
    const gTime = data.generateTime || "";
    setGenerateTime(gTime);
    const hisInstance = data.hisInstance || {};
    setInstance(hisInstance);
    const hisTasks = data.hisTasks || [];
    // console.log("hisTasks",hisTasks);
    // if( !isValidObject(hisInstance) ){
    //     //取error
    //     const error = data.error || {};
    //     const msg = error.message || "";
    //     message.error({
    //         msg,
    //         duration: 4,
    //     });
    // }else{
    let newData = [];
    hisTasks.map((item, index) => {
      const name = item.name || "";
      const assigneeName = item.assigneeName || "";
      const endTime = item.endTime || "";
      let handleStatus = "待办理";
      if (isValidVariable(endTime)) {
        handleStatus = "已办理";
      }
      const taskLocalVariables = item.taskLocalVariables || {};
      const comments = taskLocalVariables.comments || "";
      const ipAddress = taskLocalVariables.ipAddress || "";

      const obj = {
        key: index,
        handleStep: name,
        handler: assigneeName,
        handleStatus,
        handleRes: comments,
        ipAddress,
        orgdata: JSON.stringify(item),
      };
      newData.push(obj);
    });
    setData(newData);
    // }
  });
  //请求错误处理
  const requestErr = useCallback((err, content) => {
    customNotice({
      type: "error",
      message: content,
    });
  });
  //根据modalId获取工作流详情
  const requestSchemeDetail = useCallback((modalId) => {
    let url = "";
    if (source === "clearance") {
      url = ReqUrls.taskDetailUrl + "SchemeApprovalProcess/" + modalId;
    } else {
      url = ReqUrls.taskDetailUrl + modalId;
    }
    const opt = {
      url,
      method: "GET",
      params: {},
      resFunc: (data) => {
        // console.log( data );
        updateDetailData(data);
        setLoading(false);
      },
      errFunc: (err) => {
        requestErr(err, "工作流详情数据获取失败");
        setLoading(false);
      },
    };
    requestGet(opt);
  }, []);

  useEffect(
    function () {
      document.title = businessName + "详情";
    },
    [businessName]
  );

  useEffect(
    function () {
      // console.log("modalId:"+modalId);
      if (isValidVariable(modalId)) {
        //根据modalId获取工作流详情
        requestSchemeDetail(modalId);
      }
      // console.log("useEffect", modalId);
    },
    [modalId]
  );

  //根据不同类型调整到不同窗口
  const openHandleWind = () => {
    const businessKey = instance.businessKey || ""; //方案id
    const processVariables = instance.processVariables || {};
    switch (processDefinitionKey) {
      case "FlightApprovalProcess": //航班审批流程
        const tacticId = processVariables.tacticId || ""; //航班对应方案id
        const fmeId = processVariables.fmeId || ""; //航班id
        openTimeSlotFrameWithFlightId(tacticId, fmeId);
        break;
      case "SchemeApprovalProcess": //方案审批流程
        console.log("方案审批流程", businessKey);
        openConfirmFrame(businessKey);
        break;
      case "VolumeApprovalProcess": //容量审批流程
        console.log("容量审批流程", businessKey);
        const elementName = processVariables.elementName || "";
        openTclientFrameForMessage(elementName);
        break;
      case "MdrsApprovalProcess": //MDRS审批流程
        const airport = processVariables.airport || "";
        openTclientFrameForMDRS(airport);
        break;
    }
  };

  // console.log("isValidVariable(endTime) ",isValidVariable(endTime) );
  return (
    <Spin spinning={loading}>
      <div className="workflow_wind_cont">
        {from === "simple" && (
          <div className="info_canvas">
            <div className="info_name">
              {getName()}({modalId})
            </div>
            <div className="generateTime">
              数据时间:
              {isValidVariable(generateTime)
                ? formatTimeString(generateTime)
                : ""}
            </div>
          </div>
        )}
        {/* {
                    processDefinitionKey === "VolumeApprovalProcess" &&
                    <CapacityMiniTable elementType={elementType} updateData={updateData} />

                } */}
        <div className="cont_canvas">
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            bordered
            pagination={false}
            loading={loading}
            scroll={{
              y: 380,
            }}
            locale={{
              emptyText: "暂无数据",
            }}
            // onChange={onChange}
            // rowClassName={(record, index)=>setRowClassName(record, index)}
          />
        </div>
        <div className="win_btns">
          {isValidVariable(endTime) ? (
            ""
          ) : (
            <Button
              type="primary"
              className="btn_confirm"
              onClick={(e) => {
                openHandleWind();
                if (isValidVariable(props.window)) {
                  props.window.hide();
                }
                // else{
                //     window.close();
                // }
              }}
            >
              主办
            </Button>
          )}
          {/**{
                        from === "simple" ? "" : 
                            <Button onClick={ (e)=>{ 
                                if( isValidVariable(props.window) ){
                                    props.window.hide();
                                }
                                if( source === "clearance"){ //从放行监控点击窗口模式来到工作流详情
                                   window.open( "/#/workflow_detail/clearance/"+modalId ,"_blank");
                                }else{
                                    window.open( "/#/workflow_detail/"+modalId ,"_blank");
                                }
    
                                
                            } }>
                                窗口模式
                            </Button>
                    }*/}
          {/**    {
                        processDefinitionKey === "FlightApprovalProcess"
                        ? <Button type="primary" className="" onClick={ e => {
                            // openHandleWind();
                            alert("建设中...");
                            props.window.hide();
                        } }>查看放行监控</Button> : ""
                    }
                    
                    {
                        processDefinitionKey === "SchemeApprovalProcess"
                        ? <Button type="primary" className="" onClick={ e => {
                            // openHandleWind();
                            alert("建设中...");
                            props.window.hide();
                        } }>查看容流监控</Button> : ""
                    }
                    {
                        processDefinitionKey === "CapacityApprovalProcess"
                        ? <Button type="primary" className="" onClick={ e => {
                            // openHandleWind();
                            alert("建设中...");
                            props.window.hide();
                        } }>查看容量监控</Button> : ""
                    }*/}
        </div>
      </div>
    </Spin>
  );
};

export default WorkFlowContent;

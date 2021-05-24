/*
 * @Author: your name
 * @Date: 2021-01-20 16:46:22
 * @LastEditTime: 2021-05-24 15:16:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\components\FlightTable\PopoverTip.jsx
 */
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  Fragment,
} from "react";
import {
  message,
  Popover,
  Button,
  Form,
  Descriptions,
  DatePicker,
  Input,
  Radio,
  Checkbox,
  Tooltip,
} from "antd";
import { observer, inject } from "mobx-react";
import { request } from "utils/request";
import { CollaborateUrl } from "utils/request-urls";
import { REGEXP } from "utils/regExpUtil";
import debounce from "lodash/debounce";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import {
  isValidVariable,
  isValidObject,
  getFullTime,
  parseFullTime,
  addStringTime,
} from "utils/basic-verify";
import { FlightCoordination } from "utils/flightcoordination";
import FmeToday from "utils/fmetoday";
import { closePopover, cgreen, cred } from "utils/collaborateUtils.js";
import moment from "moment";

const convertToTableData = (mpiInfo = {}, flight = {}) => {
  let res = {};
  const fmeToday = flight.fmeToday || {};
  //航班状态验证
  let hadDEP = FmeToday.hadDEP(fmeToday) || false; //航班已起飞
  const { atd = "", estInfo = "", updateTime = "" } = flight;

  for (let key in mpiInfo) {
    const tra = mpiInfo[key] || {};
    let item = { key: key, ffixt: key, time: "", source: "" };

    let traC = tra.C || "";
    if (traC === "null") {
      traC = "";
    }
    let traE = tra.E || "";
    if (traE === "null") {
      traE = "";
    }
    let traT = tra.T || "";
    if (traT === "null") {
      traT = "";
    }
    let traP = tra.P || "";
    if (traP === "null") {
      traP = "";
    }
    let traA = tra.A || "";
    if (isValidVariable(traA) || traA === "null") {
      traE = "";
    }
    // 已起飞按照A、T、E、C、P
    if (hadDEP) {
      if (isValidVariable(traA)) {
        item["time"] = traA;
        item["source"] = "A";
      } else if (isValidVariable(traT)) {
        item["time"] = traT;
        item["source"] = "T";
      } else if (isValidVariable(traE)) {
        item["time"] = traE;
        item["source"] = "E";
      } else if (isValidVariable(traC)) {
        item["time"] = traC;
        item["source"] = "C";
      } else if (isValidVariable(traP)) {
        item["time"] = traP;
        item["source"] = "P";
      }
    } else {
      // 未起飞按照C、P、E
      if (isValidVariable(traC)) {
        item["time"] = traC;
        item["source"] = "C";
      } else if (isValidVariable(traP)) {
        item["time"] = traP;
        item["source"] = "P";
      } else if (isValidVariable(traE)) {
        item["time"] = traE;
        item["source"] = "E";
      }
    }
    res[key] = item;
  }
  return res;
};

const getRightFormInitValues = (orgdata) => {
  let mpiList = {};
  let mpi = orgdata.monitorPointInfo || "";
  let mpiInfo = FlightCoordination.parseMonitorPointInfo(mpi, orgdata);

  if (isValidObject(mpiInfo)) {
    mpiList = convertToTableData(mpiInfo, orgdata);
  }
  let initParams = {};
  for (let name in mpiList) {
    const time = mpiList[name].time;
    let showTime = "";
    let showDate = "";
    if (time !== "" && time.length >= 12) {
      showTime = time.substring(8, 12);
      showDate = moment(time.substring(0, 8), "YYYY-MM-DD");
    }
    initParams[name + "_date"] = showDate;
    initParams[name + "_time"] = showTime;
  }
  return { list: mpiList, initParams };
};

//右侧表单模块
const RightForm = (props) => {
  //联动
  const [linkedRadioVal, setLinkedRadioVal] = useState("all");
  const [formOrgData, setFormOrgData] = useState({});
  const [mpiList, setMpiList] = useState({});
  const [targetName, setTargetName] = useState("");
  const { rightForm, orgdata, rightContShow, collaboratePopoverData } = props;
  let initialRightFormValues = {};

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setLinkedRadioVal(e.target.value);
  };
  //监听时间输入框实时内容
  const handleInputTimeVal = debounce((name, values) => {
    if (values.length === 4) {
      //获取日期
      // const date = rightForm.getFieldValue(name + "_date");
      // let endDateString = moment(date).format("YYYYMMDD");
      // console.log(name + "_time", values, endDateString);
      // setTargetName(name);
      handleLinked(name);
    }
  }, 800);
  //监听日期选择内容
  const handleDateVal = (name, date, dateString) => {
    //获取时间
    // const time = rightForm.getFieldValue(name + "_time");
    // console.log(name + "_date", time, dateString);
    // setTargetName(name);
    handleLinked(name);
  };
  // const validateValue = (getFieldValue, fieldName) => {
  //   const fieldVal = getFieldValue(fieldName);
  //   if (fieldName.indexOf("_time") > -1) {
  //     if (fieldVal.length === 4) {
  //       console.log(fieldName, fieldVal, formOrgData[fieldName]);
  //     }
  //   } else {
  //     const orgDate = moment(formOrgData[fieldName]).format("YYYYMMDD");
  //     const newDate = moment(fieldVal).format("YYYYMMDD");
  //     console.log(fieldName, newDate, orgDate);
  //   }
  // };
  //屏蔽不可选择日期
  const disabledDateFunc = (current, name) => {
    const targetDate = rightForm.getFieldValue(name);

    return current < targetDate || current > moment(targetDate).add(1, "days");
  };

  const handleLinked = (targetName) => {
    if (
      rightContShow &&
      isValidObject(formOrgData) &&
      isValidObject(mpiList) &&
      (linkedRadioVal === "all" || linkedRadioVal === "down")
    ) {
      // 计算与原值的毫秒差;
      let diffMs = 0;
      const newDate = rightForm.getFieldValue(targetName + "_date");
      const newTime = rightForm.getFieldValue(targetName + "_time");
      const newDateString = moment(newDate).format("YYYYMMDD");
      const newMs = parseFullTime(newDateString + newTime).getTime();

      const orgDate = formOrgData[targetName + "_date"];
      const orgTime = formOrgData[targetName + "_time"];
      const orgDateString = moment(orgDate).format("YYYYMMDD");
      const orgMs = parseFullTime(orgDateString + orgTime).getTime();
      console.log(formOrgData, mpiList);

      diffMs = newMs - orgMs; //毫秒差

      if (linkedRadioVal === "all") {
        let newParams = {};
        for (let name in mpiList) {
          const time = mpiList[name].time;
          const newTime = addStringTime(time, diffMs);

          let showTime = "";
          let showDate = "";
          if (newTime !== "" && newTime.length >= 12) {
            showTime = newTime.substring(8, 12);
            showDate = moment(newTime.substring(0, 8), "YYYY-MM-DD");
          }
          newParams[name + "_date"] = showDate;
          newParams[name + "_time"] = showTime;
        }
        rightForm.setFieldsValue(newParams);
      } else if (linkedRadioVal === "down") {
        let newParams = {};
        let index = 0;
        let targetIndex = Object.keys(mpiList).indexOf(targetName);

        for (let name in mpiList) {
          if (targetIndex != -1 && index >= targetIndex) {
            const time = mpiList[name].time;
            const newTime = addStringTime(time, diffMs);

            let showTime = "";
            let showDate = "";
            if (newTime !== "" && newTime.length >= 12) {
              showTime = newTime.substring(8, 12);
              showDate = moment(newTime.substring(0, 8), "YYYY-MM-DD");
            }
            newParams[name + "_date"] = showDate;
            newParams[name + "_time"] = showTime;
          }

          index++;
        }
        rightForm.setFieldsValue(newParams);
      }
    }
  };
  useEffect(() => {
    if (rightContShow) {
      let { list, initParams } = getRightFormInitValues(orgdata);
      setMpiList(list);
      rightForm.setFieldsValue(initParams);
      setFormOrgData(initParams);
    }
  }, [collaboratePopoverData.selectedObj, rightContShow]);

  return (
    <div className="ffixt_right_canvas">
      <div className="ffixt_right_canvas_form">
        <Form
          form={rightForm}
          size="small"
          initialValues={initialRightFormValues}
          className="ffixt_form"
        >
          <Descriptions size="small" bordered column={2}>
            {Object.keys(mpiList).map((name, index) => {
              return (
                <Fragment key={name}>
                  <Descriptions.Item label={name}>
                    <Form.Item
                      name={`${name}_date`}
                      // rules={[
                      //   ({ getFieldValue }) =>
                      //     validateValue(getFieldValue, name + "_date"),
                      // ]}
                    >
                      <DatePicker
                        className="ffixt_right_date"
                        format="YYYY-MM-DD"
                        disabledDate={(current) => {
                          return disabledDateFunc(current, name + "_date");
                        }}
                        onChange={(date, dateString) => {
                          handleDateVal(name, date, dateString);
                        }}
                      />
                    </Form.Item>
                  </Descriptions.Item>
                  <Descriptions.Item>
                    <Form.Item
                      name={`${name}_time`}
                      rules={[
                        {
                          type: "string",
                          pattern: REGEXP.TIMEHHmm,
                          message: "请输入有效的开始时间",
                        },
                        {
                          required: true,
                          message: "请输入开始时间",
                        },
                      ]}
                    >
                      <Input
                        className="ffixt_right_time"
                        onChange={(e) => {
                          handleInputTimeVal(name, e.target.value);
                        }}
                      />
                    </Form.Item>
                  </Descriptions.Item>
                </Fragment>
              );
            })}
          </Descriptions>
        </Form>
      </div>
      <div className="radio_canvas">
        <Radio.Group defaultValue={"all"} onChange={onChange}>
          <Radio value={"all"}>全部联动</Radio>
          <Radio value={"down"}>向下联动</Radio>
          <Radio value={"none"}>不联动</Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

//popover和tip组合协调窗口
const FFixTCont = (props) => {
  const [autoChecked, setAutoChecked] = useState(true);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const [refuseBtnLoading, setRefuseBtnLoading] = useState(false);
  const [rightContShow, setRightContShow] = useState(false);

  const [form] = Form.useForm();
  const [rightForm] = Form.useForm();
  const { collaboratePopoverData = {} } = props;
  const { data = {}, selectedObj = {} } = collaboratePopoverData;
  // console.log(data);
  const { FLIGHTID = "", DEPAP = "", ARRAP = "" } = data;
  let orgDataStr = data.orgdata || "{}";
  let orgdata = JSON.parse(orgDataStr);
  let field = orgdata.ffixField || {};

  let time = "";
  let date = "";
  let source = field.source || "";
  let fieldValue = field.value || "";
  if (isValidVariable(fieldValue) && fieldValue.length >= 12) {
    time = fieldValue.substring(8, 12);
    date = moment(fieldValue.substring(0, 8), "YYYY-MM-DD");
  }

  //按钮权限
  let hasConfirmAuth = props.systemPage.userHasAuth(13440); //申请权限
  let hasRefuseAuth = props.systemPage.userHasAuth(13443); //撤销权限

  let initialValues = {
    flightid: FLIGHTID || "",
    airport: DEPAP + "-" + ARRAP,
    unit: "",
    locked: "",
    time,
    date,
    comment: "",
  };

  const onCheck = async (type) => {
    form.setFieldsValue({ runway: FFIXT });
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  // 重置数据
  const resetForm = () => {
    console.log("重置表单");
    form.setFieldsValue({ ...initialValues });
    if (rightContShow) {
      const { list, initParams } = getRightFormInitValues(orgdata);
      rightForm.setFieldsValue(initParams);
    }
  };
  useEffect(() => {
    if (
      isValidVariable(collaboratePopoverData.selectedObj) &&
      collaboratePopoverData.selectedObj.name === "FFIXT"
    ) {
      console.log("FFixTCont挂载");
      // form.setFieldsValue({ runway: FFIXT });
      form.setFieldsValue({
        flightid: FLIGHTID || "",
        airport: DEPAP + "-" + ARRAP,
        unit: "",
        locked: "",
        time,
        date,
        comment: "",
      });
    }

    return () => {
      form.resetFields();
      console.log("FFixTCont卸载");
    };
  }, [collaboratePopoverData.selectedObj]);

  return (
    <div className="ffixt_col_container">
      <div className="ffixt_left_canvas">
        <Form
          form={form}
          size="small"
          initialValues={initialValues}
          className="ffixt_form"
        >
          <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="航班">
              <Form.Item name="flightid">
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="机场">
              <Form.Item name="airport">
                <Input disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="日期">
              <Form.Item name="date">
                <DatePicker className="clr_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="时间">
              <Form.Item
                name="time"
                rules={[
                  {
                    type: "string",
                    pattern: REGEXP.TIMEHHmm,
                    message: "请输入有效的开始时间",
                  },
                  {
                    required: true,
                    message: "请输入开始时间",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="">
              <Form.Item name="locked">
                <Checkbox
                  checked={autoChecked}
                  onChange={(e) => {
                    setAutoChecked(e.target.checked);
                  }}
                >
                  禁止系统自动调整
                </Checkbox>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              <Form.Item name="comment">
                <Input.TextArea maxLength={100} />
              </Form.Item>
            </Descriptions.Item>
            <div>
              <Button
                loading={submitBtnLoading}
                size="small"
                className="todo_opt_btn todo_agree c-btn-blue"
                onClick={(e) => {
                  onCheck("");
                }}
              >
                指定
              </Button>
              {source === "MANUAL" && hasRefuseAuth && (
                <Button
                  style={{ marginLeft: "8px" }}
                  loading={refuseBtnLoading}
                  className="todo_opt_btn todo_refuse c-btn-red"
                  onClick={(e) => {
                    onCheck("clear");
                  }}
                  size="small"
                >
                  撤销
                </Button>
              )}
              <Button
                size="small"
                className="todo_opt_btn todo_reset"
                onClick={(e) => {
                  resetForm();
                }}
              >
                重置
              </Button>

              {/* <Button style={{marginLeft: '8px'}}  size="small">重置</Button> */}
            </div>
          </Descriptions>
        </Form>
      </div>
      <div className="ffixt_middle_canvas">
        {rightContShow ? (
          <DoubleLeftOutlined
            onClick={(e) => {
              setRightContShow(false);
            }}
          />
        ) : (
          <DoubleRightOutlined
            onClick={(e) => {
              setRightContShow(true);
            }}
          />
        )}
      </div>
      {rightContShow && (
        <RightForm
          rightForm={rightForm}
          orgdata={orgdata}
          rightContShow={rightContShow}
          collaboratePopoverData={collaboratePopoverData}
        />
      )}
    </div>
  );
};

export default inject(
  "collaboratePopoverData",
  "systemPage"
)(observer(FFixTCont));
// export default FFixTCont;

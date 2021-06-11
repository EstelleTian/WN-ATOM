/*
 * @Author: your name
 * @Date: 2021-01-28 15:56:44
 * @LastEditTime: 2021-06-10 17:55:01
 * @LastEditors: Please set LastEditors
 * @Description: 容量参数调整
 * @FilePath: \WN-ATOM\src\components\CapacityManagement\CapacityParamsCont.jsx
 */

import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Suspense,
  memo,
} from "react";
import { inject, observer } from "mobx-react";
import { request, requestGet, request2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { QuestionCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  message,
  Table,
  Input,
  Button,
  Popconfirm,
  Tooltip,
  Form,
  Spin,
} from "antd";
import {
  isValidVariable,
  isValidObject,
  formatTimeString,
} from "utils/basic-verify";
import { REGEXP } from "utils/regExpUtil";
import { customNotice } from "utils/common-funcs";
// import { OptionBtn } from "components/Common/OptionBtn";
// import { data1, data24 } from '../../mockdata/static'
import "./CapacityTable.scss";
const EditableContext = React.createContext(null);

//获取屏幕宽度，适配 2k
let screenWidth = document.getElementsByTagName("body")[0].offsetWidth;

const EditableRow = (props) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editing,
  children,
  dataIndex,
  record = {},
  handleSave,
  dateRange,
  forceUpdateDynamicData,
  ...restProps
}) => {
  const orgData = useRef();
  const [flag, setFlag] = useState(false);
  const form = useContext(EditableContext);
  const obj = record[dataIndex] || {};

  let cellClass = useMemo(
    function () {
      if (forceUpdateDynamicData ? forceUpdateDynamicData : editing) {
        let bgClass = "";
        const obj = record[dataIndex] || {};
        const source = obj.source || "";
        switch (source) {
          case "1": {
            bgClass = "alarm alarm_green";
            break;
          }
          case "2": {
            bgClass = "alarm alarm_orange";
            break;
          }
          case "3": {
            bgClass = "alarm alarm_red";
            break;
          }
          case "wait": {
            bgClass = "alarm alarm_yellow";
            break;
          }
          default:
            break;
        }
        return bgClass;
      } else {
        return "";
      }
    },
    [editing, forceUpdateDynamicData, record]
  );

  let disabled = false;
  if (dateRange * 1 === -1) {
    disabled = true;
  } else if (dateRange * 1 === 0) {
    if (record.capacityTime * 1 <= new Date().getHours()) {
      disabled = true;
    }
  }
  const save = async () => {
    let values = await form.validateFields();
    for (let key in values) {
      let resObj = record[key];
      if (values[key] === -1 || values[key] === "") {
        resObj["value"] = -1;
      } else {
        resObj["value"] = values[key] * 1;
      }
    }
    handleSave(record);
    console.log("orgData.current", orgData.current, "record", record);
  };

  // let flag = false;

  useEffect(() => {
    return () => {
      orgData.current = -1;
    };
  }, []);

  useEffect(() => {
    let curVal = "";
    if (isValidObject(record) && record[dataIndex].value) {
      curVal = record[dataIndex].value * 1;
    }
    let cflag = orgData.current > 0 && curVal > 0 && orgData.current !== curVal;
    if (forceUpdateDynamicData) {
      cflag = false;
    }
    setFlag(cflag);

    // console.log("dataIndex", dataIndex, "curVal", curVal, "orgData.current", orgData.current, "flag", cflag )
  }, [obj.value]);

  useEffect(() => {
    orgData.current = obj.value * 1 || "";

    // console.log("更新value", obj.value)
    if (forceUpdateDynamicData ? forceUpdateDynamicData : editing) {
      const obj = record[dataIndex] || {};
      let val = obj.value * 1;
      if (val === -1) {
        if (disabled) {
          val = "-";
        } else {
          val = "";
        }
      }

      form.setFieldsValue({
        [dataIndex]: val,
      });
    }

    let curVal = "";
    if (isValidObject(record) && record[dataIndex].value) {
      curVal = record[dataIndex].value * 1;
    }
    const cflag =
      orgData.current > 0 && curVal > 0 && orgData.current !== curVal;
    setFlag(cflag);

    // console.log("dataIndex", dataIndex, "curVal", curVal, "orgData.current", orgData.current, "flag", cflag )
  }, [editing, forceUpdateDynamicData]);

  // console.log("重渲染" )
  const inputNode = <Input onBlur={save} disabled={disabled} />;
  return (
    <td {...restProps}>
      <div className={cellClass}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            className={` ${flag ? "yellow" : ""}`}
            rules={[
              {
                pattern: REGEXP.NUMBER3,
                message: "请输入0~999的整数",
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </div>
    </td>
  );
};

//处理列配置
const getColumns = (type) => {
  const valRender = (text, record, index) => {
    let bgClass = "";
    let title = "";
    let showVal = text.value || "";
    if (showVal === -1) {
      showVal = "-";
    }
    let source = "";
    if (text.hasOwnProperty("source")) {
      source = text.source || "";

      switch (source) {
        case "1": {
          bgClass = "alarm alarm_green";
          title = "大于静态容量值";
          break;
        }
        case "2": {
          bgClass = "alarm alarm_orange";
          title = "小于静态容量值20%以内";
          break;
        }
        case "3": {
          bgClass = "alarm alarm_red";
          title = "小于静态容量值20%以上";
          break;
        }
        case "wait": {
          bgClass = "alarm alarm_yellow";
          showVal = text.originalValue || "";
          title = (
            <span>
              <div>原&nbsp;&nbsp;&nbsp;&nbsp;值：{text.originalValue}</div>
              <div>申请值：{text.value}</div>
            </span>
          );
          break;
        }
        default:
          bgClass = "";
          break;
      }
    }
    return (
      <span className={bgClass}>
        {source === "wait" ? (
          // ? ( showVal !== '-' && showVal !== -1 ) ?
          showVal !== "-" ? (
            <Tooltip title={title} color="#164c69">
              <span>
                {" "}
                {text.originalValue === -1 ? "-" : text.originalValue}{" "}
                <ArrowRightOutlined /> {text.value || ""}{" "}
              </span>
            </Tooltip>
          ) : (
            <span>{showVal || ""}</span>
          )
        ) : (
          <Tooltip title={title} color="#164c69">
            <span>{showVal || ""}</span>
            {bgClass !== "" && <QuestionCircleOutlined className="cap_icon" />}
          </Tooltip>
        )}
      </span>
    );
  };
  let cColumns = [];
  if (type === "AIRPORT") {
    cColumns = [
      {
        title: "时间",
        dataIndex: "capacityTimeSource",
        align: "center",
        key: "capacityTimeSource",
        fixed: "left",
        width: screenWidth > 1920 ? 30 : 30,
        render: (text, record, index) => {
          if (text === "BASE") {
            return <span>全天</span>;
          }
          return <span>{text}</span>;
          // else{
          //     return <span>{text}时</span>
          // }
          // if( text*1 < 10){
          //     text = '0'+text;
          // }
          // return <span>{text}时</span>
        },
      },
      {
        title: "小时最大起降架次",
        dataIndex: "capacityDetailsDepArr60",
        align: "center",
        key: "capacityDetailsDepArr60",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "小时最大起飞架次",
        dataIndex: "capacityDetailsDep60",
        align: "center",
        key: "capacityDetailsDep60",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "小时最大降落架次",
        dataIndex: "capacityDetailsArr60",
        align: "center",
        key: "capacityDetailsArr60",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "15分钟最大起降架次",
        dataIndex: "capacityDetailsDepArr15",
        align: "center",
        key: "capacityDetailsDepArr15",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "15分钟最大起飞架次",
        dataIndex: "capacityDetailsDep15",
        align: "center",
        key: "capacityDetailsDep15",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "15分钟最大降落架次",
        dataIndex: "capacityDetailsArr15",
        align: "center",
        key: "capacityDetailsArr15",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
    ];
  } else {
    cColumns = [
      {
        title: "时间",
        dataIndex: "capacityTimeSource",
        align: "center",
        key: "capacityTimeSource",
        fixed: "left",
        width: screenWidth > 1920 ? 30 : 30,
        render: (text, record, index) => {
          if (text === "BASE") {
            return <span>全天</span>;
          }
          // if( text*1 < 10){
          //     text = '0'+text;
          // }
          return <span>{text}</span>;
        },
      },
      {
        title: "小时容量值",
        dataIndex: "capacityDetailsDepArr60",
        align: "center",
        key: "capacityDetailsDepArr60",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
      {
        title: "15分钟容量值",
        dataIndex: "capacityDetailsDepArr15",
        align: "center",
        key: "capacityDetailsDepArr15",
        editable: true,
        width: screenWidth > 1920 ? 50 : 50,
        render: valRender,
      },
    ];
  }
  return cColumns;
};
//请求错误--处理
const requestErr = (err, content) => {
  message.error({
    content,
    duration: 10,
  });
};
//提交按钮
const SaveBtn = memo(function (props) {
  const { save } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputDom = useRef();

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const comment = inputVal;
    try {
      const res = await save(comment);
      // setInputVal("");
      // setConfirmLoading(false);
      // setVisible(false);
      props.setEditable(false);
    } catch (err) {
      // setInputVal("");
      // setConfirmLoading(false);
      console.log(visible);
      // setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const onChange = (e) => {
    setInputVal(e.target.value);
  };
  return (
    <Popconfirm
      title={
        <div>
          <div>动态容量修改</div>
          <div style={{ fontSize: "1.2rem" }}>原因:</div>
          <Input.TextArea
            size="small"
            maxLength={100}
            showCount={true}
            autoSize={{ minRows: 3, maxRows: 3 }}
            value={inputVal}
            onChange={onChange}
            style={{
              width: "300px",
              marginTop: "0.5rem",
            }}
          />
        </div>
      }
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
      overlayClassName="capacity-popconfirm"
    >
      <Button className="" type="primary" onClick={showPopconfirm}>
        提交
      </Button>
    </Popconfirm>
  );
});
//同意 拒绝 撤回 按钮
const ApproveBtn = function (props) {
  const { type, username, hisTasks, hisInstance, updateWorkFlow } = props;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputDom = useRef();

  const showPopconfirm = () => {
    setVisible(true);
  };
  //数据提交成功回调
  const requestSuccess = useCallback((data, content, key) => {
    //重新请求数据
    updateWorkFlow();
    customNotice({
      type: "success",
      message: content,
      duration: 8,
    });
  });
  //处理 操作 同意/拒绝
  const handleOk = async () => {
    if (!isValidVariable(username)) {
      return;
    }
    const len = hisTasks.length;
    let taskId = "";
    if (len > 1) {
      taskId = hisTasks[len - 1].id || "";
    }
    const businessKey = hisInstance.businessKey || ""; //流程id
    const comment = inputVal;
    let url = "";
    let params = {
      businessKey, //流程id
      taskId, //任务id
      comment,
    };
    let title = "动态容量调整";
    if (props.type === "agree") {
      //容量审核同意
      url = ReqUrls.capacityBaseUrl + "simulationTactics/approve/" + username;
      title = "动态容量调整【同意】操作";
    } else if (props.type === "refuse") {
      //容量审核拒绝
      url = ReqUrls.capacityBaseUrl + "simulationTactics/refuse/" + username;
      title = "动态容量调整【拒绝】操作";
    } else if (props.type === "reback") {
      //容量审核撤回
      url = ReqUrls.capacityBaseUrl + "simulationTactics/withdraw/" + username;
      title = "动态容量调整【撤回】操作";
    }
    if (isValidVariable(url)) {
      try {
        const data = await request2({ url, method: "POST", params: params });
        requestSuccess(data, title + "成功");
        // setConfirmLoading(false);
        setVisible(false);
      } catch (err) {
        if (isValidVariable(err)) {
          requestErr(err, err);
        } else {
          requestErr(err, title + "失败");
        }
        // setConfirmLoading(false);
        setVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const onChange = (e) => {
    setInputVal(e.target.value);
  };
  return (
    <Popconfirm
      title={
        <div>
          <div style={{ fontSize: "1.2rem" }}>请输入原因:</div>
          <Input.TextArea
            size="small"
            maxLength={100}
            showCount={true}
            autoSize={{ minRows: 3, maxRows: 3 }}
            value={inputVal}
            onChange={onChange}
            style={{
              width: "300px",
              marginTop: "0.5rem",
            }}
          />
        </div>
      }
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
      overlayClassName="capacity-popconfirm"
    >
      {props.children(showPopconfirm)}
    </Popconfirm>
  );
};

//设置表格行的 class
const setRowClassName = (record, index) => {
  let classStr = "";
  if (index % 2 === 0) {
    classStr += " even";
  } else {
    classStr += " odd";
  }
  return classStr;
};

//动态容量配置
const CapacityTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { kind, airportName, paneType, capacity, routeName } = props;
  // console.log("routeName", routeName)
  const { editable, setEditable } = capacity;
  // console.log(editable, setEditable)
  const username = props.systemPage.user.username;

  const handleSave = (row) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setTableData(newData);
  };

  const updateOrgTableDatas = async (kind, comment = "") => {
    let tableDataObj = {};
    tableData.map((item) => {
      // const key = item.capacityTime || "";
      const key = item.capacityTime || "";
      if (key !== "") {
        tableDataObj[key] = item;
      }
    });
    //发送保存请求
    let url = ReqUrls.capacityBaseUrl;
    let title = "";
    //传参
    let capacityData = {};
    if (kind === "default" || kind === "static") {
      url += "static/updateCapacityStatic";
      capacityData = props.capacity.staticData;
      title = "静态容量";
    } else if (kind === "dynamic") {
      if (!isValidObject(props.systemPage.user) || !username) {
        return;
      }
      url += "simulationTactics/" + username;
      capacityData = props.capacity.dynamicData;
      title = "动态容量";
    }
    let params = {
      elementName: airportName,
      capacityMap: tableDataObj,
      comment,
    };
    if (paneType === "ROUTE") {
      params = {
        elementName: routeName,
        capacityMap: tableDataObj,
        routeName: airportName,
        comment,
      };
    }

    try {
      const data = await request2({ url, method: "POST", params });
      const { capacityMap } = data;
      props.capacity.setEditable(false);
      for (let name in capacityMap) {
        const res = capacityMap[name] || {};
        // console.log("更新表格数据 ", res);
        props.capacity.updateDatas(kind, res);
        props.capacity.forceUpdateDynamicWorkFlowData = true;
      }
      return Promise.resolve(data);
    } catch (err) {
      if (isValidVariable(err)) {
        title = err;
      } else {
        title = title + "调整申请失败";
      }
      props.capacity.setEditable(false);
      customNotice({
        type: "error",
        message: title,
      });
      resetOrgTableDatas();
      return Promise.reject(err);
    }
  };

  const resetOrgTableDatas = (from = "") => {
    // from === "" &&
    if (!props.capacity.forceUpdateDynamicData && editable) {
      return;
    }
    const { capacity } = props;
    let obj = {};
    if (kind === "default") {
      obj = {
        data: capacity.defaultStaticData,
      };
    } else if (kind === "static") {
      obj = {
        data: capacity.customStaticData,
      };
    } else if (kind === "dynamic") {
      obj = {
        data: capacity.customDynamicData,
      };
    }
    const dataArr = JSON.parse(JSON.stringify(obj)).data || [];

    setTableData(dataArr);
  };

  const mergedColumns = getColumns(paneType).map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: editable,
        handleSave,
        dateRange: props.capacity.dateRange,
        forceUpdateDynamicData: props.capacity.forceUpdateDynamicData,
      }),
    };
  });

  const save = useCallback(
    (comment) => {
      //更新初始化数据
      return updateOrgTableDatas(kind, comment);
    },
    [tableData]
  );

  let hisInstance = {};
  let hisTasks = [];
  let authMap = {};
  let dynamicWorkFlowData = props.capacity.dynamicWorkFlowData || {};
  const taskMap = dynamicWorkFlowData.taskMap || {};
  const generateTime = dynamicWorkFlowData.generateTime || "";
  const values = Object.values(taskMap) || [];
  if (values.length > 0) {
    const taskObj = values[values.length - 1] || {};
    hisTasks = taskObj.hisTasks || [];
    hisInstance = taskObj.hisInstance || [];
    authMap = taskObj.authMap || {};
  }

  const SUBMIT = useMemo(() => {
    const authMap = props.capacity.authMap || {};
    const SUBMIT = authMap.SUBMIT;
    return SUBMIT;
  }, [props.capacity.authMap]);

  const validateUpdateBtn = useCallback(() => {
    if (isValidVariable(username)) {
      let params = {
        elementName: airportName,
      };
      if (paneType === "ROUTE") {
        params = {
          elementName: routeName,
          routeName: airportName,
        };
      }
      const opt = {
        url: ReqUrls.capacityBaseUrl + "simulationTactics/judge/" + username,
        method: "GET",
        params,
        resFunc: (data) => {
          props.capacity.setEditable(true);
        },
        errFunc: (err) => {
          customNotice({
            type: "error",
            message: err,
          });
          props.capacity.setEditable(false);
        },
      };
      requestGet(opt);
    }
  }, [username, routeName]);

  useEffect(() => {
    resetOrgTableDatas();
  }, [kind, props.capacity.staticData, props.capacity.dynamicData]);

  useEffect(() => {
    props.capacity.setDynamicData({});
    props.capacity.setOtherData("", {}, "");
  }, []);

  // console.log("authMap", { ...authMap });
  let authBtn = () => {
    return (
      <div className="opt_btns">
        {
          // ( authMap.AGREE && props.systemPage.userHasAuth(14402) ) && <ApproveBtn
          authMap.AGREE && (
            <ApproveBtn
              username={username}
              hisTasks={hisTasks}
              hisInstance={hisInstance}
              type="agree"
              updateWorkFlow={() => {
                props.capacity.forceUpdateDynamicWorkFlowData = true;
                props.capacity.forceUpdateDynamicData = true;
              }}
            >
              {(showPopconfirm) => {
                return (
                  <Button
                    type="primary"
                    text="同意"
                    className="todo_opt_btn todo_agree c-btn-blue"
                    onClick={() => {
                      showPopconfirm();
                      props.capacity.setEditable(false);
                    }}
                  >
                    同意
                  </Button>
                );
              }}
            </ApproveBtn>
          )
        }
        {
          // ( authMap.REFUSE && props.systemPage.userHasAuth(14402) ) && <ApproveBtn username={username} hisTasks={hisTasks} hisInstance={hisInstance}
          authMap.REFUSE && (
            <ApproveBtn
              username={username}
              hisTasks={hisTasks}
              hisInstance={hisInstance}
              updateWorkFlow={() => {
                props.capacity.forceUpdateDynamicWorkFlowData = true;
                props.capacity.forceUpdateDynamicData = true;
              }}
              type="refuse"
            >
              {(showPopconfirm) => {
                return (
                  <Button
                    type="primary"
                    text="拒绝"
                    className="todo_opt_btn todo_refuse c-btn-red"
                    onClick={() => {
                      showPopconfirm();
                      props.capacity.setEditable(false);
                    }}
                  >
                    拒绝
                  </Button>
                );
              }}
            </ApproveBtn>
          )
        }
        {
          // ( authMap.REBACK && props.systemPage.userHasAuth(14401) ) && <ApproveBtn username={username} hisTasks={hisTasks} hisInstance={hisInstance}
          authMap.REBACK && (
            <ApproveBtn
              username={username}
              hisTasks={hisTasks}
              hisInstance={hisInstance}
              updateWorkFlow={() => {
                props.capacity.forceUpdateDynamicWorkFlowData = true;
                props.capacity.forceUpdateDynamicData = true;
              }}
              type="reback"
            >
              {(showPopconfirm) => {
                return (
                  <Button
                    type="primary"
                    text="撤回"
                    className="todo_opt_btn todo_reback c-btn-blue"
                    onClick={() => {
                      showPopconfirm();
                      props.capacity.setEditable(false);
                    }}
                  >
                    撤回
                  </Button>
                );
              }}
            </ApproveBtn>
          )
        }

        {SUBMIT &&
          !authMap.AGREE &&
          !authMap.REFUSE &&
          !authMap.REBACK &&
          !editable && (
            // && props.systemPage.userHasAuth(14302) ) &&
            <Button className="" type="primary" onClick={validateUpdateBtn}>
              修改{" "}
            </Button>
          )}
        {!authMap.AGREE && !authMap.REFUSE && !authMap.REBACK && editable && (
          <span>
            {/* 提交按钮 */}
            <SaveBtn save={save} setEditable={props.capacity.setEditable} />
            <Button
              className="reset"
              onClick={(e) => {
                resetOrgTableDatas("cancel");
                props.capacity.setEditable(false);
              }}
            >
              {" "}
              取消{" "}
            </Button>
          </span>
        )}
      </div>
    );
  };

  return (
    <Suspense
      fallback={
        <div className="load_spin">
          <Spin tip="加载中..." />
        </div>
      }
    >
      <div className="table_cont">
        {kind === "dynamic" && authBtn()}

        {tableData.length > 0 && (
          <Table
            components={{
              body: {
                row: EditableRow,
                cell: EditableCell,
              },
            }}
            loading={loading}
            columns={mergedColumns}
            dataSource={tableData}
            size="small"
            bordered
            pagination={false}
            rowClassName={setRowClassName}
            className="capacity_number_table"
          />
        )}
      </div>
    </Suspense>
  );
};

export default inject("capacity", "systemPage")(observer(CapacityTable));

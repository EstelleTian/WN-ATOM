import React,{ Fragment, useEffect,useState } from 'react';
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import RunwayFormworkTable from './RunwayFormworkTable';
import { requestGet2 } from "utils/request";
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined,PlusSquareOutlined } from '@ant-design/icons';
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
import { Table } from 'antd';
import './RunwayFormworkmanagement.scss'

// 跑道模板列表
function RunwayFormworkmanagement(props) {
    const [runwayTemplate,setRunwayTemplate] = useState()

    
    const { confirm } = Modal;
    const { RunwayFormworkmanagementData, systemPage } = props;
    // 模态框显隐
    const templateVisible = RunwayFormworkmanagementData.templateVisible
    // 用户id
    const userId = systemPage.user.id || "";
    // 当前系统
    const activeSystem = systemPage.activeSystem || {};
    // 系统region
    const region = activeSystem.region || "";
    // 机场
    const airport = region;



    const showConfirm = (row) => {
      confirm({
        title: '确定要删除此项吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          delItem(row)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    // 获取数据处理
    const ProcessDataGet = (data)=>{
      const arr = []
      data.map((item,index)=>{
        const obj = {}
        if (item.logicRWDef === item.logicRWNameA) {
          obj.logicRWTaxitime = item.logicRWTaxitimeA
          obj.logicRWValue = item.logicRWValueA
        }else if(item.logicRWDef === item.logicRWNameB){
          obj.logicRWTaxitime = item.logicRWTaxitimeB
          obj.logicRWValue = item.logicRWValueB
        }  
        obj.templateName =  item.templateName
        obj.operationmode =  item.operationmode
        obj.logicRWDef =  item.logicRWDef
        obj.wayPoint =  item.wayPoint
        obj.isDepRW =  item.isDepRW
        obj.groupId =  item.groupId
        obj.apName =  item.apName
        obj.key =  item.key
        arr.push(obj)
      })
      return arr
    }

     //获取跑道模板数据
    const getRunwayTemplate = async () => {
      RunwayFormworkmanagementData.toggleLoad(true);
      try {
          const res = await requestGet2({
            url: ReqUrls.getRunwayTemplateUrl + userId + '?airportStr=' + airport,
          });
          const {lstRWGapTemplateMap} = res
          let arr = []
          Object.values(lstRWGapTemplateMap).reverse().flat().map((item,index)=>{
              item["key"] = item.id
              arr.push(item)
              return arr
          })
          setRunwayTemplate(ProcessDataGet(arr))
        } catch (e) {
          customNotice({
            type: "error",
            message: e,
          });
        }
      };
  
    // 关闭模态框
    const hideModal = () => {RunwayFormworkmanagementData.toggleTemplateVisible(false)}
    // 增加选项将需要的值存入store
    const addRunwy = ()=>{
        RunwayFormworkmanagementData.toAddVisible(true);
        RunwayFormworkmanagementData.togIsGo('addRunwy')
        RunwayFormworkmanagementData.toGroupId('')
      }
    // 删除当前项
    const delItem = async(row)=>{
      let dleitem = row.groupId
      RunwayFormworkmanagementData.toggleLoad(true);
      try {
        const res = await requestGet2({
          url: ReqUrls.dleRunwayTemplateUrl + '?groupIds=' + dleitem,
        });
        if (res.bool) {
          getRunwayTemplate()
        }
      } catch (e) {
        customNotice({
          type: "error",
          message: e,
        });
      }
    }
    const columns = [
        {
          title: '模板名称',
          dataIndex: 'templateName',
          render: (text, row, index) => {
            const obj = {
              children: <a onClick={()=>{
                RunwayFormworkmanagementData.toAddVisible(true);
                RunwayFormworkmanagementData.togIsGo('updataRunwy')
                RunwayFormworkmanagementData.toGroupId(row.groupId)
                RunwayFormworkmanagementData.toAirport(row.apName)
                RunwayFormworkmanagementData.toTemplateName(row.templateName)
              }}>{text}</a>,
              props: {},
            };
            if (index%2 === 0) {
              obj.props.rowSpan = 2;
            }else{
              obj.props.colSpan = 0;
            }
            return obj;
          },
        },
        {
          title: '运行模式',
          dataIndex: 'operationmode',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (value != '') {
                if (value*1 == 200) {
                    obj.children = '走廊口模式'
                }else if (value*1 == 100) {
                    obj.children = '就近模式'
                }
            }
            if (index%2 === 0) {
              obj.props.rowSpan = 2;
            }else{
                obj.props.colSpan = 0;
            }
            return obj;
          },
        },
        {
          title: '跑道方向',
          dataIndex: 'logicRWDef'
        },
        {
          title: '使用情况',
          dataIndex: 'isDepRW',
          render: (value, row, index) => {
            const obj = {
              children: value
            };
            if (value*1 == 0) {
                obj.children = '关闭'
            }else if (value*1 == 1) {
                obj.children = '起飞'
            }else if (value*1 == 2) {
                obj.children = '起降'
            }else if (value*1 == -1) {
                obj.children = '降落'
            }
            return obj;
          },
        },
        {
          title: '起飞间隔',
          dataIndex: 'logicRWValue'
        },
        {
          title: '默认滑行',
          dataIndex: 'logicRWTaxitime'
        },
        {
          title: '走廊口',
          dataIndex: 'wayPoint'
        },
        {
          title: '操作',
          dataIndex: 'cz',
          render: (value, row, index) => {
            const obj = {
              children: <div>
                <a onClick={()=>showConfirm(row)}>删除</a>
              </div>,
              props: {},
            };
            if (index%2 === 0) {
              obj.props.rowSpan = 2;
            }else{
                obj.props.colSpan = 0;
            }
            return obj;
          },
        }
      ];
      // 动态更新跑道模板表格数据
      useEffect(()=>{
        getRunwayTemplate()
      },[RunwayFormworkmanagementData.AddVisible])
    return (
        <Fragment>
            <DraggableModal
                // 是否垂直居中展示
                centered={true}
                title={`跑道模板配置`}
                // centered为true 则无需设置style
                visible={templateVisible}
                // handleOk={() => { }}
                handleCancel={hideModal}
                width={1200}
                maskClosable={false}
                mask={true}
                className="runway-modal"
                // destroyOnClose设置为true,每次打开模态框子组件挂载，关闭模态框子组件卸载
                destroyOnClose={true}
                footer={""}
            >
                <div className='template_configuration'>
                    <Table columns={columns} dataSource={runwayTemplate} pagination={false} bordered />
                    
                    <div className='template_configuration_bottom'>
                        <div className='addList' onClick={addRunwy}><PlusSquareOutlined className='iconAdd' /> 增加</div>
                    </div>
                </div>
            </DraggableModal>
            <RunwayFormworkTable/>
        </Fragment>
    )
}
export default inject("systemPage","RunwayFormworkmanagementData","RunwayDynamicPublishFormData")(observer(RunwayFormworkmanagement))
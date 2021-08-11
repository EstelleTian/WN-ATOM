import React,{ Fragment, useEffect,useState } from 'react';
import { observer, inject } from "mobx-react";
import DraggableModal from 'components/DraggableModal/DraggableModal'
import Tan from './tanchuang';
import { Modal, Button, Space } from 'antd';
import { requestGet2 } from "utils/request";
import { ReqUrls } from "utils/request-urls";
import { customNotice } from "utils/common-funcs";
// import Form from "components/RunwayDynamicPublishModal/Form";
import { Table } from 'antd';
import './RunwayFormworkmanagement.scss'



function RunwayFormworkmanagement(props) {
    const [runwayTemplate,setRunwayTemplate] = useState()

    const { RunwayFormworkmanagementData, systemPage } = props;
    // 模态框显隐
    const templateVisible = RunwayFormworkmanagementData.templateVisible
    // 关闭模态框
    const hideModal = () => {
        RunwayFormworkmanagementData.toggleTemplateVisible(false)
    }
    // 用户id
    const userId = systemPage.user.id || "";
    // 当前系统
    const activeSystem = systemPage.activeSystem || {};
    // 系统region
    const region = activeSystem.region || "";
    // 机场
    const airport = region;

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
        setRunwayTemplate(arr)
      } catch (e) {
        customNotice({
          type: "error",
          message: e,
        });
      }
  };
  
//   getRunwayTemplate() dleRunwayTemplateUrl
  // useEffect(()=>{
  //   getRunwayTemplate()
  // },[])
  useEffect(()=>{
    getRunwayTemplate()
  },[RunwayFormworkmanagementData.AddVisible])
    const addRunwy = ()=>{
      RunwayFormworkmanagementData.toAddVisible(true);
        RunwayFormworkmanagementData.togIsGo('addRunwy')
        RunwayFormworkmanagementData.toGroupId('')
      }
    const delItem = async(row)=>{
      let dleitem = row.groupId
      RunwayFormworkmanagementData.toggleLoad(true);
      // confirm({
      //   title: 'Do you Want to delete these items?',
      //   icon: <ExclamationCircleOutlined />,
      //   content: 'Some descriptions',
      //   onOk() {
          
      //   },
      //   onCancel() {
      //     console.log('Cancel');
      //   },
      // });
      try {
        const res = await requestGet2({
          url: ReqUrls.dleRunwayTemplateUrl + '?groupIds=' + dleitem,
        });
        if (res.bool) {
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
          setRunwayTemplate(arr)
        }
      } catch (e) {
        customNotice({
          type: "error",
          message: e,
        });
      }
    }
    let logicRWValue = 'logicRWValueA'
    let logicRWTaxitime = 'logicRWTaxitimeA'
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
          // 跑道状态 0:关闭  1:起飞  2:起降 -1:降落
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
          dataIndex: 'logicRWValueA'
        },
        {
          title: '默认滑行',
          dataIndex: 'logicRWTaxitimeA'
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
                <a onClick={()=>delItem(row)}>删除</a>
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
                        <div onClick={addRunwy}>增加</div>
                    </div>
                </div>
            </DraggableModal>
            <Tan/>
        </Fragment>
    )
}
export default inject("systemPage","RunwayFormworkmanagementData","RunwayDynamicPublishFormData")(observer(RunwayFormworkmanagement))
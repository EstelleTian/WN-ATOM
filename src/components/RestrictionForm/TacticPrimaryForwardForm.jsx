import React, { Fragment,useState, useEffect } from 'react'
import { Form, Radio  } from 'antd'
import { inject, observer } from "mobx-react";
import { async } from '@antv/x6/lib/registry/marker/async';

//方案来源表单
function TacticPrimaryForwardForm(props) {

    const { schemeFormData, form, pageType} = props;
    // console.log(10,pageType);
    const [value, setValue] = useState('');

    const onChange = (e) => {
      setValue(e.target.value);
      schemeFormData.updateTacticPrimaryForward(e.target.value)
    };
    // // 方案基础信息
    // const basicTacticInfo = schemeFormData.schemeData.basicTacticInfo || {};

    
    const tacticPrimaryForward = schemeFormData.tacticPrimaryForward;
    // // 表单初始化默认值
     //方案名称发生变化触发更新
    useEffect(()=>{
        if (pageType == "IMPORT") {
            setValue('200');
            schemeFormData.updateTacticPrimaryForward('200')
        }else if (pageType == "CREATE"  ) {
            setValue('100');
            schemeFormData.updateTacticPrimaryForward('100')
        }
    },[])
    useEffect(function () {
        if (pageType == "IMPORT") {
            setValue('200');
        }else if (pageType == "CREATE"  ) {
            setValue('100');
            schemeFormData.updatePrimaryUnit('NW')
            // console.log();
        }
        //重置表单，用以表单初始值赋值
        form.resetFields();
    }, [tacticPrimaryForward]);
    let initialValues = {
        tacticPrimaryForward,
    }
    // console.log(30,initialValues);
    return (
        <Fragment>
            <Form
                form={form}
                labelAlign='left'
                initialValues={initialValues}
            >
                <Form.Item
                    colon={false}
                    className="advanced-item"
                    name="tacticPrimaryForward"
                    label="方案来源"
                    required={true}
                    rules={[{ required: true }]}
                >
                    <Radio.Group onChange={onChange} value={value} >
                        <Radio value="100">原发<span className='primaryColor'>原发</span></Radio>
                        <Radio value="200">转发</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default inject("schemeFormData",)(observer(TacticPrimaryForwardForm));

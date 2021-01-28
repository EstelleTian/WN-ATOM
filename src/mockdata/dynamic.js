/*
 * @Author: your name
 * @Date: 2021-01-28 11:13:16
 * @LastEditTime: 2021-01-28 11:22:31
 * @LastEditors: Please set LastEditors
 * @Description: 动态容量配置模拟数据
 * @FilePath: \WN-ATOM\src\mockdata\dynamic.js
 */

const data = {
    expressResultIndicatior: null,
    generateTime: "202101281104",
    result: {
        capacityVal: {},
        capacityL1: {},
        capacityL2: {},
        capacityL3: {},
    }
}
//生成24*4时间刻度
let tArr = [];
for( let i = 0; i<24; i++){
    let hour = ( i< 10) ? "0"+i : i;
    hour = hour + "";
    for( let j = 0; j < 4; j++){
        let min = "00";
        switch(j){
            case 0: min = "00";break;
            case 1: min = "15";break;
            case 2: min = "30";break;
            case 3: min = "45";break;
        }
        
        tArr.push(hour+min);
    }
}

tArr.map( key => {
    data.result.capacityVal[key] = 88;
    data.result.capacityL1[key] = 3;
    data.result.capacityL2[key] = 8;
    data.result.capacityL3[key] = 12;
});

console.log(data)
export default data

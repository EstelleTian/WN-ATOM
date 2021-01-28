/*
 * @Author: your name
 * @Date: 2021-01-28 09:09:44
 * @LastEditTime: 2021-01-28 16:26:47
 * @LastEditors: Please set LastEditors
 * @Description: 静态容量
 * @FilePath: \WN-ATOM\src\mockdata\static.js
 */
// const data = {
//     expressResultIndicatior: null,
//     generateTime: "202101281104",
//     map: {
//         capacityVal: 50,
//         capacityL1: 5,
//         capacityL2: 10,
//         capacityL3: 15,
//     }
// }
// export default data

let data1 = {
    list: [{
        key: 1,
        time: "全天",
        hourMaxDEPARR: 52,
        hourMaxDEP: 36,
        hourMaxARR: 41,
        quarterMaxDEPARR: 18,
        quarterMaxDEP: 12,
        quarterMaxARR: 15,
    }]
}

let data24 = {
    list: []
}
//生成24小时数据
for( let i = 0; i<24; i++){
    let hour = ( i< 10) ? "0"+i : i;
    hour = hour + "";
    let obj = {
        key: hour,
        time: hour,
        hourMaxDEPARR: 52,
        hourMaxDEP: 36,
        hourMaxARR: 41,
        quarterMaxDEPARR: 18,
        quarterMaxDEP: 12,
        quarterMaxARR: 15,
    }
    data24.list.push( obj );
}
export { data1, data24 } 

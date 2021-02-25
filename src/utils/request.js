/*
 * @Author: your name
 * @Date: 2020-12-23 20:10:28
 * @LastEditTime: 2021-02-25 10:26:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\request.js
 */
/**
 * Created by adcc on 2020/12/18.
 */
import axios from 'axios';
import {  isValidVariable, isValidObject } from 'utils/basic-verify'

/*axios  get 请求
 * @param url 请求url
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 */
const requestGet = ( parameters  ) => {
    const {url, params, resFunc, errFunc } = parameters;
    axios.get( url, {
        params
    }).then( response => {

        const data = response.data;
        if(isValidObject(data) && isValidVariable(data.status) && data.status === 200){
            resFunc( data );
        } else if( typeof errFunc == 'function' ){
            if(isValidObject(data) && isValidObject(data.error) && isValidVariable(data.error.message)){
                errFunc( data.error.message );
            } else {
                errFunc("");
            }
        }

    }).catch( err => {
        if( typeof errFunc == 'function'){
            errFunc(  err );
        }
        console.error(err);
    })
};

/*axios  get 请求
 * @param url 请求url
 * @param type 请求类型  POST PUT DELETE
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 * @param errFunc 失败后的回调函数
 *
 */
const request = ( parameters ) => {
    const {url, method, params, resFunc, errFunc, headers='application/json; charset=utf-8'} = parameters;
    axios({
        method,
        url,
        data: params,
        headers: {
            'Content-Type': headers
        }
    }).then( response => {
        const data = response.data;
        if(isValidObject(data) && isValidVariable(data.status) && data.status === 200){
            resFunc( data );
        } else if( typeof errFunc == 'function' ){
            if(isValidObject(data) && isValidObject(data.error) && isValidVariable(data.error.message)){
                errFunc( data.error.message );
            } else {
                errFunc();
            }
        }
    }).catch( err => {
        if( typeof errFunc == 'function'){
            errFunc( "", err );
        }
        console.error(err);
    })
};


export { requestGet, request };
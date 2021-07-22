/*
 * @Author: your name
 * @Date: 2021-07-22 14:25:56
 * @LastEditTime: 2021-07-22 14:27:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\crpyto_utils.js
 */
import CryptoJs from 'crypto-js'

//加密
const encrypt = (word)=> {
    let key = CryptoJs.enc.Utf8.parse("adcc82325050");
    let srcs = CryptoJs.enc.Utf8.parse(word);
    let encrypted = CryptoJs.AES.encrypt(srcs, key, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7
    });
    return encrypted.toString();
}
//解密
const decrypt = (word) => {
    let key = CryptoJs.enc.Utf8.parse("adcc82325050");
    let decrypt = CryptoJs.AES.decrypt(word, key, {
        mode: CryptoJs.mode.ECB,
        padding: CryptoJs.pad.Pkcs7
    });
    return CryptoJs.enc.Utf8.stringify(decrypt).toString();
}
 
export  {encrypt, decrypt}


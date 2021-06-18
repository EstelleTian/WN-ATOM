/*
 * @Author: your name
 * @Date: 2021-06-18 13:08:06
 * @LastEditTime: 2021-06-18 13:58:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \WN-ATOM\src\utils\jms-websocket.js
 */
import Stomp from "stompjs";
/**
 * JMS Websocket
 *
 * @param urls URL
 * @param usr 用户名
 * @param pwd 密码
 * @param subscriber 消息订阅者
 * @constructor
 */
 function JmsWebsocket(urls, usr, pwd, subscriber) {

    /**
     * URLs(support ActiveMQ cluster)
     */
    this.urls = urls;

    /**
     * 用户名
     */
    this.usr = usr;

    /**
     * 密码
     */
    this.pwd = pwd;

    /**
     * 当前连接的URL
     */
    this.url = null;

    /**
     * 消息接收对象
     */
    this.client = null;

    /**
     * 消息订阅者
     * <p>
     * 使用Object类型保存Map格式数据, key:topic_name value:topic_callback
     */
    this.subscribers = subscriber;

}

/**
 * 创建连接
 *
 * @param callback 回调方法
 */
JmsWebsocket.prototype.connect = function (callback) {
    let res = "fail";
    // 对象代理
    let proxy = this;

    // 连接成功时回调方法
    let onconnect = null;
    onconnect = function (frame) {
        res = "success";
        console.log('jms-websocket connect to: ' + proxy.url + ' success');

        // 订阅消息
        for (let dest in proxy.subscribers) {
            let onmessage = proxy.subscribers[dest];
            proxy.subscribe(dest, onmessage);
        }

        if (callback != undefined && callback != null && typeof callback == 'function') {
            callback();
        }
    };

    // 连接失败时回调方法
    let onerror = null;
    onerror = function (error) {
        // 切换连接
        proxy.switchUrl();

            console.log('jms-websocket connect error: ' + error + ', try to reconnect to ' + proxy.url + ' ...');
        

        // 创建消息接收对象
        proxy.client = Stomp.client(proxy.url);

        // 重新建立连接
        proxy.client.connect(proxy.usr, proxy.pwd, onconnect, onerror);
    };

    try {
        // 选择连接
        proxy.switchUrl();

        console.log('jms-websocket connect to: ' + proxy.url);
        
        res = "success";
        // 创建消息接收对象
        proxy.client = Stomp.client(proxy.url);
        proxy.client.debug = function(){}
        // 连接至MQ服务器
        proxy.client.connect(proxy.usr, proxy.pwd, onconnect, onerror);

    } catch (e) {
        console.error('jms-websocket connect fail, error: ' + e);
    }

    return res;
};

/**
 * 断开连接
 *
 * @param callback 回调方法
 */
JmsWebsocket.prototype.disconnect = function (callback) {
    let proxy = this;
    let ondisconnect = function () {
        console.error('jms-websocket disconnect from: ' + proxy.url);

        if (callback != undefined && callback != null && typeof callback == 'function') {
            callback();
        }
    };

    // TODO 目前disconnect方法在stomp.js中会触发onclose事件，导致调用onerror方法
    // 由于页面暂时不会主动调用断开连接 暂不处理
    this.client.disconnect(ondisconnect);
};


/**
 *
 */
JmsWebsocket.prototype.switchUrl = function () {
    // 拆分为地址集合
    let array = this.urls.split(',');

    // 判断当前是否有有效的URL值
    if (this.url == null || this.url == '') {
        this.url = array[0];
    } else {
        // 判断当前URL在集合中的位置
        let index = 0;
        for (let i in array) {
            if (this.url == array[i]) {
                index = i;
            }
        }
        // 判断位置的有效性
        if (index == (array.length - 1)) {
            index = 0;
        } else {
            index++;
        }
        this.url = array[index];
    }
};

/**
 * 发送文本消息
 *
 * @param dest
 * @param text
 */
JmsWebsocket.prototype.send = function (dest, text) {
    client.send(dest, {foo: 1}, text);
};

/**
 * 添加消息订阅
 *
 * @param dest
 * @param onmessage
 */
JmsWebsocket.prototype.subscribe = function (dest, onmessage) {
    if (dest == undefined || dest == null || dest == ''
        || !(dest.indexOf('/exchange/') == 0 || dest.indexOf('/topic/') == 0)) {
            console.log('jms-websocket invalid subscribe destination, destination: ' + dest);
        return;
    }
    if (onmessage == undefined || onmessage == null || typeof onmessage != 'function') {
        console.error('jms-websocket invalid subscribe onmessage, onmessage: ' + onmessage);
        return;
    }

    this.subscribers[dest] = onmessage;
    this.client.subscribe(dest, onmessage);
        console.log('jms-websocket subscribe: ' + dest + ' success');
    
};

/**
 * 取消订阅
 *
 * @param dest
 */
JmsWebsocket.prototype.unsubscribe = function (dest) {
    delete this.subscribers[dest];
    // TODO 尚未确认取消方式
//	proxy.client.subscribe(proxy.dest, proxy.onmessage);
};


export default JmsWebsocket;
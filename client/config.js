/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://logvtll1.qcloud.la/';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //下载商品列表
        productList: `${host}/weapp/product`,

        //下载商品详情
        productDetail: `${host}/weapp/product/`,

        orderList: `${host}/weapp/order`,

        addOrder: `${host}/weapp/order`,

        user: `${host}/weapp/user`,

<<<<<<< HEAD
        //从购物车列表中清除已购买商品
        deletePaid: `${host}/weapp/trolley`,

        user: `${host}/weapp/user`,
=======
>>>>>>> parent of 525efb2... 购物车中支付即消失
    }
};

module.exports = config

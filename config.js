/*
  1，相关全局配置，比如Ajax 请求的url地址，网络图片地址，第三方请求地址等    
  2，navBar字段 自定义导航相关配置说明
    { 
      name: '导航标题',
      selected: true, //默认为第一为选中，其他设置为false
      nid: 0, //导航id(以数字从0开始，按照顺序排列，依次加1，建议最多设置5个导航按钮)
      icon: 'search_bh.png',//未选中的导航图标(确保images文件夹里有图片)
      icon_s: 'search_bh_s.png', //选中的导航图标(确保images文件夹里有图片)
      path: '../index/index'//跳转路径（填写相对路径）
   }
 test wxb77b3cbdf17a6026
  online wxaac1ec0ffd37fc96
*/
module.exports={
  // url:'https://outlets.jeemoo.com/client',
  // imgUrl:'https://outlets.jeemoo.com/',//图片地址
   url:'http://outlets.netwintech.com/client',
  imgUrl: 'http://outlets.netwintech.com/',//图片地址
  staticUrl:'',
  debug:false,//如果为真，则使用假数据
  //自定义导航（参考案例，根据实际项目来配置相关属性）
  /*
   {
        "pagePath": "../index/index",
        "iconPath": "/images/home_no.png",
        "selectedIconPath": "/images/home_yes.png",
        "text": "活动",
        width:'40rpx',
        height:'40rpx'
      },
      {
        "pagePath": "../shop/shop",
        "iconPath": "/images/shop.png",
        "selectedIconPath": "/images/shop_yes.png",
        "text": "商城",
        width: '48rpx',
        height: '45rpx'
      },
      {
        "pagePath": "../intShop/intShop",
        "iconPath": "/images/jf_no.png",
        "selectedIconPath": "/images/jf_yes.png",
        "text": "积分商城",
        width: '48rpx',
        height: '43rpx'
      },
      {
        "pagePath": "../myCenter/myCenter",
        "iconPath": "/images/my_no.png",
        "selectedIconPath": "/images/my_yes.png",
        "text": "我的",
        width: '51rpx',
        height: '41rpx'
      }
  
  */
  navBar:[
    { 
      name: '首页',
      selected: true, 
      icon: '../../images/nav_icon/index_no.png',
      icon_s: '../../images/nav_icon/index_s.png', 
      path: '../index/index' ,
      width:42,
      height:40
    },

    {
      name: '我的',
      selected: false,
      icon: '../../images/nav_icon/my_no.png',
      icon_s: '../../images/nav_icon/my_yes.png',
      path: '../myCenter/myCenter',
      width: 32,
      height: 40,
    //  navType :'navigateTo'
    }
    ]
}
/*

"tabBar": {
    "custom": false,
    "color": "#a1a1a1",
    "selectedColor": "#fa334a",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/home_no.png",
        "selectedIconPath": "images/home_yes.png",
        "text": "订房"
      },
      {
        "pagePath": "pages/myOrderList/myOrderList",
        "iconPath": "images/shop.png",
        "selectedIconPath": "images/shop_yes.png",
        "text": "商店"
      },
      {
        "pagePath": "pages/myCenter/myCenter",
        "iconPath": "images/my_no.png",
        "selectedIconPath": "images/my_yes.png",
        "text": "我的"
      }
    ]
  },
*/
/*
 "tabBar": {
    "backgroundColor":"white",
    "color": "#999999",
    "selectedColor": "#605858",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "./images/home_no.png",
        "selectedIconPath": "./images/home_yes.png"
      },
      {
        "pagePath": "pages/myCenter/myCenter",
        "text": "我的",
        "iconPath": "./images/my_no.png",
        "selectedIconPath": "./images/my_yes.png"
      }
    ]
  },
*/

/*
"tabBar": {
    "custom": true,
    "color": "#797979",
    "selectedColor": "#a68171",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/home_no.png",
        "selectedIconPath": "images/home_yes.png",
        "text": "订房"
      },
      {
        "pagePath": "pages/shop/shop",
        "iconPath": "/images/shop.png",
        "selectedIconPath": "/images/shop_yes.png",
        "text": "商城"
      },
      {
        "pagePath": "pages/intShop/intShop",
        "iconPath": "/images/shop.png",
        "selectedIconPath": "/images/shop_yes.png",
        "text": "积分商城"
      },
      {
        "pagePath": "pages/myCenter/myCenter",
        "iconPath": "images/my_no.png",
        "selectedIconPath": "images/my_yes.png",
        "text": "我的"
      }
    ]
  },

*/
const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const key = "R7VBZ-QNF36-45PSU-MYTLF-N66GE-A7FU3";
class Location{
  constructor(){
    this.QQMap = new QQMapWX({
      key: key
    });
    this.searchKey('soho').then(res=>{
      console.log(res)
    }).catch(err=>{

    })
  }
  //关键词搜索
  searchKey(keyword){
    let pro=new Promise((resolve,reject)=>{
      this.QQMap.getSuggestion({
        keyword: keyword,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
    return pro;
  }
  //路线规划
  driving(type ='/ws/direction/v1/bicycling',startPos,endPos){
    /*
    39.989221,116.306076
    39.828050,116.436195
    */
    /*
      /ws/direction/v1/driving    路线规划:驾车
      /ws/direction/v1/walking    路线规划:步行
      /ws/direction/v1/transit    路线规划:公交
      /ws/direction/v1/bicycling    路线规划:自行
    */
    let url = `https://apis.map.qq.com/${type}/?from=${startPos}&to=${endPos}&key=${key}`;
      var _this = this;
      //网络请求设置
      var opt = {
          //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
          url: url,
          method: 'GET',
          dataType: 'json',
          //请求成功回调
          success: function (res) {
              var ret = res.data
              if (ret.status != 0) return; //服务异常处理
              var coors = ret.result.routes[0].polyline, pl = [];
              //坐标解压（返回的点串坐标，通过前向差分进行压缩）
              var kr = 1000000;
              for (var i = 2; i < coors.length; i++) {
                    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
              }
              //将解压后的坐标放入点串数组pl中
              for (var i = 0; i < coors.length; i += 2) {
                  pl.push({ latitude: coors[i], longitude: coors[i + 1] })
              }
              //设置polyline属性，将路线显示出来
      //         _this.setData({
      //             polyline: [{
      //                 points: pl,
      //                 color: '#FF0000DD',
      //                 width: 2
      //             }]
      //         })
          }
      };
      wx.request(opt);
}
}
let location = new Location();
export { location as Location }
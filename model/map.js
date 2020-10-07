
class Location {
  constructor() {
    this.mapCtx = null;

    // this.searchKey('石家庄').then(res => {
    //   console.log(res)
    // }).catch(err => {

    // })

  }
  //初始化
  init(mid) {
    this.mapCtx = wx.createMapContext(mid);
    this.mapCtx.moveToLocation();
    
  }
  //获取地图中心点位置
  getCenterPos() {
    let pro = new Promise((resolve, reject) => {
      this.mapCtx.getCenterLocation({
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
  //移动到当前位置
  moveCenter() {
    this.mapCtx.moveToLocation();
  }
  //移动到缩放视野展示
  moveInclude(points) {

    this.mapCtx.includePoints({
      points
    })
  }
  getCenterLocation(){
    return this.mapCtx.getCenterLocation
  }
  //创建marker
  createMarker(latitude, longitude, id, width,height, img) {
    return {
      iconPath: img || './position.png',
      id: id,
      latitude: latitude,
      longitude: longitude,
      width: width,
      height: height,
    }

  }


}
let location = new Location();
export { location as Location }
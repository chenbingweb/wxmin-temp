export default class Canvas{
  constructor(cid,ow,oh) {
    this.sw = getApp().globalData.screenWidth;
    this.sh = getApp().globalData.screenHeight;
    this.ctx = wx.createCanvasContext(cid);
    this.ow=ow;
    this.oh=oh;
    return this
  }
  drawImg(param){
    let obj={
      src: param.src,
      x: (param.x / this.ow) * this.sw ,
      y: (param.y / this.oh) * this.sh,
      w: (param.w / this.ow) * this.sw ,
      h: (param.h / this.oh) * this.sh,
      shadow: param.shadow || false
    }
    this.ctx.save()
    if (obj.shadow) {
      this.ctx.setShadow(0, 2, 10, '#000')
    }
    this.ctx.drawImage(obj.src,obj.x,obj.y,obj.w,obj.h)
    this.ctx.restore()
  }
  //绘制网络图片
  drawUrlImg(param){
    let obj = {
      src: param.src,
      x: (param.x / this.ow) * this.sw,
      y: (param.y / this.oh) * this.sh,
      w: (param.w / this.ow) * this.sw,
      h: (param.h / this.oh) * this.sh,
      shadow: param.shadow||false
    }
    let pro = new Promise((resolve, reject) => {
      wx.downloadFile({
        url: obj.src,
        success: res => {
          this.ctx.save()
          if (obj.shadow)
          {
            this.ctx.setShadow(0, 2, 10, '#000')
          }
          else
          {
            this.ctx.setShadow(0, 0, 0, '#fff')
          }
          this.ctx.drawImage(res.tempFilePath, obj.x, obj.y, obj.w, obj.h);
          this.ctx.restore()
          resolve(true)
        },
        fail: err => {
          reject()
        }
      })
    })
    return pro
  }
  //绘制圆形图片
  //绘制网络图片
  drawCircleImg(param) {
    let obj = {
      src: param.src,
      x: (param.x / this.ow) * this.sw,
      y: (param.y / this.oh) * this.sh,
      r: (param.r / this.ow) * this.sw,
      
   //   h: (param.h / this.oh) * this.sh,
      shadow: param.shadow || false,
      cirile:param.circile||false,
     // r:param.r
    }
    let pro = new Promise((resolve, reject) => {
      wx.downloadFile({
        url: obj.src,
        success: res => {
          console.log('->',res)
          this.ctx.save()
          if (obj.shadow) {
            this.ctx.setShadow(0, 2, 10, '#000')
          }
          else
          {
            this.ctx.setShadow(0, 0, 0, '#fff')
          }
          this.ctx.beginPath();
          this.ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
          this.ctx.setLineWidth(6) 
          this.ctx.setStrokeStyle('#fff')
          this.ctx.stroke();//画空心圆
          this.ctx.closePath();
          this.ctx.arc(obj.x, obj.y, obj.r-5, 0, 2 * Math.PI)
          this.ctx.clip(); //裁剪上面的圆形 obj.x / 2, obj.y-30
          this.ctx.drawImage(res.tempFilePath, obj.x - obj.r, obj.y - obj.r, obj.r*2+10, obj.r*2+10);
          this.ctx.restore()
          resolve()
        },
        fail: err => {
          reject()
        }
      })
    })
    return pro
  }
  //绘制文字
  drawText(param){
    let obj = {
      text: param.text,
      fontSize: (param.fontSize || 24) / this.oh * this.sh,
      x: (param.x / this.ow) * this.sw,
      y: (param.y / this.oh) * this.sh,
      color:param.color||'white'
    }
    let w = this.ctx.measureText(obj.text).width/2;
    this.ctx.save()
    this.ctx.setFillStyle(obj.color)
    this.ctx.setFontSize(obj.fontSize)
    this.ctx.fillText(obj.text, obj.x-w, obj.y)
    this.ctx.restore()
  }
  //绘制矩形
  drawRect(param){
    let obj = {
      color:param.color||'white',
      x: (param.x / this.ow) * this.sw,
      y: (param.y / this.oh) * this.sh,
      w: (param.w / this.ow) * this.sw,
      h: (param.h / this.oh) * this.sh,
      opacity: param.opacity||1
    }
    let w = this.ctx.measureText(obj.text).width / 2;
    this.ctx.save()
    this.ctx.setFillStyle(obj.color);
    this.ctx.setGlobalAlpha(obj.opacity);
    this.ctx.fillRect(obj.x, obj.y, obj.w, obj.h)
    this.ctx.restore()
  }

}
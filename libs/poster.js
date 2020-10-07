import Canvas from "./Canvas.js"
import Tool from "./Tool.js"
export default class Poster{

  constructor(param){
    console.log(param)
    this.imgurl = getApp().globalData.imgUrl
    //获取手机屏幕大小
    this.sw = getApp().globalData.screenWidth;
    this.sh = getApp().globalData.screenHeight;
    this.ctx = new Canvas(param.cid,750,1333)
    //海报参数
    this.data = param.data || {
      book: 'https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg',
      gift: 'https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg'
    }
    
    this.drawBg()
    
    let draw=this.ctx.ctx;
    Promise.all([
      this.drawBook(this.imgurl+this.data.book_info[0].cover_img),
      this.drawLeftPhoto(this.data.userInfo.head_img),
      //this.drawRightPhoto(),
      this.drawGift(this.imgurl + this.data.study_result.gift),
     // this.drawCode()
      ]).then(res=>{
       
        this.drawCodeBg()
      this.drawheader();
      //昵称
      this.drawLeftNC(this.data.userInfo.nickname);
      this.drawRightNC(this.data.userInfo.baby_name);
      this.drawEvalMM();
      this.drawEvalContent(this.data.study_result.content);
      this.drawRectConten(730, 770, '学习单词：' + this.data.words.length||0);
      this.drawRectConten(813, 850,'重点单词：'+3);
      this.drawRectConten(890, 930, '学习句型：' + this.data.study_result.sentence_pattern);
      let studyTime = Tool.timeChange(this.data.study_result.totalTime)
      this.drawCircleItem(100, '../../images/img/time_1.png', '学习用时', 150, studyTime.hours + ':' + studyTime.minutes + ':' + studyTime.seconds);
      this.drawCircleItem(325, '../../images/img/result_1.png', '习题成绩', 380, this.data.study_result.totalScore);
      this.drawCircleItem(553, '../../images/img/video_1.png', '动画时长', 608, this.data.cartoon_time);
      this.drawRightPhoto(this.data.userInfo.baby_img).then(res=>{
        this.drawCode(this.imgurl+this.data.code_img).then(res => {
          console.log(res)
          this.drawImgtip();
          this.drawImgLogo()
          draw.draw(true, () => {
            //保存到手机
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvasId: param.cid,
              success: res => {
                // wx.saveImageToPhotosAlbum({
                //   filePath: res.tempFilePath,
                //   success(res) {
                //     wx.showToast({
                //       title: '成绩已保存您的手机',
                //     })
                //   }
                // })
                param.callBack(res.tempFilePath)
                console.log(res.tempFilePath)
              }
            })
          });

        }).catch(err => {

        })
      }).catch(err=>{

      })
        
   
     
   
      
    }).catch(err=>{

    })
    
    return this
  }
  //绘制背景
  drawBg(){
    let src="../../images/img/bg.jpg";
    let x=0;
    let y=0;
    let w=750;
    let h = 1333 ;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
    //
    this.drawShine();
  }
  //绘制
  drawheader(){
    let src = "../../images/img/head_img.png";
    let x = (750-515)/2;
    let y = 20;
    let w = 515;
    let h = 112;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
  }
  //绘制课本
  drawBook(bookUrl){
    let src = bookUrl|| "https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg";
    let x = (750 - 325) / 2;
    let y = 70;
    let w = 325;
    let h = 325;
    let pro=this.ctx.drawUrlImg({
      src,
      x,
      y,
      w,
      h,
      shadow:false
    })
    return pro
  }
  //绘制光
  drawShine(){
    let src = "../../images/success_guang.png";
    let x = (750 - 430) / 2;
    let y = 340;
    let w = 430;
    let h = 240;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
  }
  //绘制左头像
  drawLeftPhoto(headImg){
    let src = headImg|| "https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg";
    let x = 140;
    let y = 334;
    let r = 50;
    
   return this.ctx.drawCircleImg({
      src,
      x,
      y,
      r
    })
  }
  //绘制左头像
  drawRightPhoto(headImg) {
    let src = headImg||"https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg";
    let x = 610;
    let y = 334;
    let r = 50;

    return this.ctx.drawCircleImg({
      src,
      x,
      y,
      r
    })
  }
  //添加左昵称
  drawLeftNC(name){
    let text = name+"教的妥妥哒！";
    let x = 124;
    let y = 450;
    let fontSize=33;
    this.ctx.drawText({
      text,
      x,
      y,
      fontSize,
      
    })
  }
  //添加右昵称
  drawRightNC(name) {
    let text = name+"学的棒棒哒！";
    let x = 610;
    let y = 450;
    let fontSize = 33;
    this.ctx.drawText({
      text,
      x,
      y,
      fontSize,

    })
  }
  //加载礼品
  drawGift(giftUrl){
    let src = giftUrl||"https://staticfiles.yoojooy.com/wechat/becdev/avatar/15246389399479.jpg";
    let x = (750 - 284) / 2;
    let y = 450;
    let w = 284;
    let h = 133;
    let pro = this.ctx.drawUrlImg({
      src,
      x,
      y,
      w,
      h
    })
    return pro
  }
  //妈妈评语标题
  drawEvalMM(){
    let src = "../../images/img/mmpy.png";
    let x = (750 - 149) / 2;
    let y = 608;
    let w = 149;
    let h = 35;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
  }
  //妈妈评语
  drawEvalContent(content){
    let text = content.slice(0,20);
    let x =375;
    let y = 700;
    let fontSize = 33;
    this.ctx.drawText({
      text,
      x,
      y,
      fontSize,
    })
  }
  //学习信息1
  drawRectConten(posy, tposy, text){
    let x = (750 -750) / 2;
    let y = posy;
    let w = 750;
    let h = 53;
    let opacity=0.6;
    this.ctx.drawRect({
      x,
      y,
      w,
      h,
      opacity
    })
    let text1 = text//"宝宝棒棒哒！送你一辆小汽车～";
    let x1 = 375;
    let y1 = tposy//770;
    let fontSize1 = 33;
    this.ctx.drawText({
      text: text1,
      x: x1,
      y:y1,
      fontSize: fontSize1,
      color:'#505050'
    })
  }
  //学习信息2
  drawCircleItem(posx,url,t,px,t2){
    let src = url;
    let x = posx;
    let y = 960;
    let w = 111;
    let h = 111;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
    let text = t//;
    let x1 = px;
    let y1 = 1110;
    let fontSize = 33;
    this.ctx.drawText({
      text,
      x:x1,
      y:y1,
      fontSize,
    })
    let text1 = t2//;
    let x2 = px;
    let y2 = 1150;
    let fontSize1 = 33;
    this.ctx.drawText({
      text:text1,
      x: x2,
      y: y2,
      fontSize: fontSize1,
    })

  }
  //二维码背景图
  drawCodeBg(){
    let x = (750 - 750) / 2;
    let y = 1180;
    let w = 750;
    let h =200;
    let color ="#ffc2e4";
    this.ctx.drawRect({
      x,
      y,
      w,
      h,
      color
    })
   
  }
  //绘制二维码
  drawCode(code_img){
    let src = code_img||"https://staticfiles.yoojooy.com/wechat/becdev/avatar/15247940325883.png" ;
    let x = 40;
    let y =1205;
    let w = 144;
    let h = 146;
    let pro = this.ctx.drawUrlImg({
      src,
      x,
      y,
      w,
      h
    })
    return pro
  }
  //提示
  drawImgtip(){
    let src = "../../images/img/code_tip.png";
    let x = 220;
    let y = 1265;
    let w = 264;
    let h = 81;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
  }
  //绘制logo
  drawImgLogo() {
    let src = "../../images/img/logo.png";
    let x = 558;
    let y = 1195;
    let w = 167;
    let h = 167;
    this.ctx.drawImg({
      src,
      x,
      y,
      w,
      h
    })
  }
}
let _util=require('./util.js')
//时间动画对象
function TimeAnimation(myintegral,integral, self){
  this.myintegral = myintegral;//我的积分
  this.integral = integral;//传入的积分
  this.self = self;
  this.time = 1000;//动画时间
  this.timer = null;
  this.steps = 600;//总步数
  this.step = 0;//步长
  this.interval = 0;//步频
  this.times = 0;//次数
}
TimeAnimation.prototype={
  init:function(cb){
    //计算每一步的距离
    this.step = (this.integral-this.myintegral )/ this.steps;
    //计算补品
    this.interval = this.steps / this.time;
    this.move(cb);
  },
  move:function(cb){
    var me=this;
    //次数大于步数
    if (this.times >= this.steps)
    {
      //停止计时器
      clearTimeout(this.timer);
      //清空计时器返回值
      this.timer=null;
      //重新设置为0
      this.times=0
      //结束
      return;
    }
    //每次加1
    this.times++
    //时间计算器
    this.timer=setTimeout(()=>{
      //新增积分数
      this.myintegral += this.step;
      //刷新页面
      cb(this.myintegral)
      
      //自调move方法
      this.move(cb)
    }, this.interval)
  }
}
//倒计时
function Timer(myLive, that, sysTime){
  //this.sysTime=that.sysTime;//获取系统时间
  //this.createTime = that.createTime;//获取下单时间
  this.myLive = myLive;
  this.That=that;
  this.sysTime = sysTime;
  this.init()
}
Timer.prototype={
  //初始化
  init:function(){
    this.startTimer()
  },
  //计算剩余时间
  surplusTime:function(){
    for(let i=0;i<this.myLive.length;i++){
        let lives=this.myLive[i];
        lives.create_time = new Date(lives.create_time).getTime();
        lives.times =this.sysTime - this.createTime;//计算剩余时间
        lives.subTime = this.sysTime+15*60*1000;
        console.log(lives.subTime)
    }
  },
  //开始倒计时
  startTimer:function(){
    this.surplusTime();
    for (let i = 0; i < this.myLive.length;i++){
      this.timerTime(this.myLive[i], i)(time=>{
        console.log(time)
        this.myLive[i].surTime = time;
        this.That.setData({
          myLive: this.myLive
        })
      })

    }
    
  },
  //计时器
  timerTime:function(live,index){
    //获取每一个试住房间的剩余时间
    let times = live.times;
    let timmer=null;
    let create_time = live.create_time;//获取创建订单时间 
    return function (callBack){
      timmer=setInterval(()=>{
        if (times<=0)
        {
          live.state='-1';//隐藏立即支付
          clearInterval(timmer);//停止到计算
          return 
        }
        live.subTime-=1000;
        let time = _util.formatTime(new Date(live.subTime), '-', true);
        callBack(time, index)
        times--
      },1000)

    }
    
  }
}
module.exports={
  TimeAnimation,
  Timer
}